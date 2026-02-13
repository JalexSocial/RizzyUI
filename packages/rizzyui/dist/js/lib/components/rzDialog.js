
// --------------------------------------------------------------------------------
// Alpine.js component: rzDialog
// Manages the state and behavior of a dialog.
// Can be triggered by a window event, closed via button, escape key,
// or outside click. Supports HTMX content swapping within its body/footer.
// Also listens for a 'rz:modal-close' window event triggered by HTMX responses.
// Dispatches lifecycle events: rz:modal-initialized, rz:modal-before-open,
// rz:modal-after-open, rz:modal-before-close, rz:modal-after-close.
// --------------------------------------------------------------------------------
export default function(Alpine) {
    Alpine.data('rzDialog', () => ({
        modalOpen: false, // Main state variable
        eventTriggerName: '',
        closeEventName: 'rz:modal-close', // Default value, corresponds to Constants.Events.ModalClose
        closeOnEscape: true,
        closeOnClickOutside: true,
        modalId: '',
        bodyId: '',
        footerId: '',
        nonce: '',
        _escapeListener: null,
        _openListener: null,
        _closeEventListener: null,

        /**
         * Executes the `init` operation.
         * @returns {any} Returns the result of `init` when applicable.
         */
        init() {
            this.modalId = this.$el.dataset.modalId || '';
            this.bodyId = this.$el.dataset.bodyId || '';
            this.footerId = this.$el.dataset.footerId || '';
            this.nonce = this.$el.dataset.nonce || '';
            this.eventTriggerName = this.$el.dataset.eventTriggerName || '';
            this.closeEventName = this.$el.dataset.closeEventName || this.closeEventName; // Use provided or default
            this.closeOnEscape = this.$el.dataset.closeOnEscape !== 'false';
            this.closeOnClickOutside = this.$el.dataset.closeOnClickOutside !== 'false';

            // Dispatch initialized event - Use "rz:modal-initialized"
            this.$el.dispatchEvent(new CustomEvent('rz:modal-initialized', {
                detail: { modalId: this.modalId, bodyId: this.bodyId, footerId: this.footerId },
                bubbles: true
            }));

            // Listener for the custom window event to open the modal
            if (this.eventTriggerName) {
                this._openListener = (e) => {
                    this.openModal(e);
                };
                window.addEventListener(this.eventTriggerName, this._openListener);
            }

            // Listener for the custom window event to close the modal
            this._closeEventListener = (event) => {
                if (this.modalOpen) {
                    this.closeModalInternally('event');
                }
            };
            window.addEventListener(this.closeEventName, this._closeEventListener);


            // Listener for the Escape key
            this._escapeListener = (e) => {
                if (this.modalOpen && this.closeOnEscape && e.key === 'Escape') {
                    this.closeModalInternally('escape');
                }
            };
            window.addEventListener('keydown', this._escapeListener);

            // Watch the 'modalOpen' state to manage body overflow and focus
            this.$watch('modalOpen', value => {
                const currentWidth = document.body.offsetWidth;
                document.body.classList.toggle('overflow-hidden', value);
                const scrollBarWidth = document.body.offsetWidth - currentWidth;
                document.body.style.setProperty('--page-scrollbar-width', `${scrollBarWidth}px`);
                if (value) {
                    this.$nextTick(() => {
                        const dialogElement = this.$el.querySelector('[role="document"]');
                        const focusable = dialogElement?.querySelector('button, [href], input:not([type=\'hidden\']), select, textarea, [tabindex]:not([tabindex="-1"])');
                        focusable?.focus();
                        // Dispatch after-open event - Use "rz:modal-after-open"
                        this.$el.dispatchEvent(new CustomEvent('rz:modal-after-open', {
                            detail: { modalId: this.modalId },
                            bubbles: true
                        }));
                    });
                } else {
                    this.$nextTick(() => {
                        // Dispatch after-close event - Use "rz:modal-after-close"
                        this.$el.dispatchEvent(new CustomEvent('rz:modal-after-close', {
                            detail: { modalId: this.modalId },
                            bubbles: true
                        }));
                    });
                }
            });
        },
        
        /**
         * Executes the `notModalOpen` operation.
         * @returns {any} Returns the result of `notModalOpen` when applicable.
         */
        notModalOpen() {
            return !this.modalOpen;
        },

        /**
         * Executes the `destroy` operation.
         * @returns {any} Returns the result of `destroy` when applicable.
         */
        destroy() {
            // Clean up listeners
            if (this._openListener && this.eventTriggerName) {
                window.removeEventListener(this.eventTriggerName, this._openListener);
            }
            if (this._closeEventListener) {
                window.removeEventListener(this.closeEventName, this._closeEventListener);
            }
            if (this._escapeListener) {
                window.removeEventListener('keydown', this._escapeListener);
            }
            document.body.classList.remove('overflow-hidden');
            document.body.style.setProperty('--page-scrollbar-width', `0px`);
        },

        /**
         * Executes the `openModal` operation.
         * @param {any} event Input value for this method.
         * @returns {any} Returns the result of `openModal` when applicable.
         */
        openModal(event = null) {
            // Dispatch before-open event - Use "rz:modal-before-open"
            const beforeOpenEvent = new CustomEvent('rz:modal-before-open', {
                detail: { modalId: this.modalId, originalEvent: event },
                bubbles: true,
                cancelable: true
            });
            this.$el.dispatchEvent(beforeOpenEvent);

            if (!beforeOpenEvent.defaultPrevented) {
                this.modalOpen = true;
            }
        },

        // Internal close function called by button, escape, backdrop, event
        closeModalInternally(reason = 'unknown') {
            // Dispatch before-close event - Use "rz:modal-before-close"
            const beforeCloseEvent = new CustomEvent('rz:modal-before-close', {
                detail: { modalId: this.modalId, reason: reason },
                bubbles: true,
                cancelable: true
            });
            this.$el.dispatchEvent(beforeCloseEvent);

            if (!beforeCloseEvent.defaultPrevented) {
                document.activeElement?.blur && document.activeElement.blur();
                this.modalOpen = false;
                document.body.classList.remove('overflow-hidden');
                document.body.style.setProperty('--page-scrollbar-width', `0px`);
            }
        },

        // Called only by the explicit close button in the template
        closeModal() {
            this.closeModalInternally('button');
        },

        // Method called by x-on:click.outside on the dialog element
        handleClickOutside() {
            if (this.closeOnClickOutside) {
                this.closeModalInternally('backdrop');
            }
        }
    }));
}
