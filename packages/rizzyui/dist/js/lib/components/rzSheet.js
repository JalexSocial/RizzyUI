import { createFocusScope } from '../../runtime/a11y/focusScope.js';
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

            this.applyClosedState(!this.open);
            if (this.open) {
                this.registerInteractions();
            }
        },

        registerInteractions() {
            const panel = this.getPanel();
            if (!panel) {
                return;
            }

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
            return this.$root.querySelector('[data-rz-sheet-panel]');
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
