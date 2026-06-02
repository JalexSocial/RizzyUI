import { createFocusScope } from '../../runtime/a11y/focusScope.js';
import { createDismissableLayer } from '../../runtime/a11y/dismissableLayer.js';

export default function rzModal() {
    return {
        modalOpen: false,
        eventTriggerName: '',
        closeEventName: 'rz:modal-close',
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

            this._closeEventListener = () => {
                if (this.modalOpen) this.closeModalInternally('event');
            };
            window.addEventListener(this.closeEventName, this._closeEventListener);

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
            return this.$el.querySelector('[role="dialog"], [role="alertdialog"], [data-modal-panel="true"]');
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
                const restored = this._focusScope.deactivate();
                this._focusScope = null;
                if ((!restored || restored === document.body) && this._lastInvoker?.isConnected) {
                    this._lastInvoker.focus();
                }
            }
        },

        openModal(event = null) {
            const invoker = event?.target ?? document.activeElement;
            if (invoker?.nodeType === 1) this._lastInvoker = invoker;
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
