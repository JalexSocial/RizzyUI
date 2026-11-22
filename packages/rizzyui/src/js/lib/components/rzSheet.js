import { createFocusScope } from '../../runtime/a11y/focusScope.js';
import { removeMissingReferences } from '../../runtime/a11y/triggerReference.js';
import { registerDismissableLayer } from '../../runtime/a11y/dismissableLayer.js';

export default function rzSheet() {
    return {
        open: false,
        modal: true,
        dismissOnOutsideClick: true,
        focusScope: null,
        unregisterLayer: null,

        init() {
            this.open = this.$el.dataset.defaultOpen === 'true';
            this.modal = this.$el.dataset.modal !== 'false';
            this.dismissOnOutsideClick = this.$el.dataset.dismissOnOutsideClick !== 'false';

            // SF-002, D-29: open and close from window events (HX-Trigger, $dispatch). A detail id
            // targets one sheet; without one, every sheet listening for the event reacts.
            const targets = (event) => {
                const id = event?.detail?.id;
                return !id || id === this.$el.id;
            };
            const openEvent = this.$el.dataset.eventTriggerName || '';
            const closeEvent = this.$el.dataset.closeEventName || 'rz:sheet-close';
            this._onOpenEvent = (event) => { if (targets(event)) this.show(); };
            this._onCloseEvent = (event) => { if (targets(event)) this.close(); };
            if (openEvent) window.addEventListener(openEvent, this._onOpenEvent);
            window.addEventListener(closeEvent, this._onCloseEvent);
            this._eventNames = { openEvent, closeEvent };

            // D-24: rz:sheet:open and rz:sheet:close notify state changes. Close fires after focus has
            // returned to where it was, so a listener can move it elsewhere.
            const notify = (isOpen) => this.$el.dispatchEvent(new CustomEvent(isOpen ? 'rz:sheet:open' : 'rz:sheet:close', { bubbles: true, detail: { id: this.$el.id } }));
            this.$watch('open', (isOpen) => {
                if (isOpen) {
                    this.registerInteractions();
                    this.applyClosedState(false);
                    notify(true);
                    return;
                }

                this.teardownInteractions();
                this.applyClosedState(true);
                notify(false);
            });

            // The panel is teleported, and its x-ref is registered only after this init() runs.
            // Alpine caches the $refs proxy on first access, so reading $refs here would cache an
            // empty set. Defer the initial lookup until the teleported content is initialized.
            this.$nextTick(() => {
                // A closed panel is in the DOM too, so fix its references as soon as it exists.
                removeMissingReferences(this.getPanel());
                this.applyClosedState(!this.open);
                if (this.open) {
                    this.registerInteractions();
                    // A sheet rendered open (DefaultOpen) opened too.
                    notify(true);
                }
            });
        },

        registerInteractions() {
            const panel = this.getPanel();
            if (!panel) {
                return;
            }

            removeMissingReferences(panel);

            if (!this.unregisterLayer) {
                this.unregisterLayer = registerDismissableLayer({
                    root: panel,
                    onDismiss: ({ reason }) => {
                        if (!this.open) return;
                        if (reason === 'outside-pointer' && !this.dismissOnOutsideClick) return;
                        this.close();
                    }
                });
            }

            if (this.modal && !this.focusScope) {
                // The `open` watcher runs before x-show has displayed the panel, so nothing inside it
                // is focusable yet and focus would stay on the trigger, behind the overlay (SF-074).
                // Activate once the panel is shown.
                this.$nextTick(() => {
                    if (!this.open || this.focusScope || !panel.isConnected) return;
                    this.focusScope = createFocusScope(panel, {
                        fallbackFocus: panel,
                        // SF-032: a selector for the element that takes focus when the sheet opens.
                        initialFocus: this.$el.dataset.initialFocus || null,
                    });
                    this.focusScope.activate();
                });
            }
        },

        destroy() {
            // Alpine calls destroy() when the sheet is removed (for example replaced by an htmx
            // swap). Without this, an open sheet would leave its dismissable layer, and that
            // layer's document listeners, registered after the DOM is gone.
            this.teardownInteractions();
            if (this._eventNames?.openEvent) window.removeEventListener(this._eventNames.openEvent, this._onOpenEvent);
            if (this._eventNames) window.removeEventListener(this._eventNames.closeEvent, this._onCloseEvent);
        },

        teardownInteractions() {
            if (this.focusScope) {
                this.focusScope.deactivate();
                this.focusScope = null;
            }

            if (this.unregisterLayer) {
                this.unregisterLayer();
                this.unregisterLayer = null;
            }
        },

        applyClosedState(closed) {
            const panel = this.getPanel();
            if (!panel) {
                return;
            }

            panel.setAttribute('aria-hidden', closed ? 'true' : 'false');
        },

        getPanel() {
            // SheetContent teleports the panel to <body>; Alpine keeps its x-ref on this component.
            return this.$refs?.rzSheetPanel ?? this.$root.querySelector('[data-rz-sheet-panel]');
        },

        toggle() {
            this.open = !this.open;
        },

        close() {
            this.open = false;
        },

        show() {
            this.open = true;
        },

        state() {
            return this.open ? 'open' : 'closed';
        }
    };
}
