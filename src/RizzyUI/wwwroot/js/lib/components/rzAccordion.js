
// --------------------------------------------------------------------------------
// Alpine.js component: rzAccordion
// This component manages the overall accordion container.
// Provides 'selected' and 'allowMultiple' properties to child rzAccordionSection components.
// --------------------------------------------------------------------------------
export default function(Alpine) {
    Alpine.data('rzAccordion', () => ({
        selected: '',          // ID of the currently selected/opened section (if not allowMultiple)
        allowMultiple: false,  // Whether multiple sections can be open
        /**
         * Executes the `init` operation.
         * @returns {any} Returns the result of `init` when applicable.
         */
        init() {
            this.allowMultiple = this.$el.dataset.multiple === "true";
        },
        /**
         * Executes the `destroy` operation.
         * @returns {any} Returns the result of `destroy` when applicable.
         */
        destroy() {
            // Cleanup if needed
        }
    }));
}
