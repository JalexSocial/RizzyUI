
// --------------------------------------------------------------------------------
// Alpine.js component: rzAccordion
// This component manages the overall accordion container.
// Provides 'selected' and 'allowMultiple' properties to child rzAccordionSection components.
// --------------------------------------------------------------------------------
export default function(Alpine) {
    Alpine.data('rzAccordion', () => ({
        selected: '',          // ID of the currently selected/opened section (if not allowMultiple)
        allowMultiple: false,  // Whether multiple sections can be open
        init() {
            this.allowMultiple = this.$el.dataset.multiple === "true";
        },
        destroy() {
            // Cleanup if needed
        }
    }));
}