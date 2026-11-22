import { createFocusScope } from '../../runtime/a11y/focusScope.js';
import { createDismissableLayer } from '../../runtime/a11y/dismissableLayer.js';

export default function rzModal() {
    return {
        modalOpen: false,
        eventTriggerName: '',
        closeEventName: 'rz:dialog-close',
        closeOnEscape: true,
        closeOnClickOutside: true,
        modalId: '',
        bodyId: '',
        footerId: '',
        nonce: '',
        _openListener: null,
        _closeEventListener: null,
        _focusScope: null,
        _unregisterLayer: null,
        _lastInvoker: null,

        init() {
            this.modalId = this.$el.dataset.modalId || '';
            this.bodyId = this.$el.dataset.bodyId || '';
            this.footerId = this.$el.dataset.footerId || '';
            this.nonce = this.$el.dataset.nonce || '';
            this.eventTriggerName = this.$el.dataset.eventTriggerName || '';
            this.closeEventName = this.$el.dataset.closeEventName || this.closeEventName;
            this.closeOnEscape = this.$el.dataset.closeOnEscape !== 'false';
            this.closeOnClickOutside = this.$el.dataset.closeOnClickOutside !== 'false';

            this.$el.dispatchEvent(new CustomEvent('rz:modal-initialized', { detail: { modalId: this.modalId, bodyId: this.bodyId, footerId: this.footerId }, bubbles: true }));

            if (this.eventTriggerName) {
                this._openListener = (e) => this.openModal(e);
                window.addEventListener(this.eventTriggerName, this._openListener);
            }

            // D-29: one close event; with detail.id it closes only the dialog with that id.
            this._closeEventListener = (event) => {
                const target = event?.detail?.id;
                if (target && target !== this.modalId && target !== this.$el.id) return;
                if (this.modalOpen) this.closeModalInternally('event');
            };
            window.addEventListener(this.closeEventName, this._closeEventListener);

            // The closed panel is in the DOM as well (teleported to <body>), so fix its ARIA
            // references once it exists instead of only on open (RZUI-048). $refs of teleported
            // content are available after this init(), hence $nextTick.
            this.$nextTick(() => {
                const dialogElement = this._resolveDialogElement();
                if (dialogElement) this._ensureAriaRelationships(dialogElement);
            });

            this.$watch('modalOpen', (value) => {
                const currentWidth = document.body.offsetWidth;
                document.body.classList.toggle('overflow-hidden', value);
                const scrollBarWidth = document.body.offsetWidth - currentWidth;
                document.body.style.setProperty('--page-scrollbar-width', `${scrollBarWidth}px`);

                if (value) {
                    this.$nextTick(() => {
                        this._activateAccessibility();
                        this.$el.dispatchEvent(new CustomEvent('rz:modal-after-open', { detail: { modalId: this.modalId }, bubbles: true }));
                    });
                } else {
                    this._deactivateAccessibility();
                    this.$nextTick(() => {
                        this.$el.dispatchEvent(new CustomEvent('rz:modal-after-close', { detail: { modalId: this.modalId }, bubbles: true }));
                    });
                }
            });
        },

        destroy() {
            if (this._openListener && this.eventTriggerName) window.removeEventListener(this.eventTriggerName, this._openListener);
            if (this._closeEventListener) window.removeEventListener(this.closeEventName, this._closeEventListener);
            this._deactivateAccessibility();
            document.body.classList.remove('overflow-hidden');
            document.body.style.setProperty('--page-scrollbar-width', `0px`);
        },

        _resolveDialogElement() {
            // The panel is rendered inside <template x-teleport="body">, so it is not a DOM
            // descendant of this component. Alpine keeps x-ref entries of teleported content on
            // the owning component, so resolve it through $refs first.
            return this.$refs?.rzModalPanel
                ?? this.$el.querySelector('[role="dialog"], [role="alertdialog"], [data-modal-panel="true"]');
        },

        _ensureAriaRelationships(dialogElement) {
            const labelledBy = dialogElement.getAttribute('aria-labelledby');
            const describedBy = dialogElement.getAttribute('aria-describedby');
            if (labelledBy && !document.getElementById(labelledBy)) dialogElement.removeAttribute('aria-labelledby');
            if (describedBy && !document.getElementById(describedBy)) dialogElement.removeAttribute('aria-describedby');
        },

        _activateAccessibility() {
            const dialogElement = this._resolveDialogElement();
            if (!dialogElement) return;
            this._ensureAriaRelationships(dialogElement);

            this._focusScope?.deactivate();
            this._focusScope = createFocusScope(dialogElement, {
                fallbackFocus: dialogElement,
                // SF-032: a selector for the element that takes focus when the dialog opens.
                initialFocus: this.$el.dataset.initialFocus || null,
            });
            this._focusScope.activate();

            this._unregisterLayer?.();
            const dismissable = createDismissableLayer();
            this._unregisterLayer = dismissable.registerLayer({
                id: this.modalId || undefined,
                root: dialogElement,
                onEscape: (event) => {
                    if (!this.closeOnEscape) event.preventDefault();
                },
                onOutsidePointer: (event) => {
                    if (!this.closeOnClickOutside) event.preventDefault();
                },
                onDismiss: ({ reason }) => this.closeModalInternally(reason),
            });
        },

        _deactivateAccessibility() {
            if (this._unregisterLayer) {
                this._unregisterLayer();
                this._unregisterLayer = null;
            }
            if (this._focusScope) {
                const dialogElement = this._resolveDialogElement();
                const restored = this._focusScope.deactivate();
                this._focusScope = null;
                // The scope activates after x-trap has already moved focus into the panel, so its
                // remembered element can be inside the panel that is closing. Return focus to the
                // trigger instead of to an element that is about to be hidden.
                const restoredInsidePanel = !!(restored && dialogElement?.contains?.(restored));
                if ((!restored || restored === document.body || restoredInsidePanel) && this._lastInvoker?.isConnected) {
                    this._lastInvoker.focus();
                }
            }
        },

        /**
         * Click handler for DialogTrigger / AlertDialogTrigger. Records the trigger for focus
         * restoration and raises the dialog's open event on window, so every dialog that shares
         * the event name opens as before. Bound with x-on:click (CSP-safe, unlike an inline onclick).
         */
        openFromTrigger(event) {
            const invoker = event?.currentTarget?.nodeType === 1 ? event.currentTarget : null;
            if (this.eventTriggerName) {
                window.dispatchEvent(new CustomEvent(this.eventTriggerName, { detail: { invoker } }));
            } else {
                this.openModal(event);
            }
        },

        openModal(event = null) {
            // A window event (from a trigger or from app code) has window as its target; prefer the
            // invoker passed in the detail, then the element that had focus when it was raised.
            const invoker = event?.detail?.invoker
                ?? (event?.target?.nodeType === 1 ? event.target : null)
                ?? document.activeElement;
            if (invoker?.nodeType === 1 && invoker !== document.body) this._lastInvoker = invoker;
            const beforeOpenEvent = new CustomEvent('rz:modal-before-open', { detail: { modalId: this.modalId, originalEvent: event }, bubbles: true, cancelable: true });
            this.$el.dispatchEvent(beforeOpenEvent);
            if (!beforeOpenEvent.defaultPrevented) this.modalOpen = true;
        },

        closeModalInternally(reason = 'unknown') {
            const beforeCloseEvent = new CustomEvent('rz:modal-before-close', { detail: { modalId: this.modalId, reason }, bubbles: true, cancelable: true });
            this.$el.dispatchEvent(beforeCloseEvent);
            if (!beforeCloseEvent.defaultPrevented) {
                this.modalOpen = false;
                document.body.classList.remove('overflow-hidden');
                document.body.style.setProperty('--page-scrollbar-width', `0px`);
            }
        },

        closeModal() {
            this.closeModalInternally('button');
        },

        handleClickOutside() {
            if (this.closeOnClickOutside) this.closeModalInternally('backdrop');
        }
    };
}
