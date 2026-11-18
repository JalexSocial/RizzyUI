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

            this.$watch('open', (isOpen) => {
                if (isOpen) {
                    this.registerInteractions();
                    this.applyClosedState(false);
                    return;
                }

                this.teardownInteractions();
                this.applyClosedState(true);
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
                this.focusScope = createFocusScope(panel, { fallbackFocus: panel });
                this.focusScope.activate();
            }
        },

        destroy() {
            // Alpine calls destroy() when the sheet is removed (for example replaced by an htmx
            // swap). Without this, an open sheet would leave its dismissable layer, and that
            // layer's document listeners, registered after the DOM is gone.
            this.teardownInteractions();
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
