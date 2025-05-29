
export default function(Alpine) {
    Alpine.data('rzIndicator', () => ({
        init() {
            const colorValue = this.$el.dataset.color;
            if (colorValue) {
                this.$el.style.backgroundColor = colorValue;
            }
            
            // Visibility is handled by x-show in the .razor template directly
            // bound to the Blazor 'Visible' parameter. No need for Alpine to manage it
            // from a data-visible attribute, unless more complex Alpine-driven logic
            // for visibility is required later.
        }
    }));
}