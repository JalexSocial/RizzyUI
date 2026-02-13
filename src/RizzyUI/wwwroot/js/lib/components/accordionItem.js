
// --------------------------------------------------------------------------------
// Alpine.js component: accordionItem
// This component controls each individual accordion section.
// It accesses 'selected' and 'allowMultiple' from the parent rzAccordion scope.
// --------------------------------------------------------------------------------
export default function(Alpine) {
    Alpine.data('accordionItem', () => ({
        open: false,
        sectionId: "",
        expandedClass: "",
        /**
         * Executes the `init` operation.
         * @returns {any} Returns the result of `init` when applicable.
         */
        init() {
            this.open = this.$el.dataset.isOpen === "true";
            this.sectionId = this.$el.dataset.sectionId;
            this.expandedClass = this.$el.dataset.expandedClass;

            // Watch the 'selected' property inherited from the parent rzAccordion scope.
            const self = this;
            // Check if inherited properties exist before watching
            if (typeof this.selected !== 'undefined' && typeof this.allowMultiple !== 'undefined') {
                this.$watch('selected', (value, oldValue) => {
                    // If multiple sections are not allowed and a *different* section is selected, close this one.
                    if (value !== self.sectionId && !self.allowMultiple) {
                        self.open = false;
                    }
                });
            } else {
                console.warn("accordionItem: Could not find 'selected' or 'allowMultiple' in parent scope for $watch.");
            }
        },
        /**
         * Executes the `destroy` operation.
         * @returns {any} Returns the result of `destroy` when applicable.
         */
        destroy() {
            // Cleanup if needed
        },
        // Toggle the section's open state and update the parent's 'selected' state.
        toggle() {
            this.selected = this.sectionId;
            this.open = !this.open;
        },
        // Get the CSS classes for the expanded/collapsed chevron icon.
        getExpandedCss() {
            return this.open ? this.expandedClass : "";
        },
        // Get the value for aria-expanded attribute based on the 'open' state.
        getAriaExpanded() {
            return this.open ? 'true' : 'false';
        }
    }));
}
