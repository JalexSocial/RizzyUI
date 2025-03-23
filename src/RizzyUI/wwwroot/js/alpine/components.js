import Alpine from 'alpinejs';

// --------------------------------------------------------------------------------
// Alpine.js component: rzAccordion
// This component manages the overall accordion container.
// --------------------------------------------------------------------------------
Alpine.data('rzAccordion', () => ({
    selected: '',
    allowMultiple: false,
    init() {
        // Set whether multiple sections can be open based on data attribute
        this.allowMultiple = this.$el.dataset.multiple === "true";
    },
    destroy() {
        // Cleanup if needed (currently empty)
    }
}));
