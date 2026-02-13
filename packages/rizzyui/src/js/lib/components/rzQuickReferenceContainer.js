
// --------------------------------------------------------------------------------
// Alpine.js component: rzQuickReferenceContainer
// Manages the state for the quick reference sidebar, including headings and current selection.
// --------------------------------------------------------------------------------
export default function(Alpine) {
    Alpine.data('rzQuickReferenceContainer', () => {
        return {
            headings: [],          // Array of heading IDs
            currentHeadingId: '',  // ID of the currently highlighted heading

            // Initializes the component with headings and the initial current heading from data attributes.
            init() {
                this.headings = JSON.parse(this.$el.dataset.headings || '[]');
                this.currentHeadingId = this.$el.dataset.currentheadingid || '';
            },

            // Handles click events on quick reference links.
            handleHeadingClick() {
                const id = this.$el.dataset.headingid; // Get ID from the clicked link's context
                // Use requestAnimationFrame for smoother UI update before potential scroll jump
                window.requestAnimationFrame(() => {
                    this.currentHeadingId = id;
                });
            },

            // Sets the current heading ID based on intersection observer events from rzHeading.
            setCurrentHeading(id) {
                if (this.headings.includes(id)) {
                    this.currentHeadingId = id;
                }
            },

            // Provides CSS classes for a link based on whether it's the current heading.
            // Returns an object suitable for :class binding.
            getSelectedCss() {
                const id = this.$el.dataset.headingid; // Get ID from the link element's context
                return {
                    'font-bold': this.currentHeadingId === id // Apply 'font-bold' if current
                };
            },

            // Determines the value for the aria-current attribute.
            getSelectedAriaCurrent() {
                const id = this.$el.dataset.headingid; // Get ID from the link element's context
                return this.currentHeadingId === id ? 'true' : null; // Set aria-current="true" if current
            }
        };
    });
}
