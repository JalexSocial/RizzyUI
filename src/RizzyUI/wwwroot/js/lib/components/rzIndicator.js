
export default function(Alpine) {
    Alpine.data('rzIndicator', () => ({
        visible: false,
        init() {
            const colorValue = this.$el.dataset.color;
            if (colorValue) {
                this.$el.style.backgroundColor = colorValue;
            }
            
            if (this.$el.dataset.visible === "true") {
                this.visible = true;
            }
            
            // Visibility is handled by x-show in the .razor template directly
            // bound to the Blazor 'Visible' parameter. No need for Alpine to manage it
            // from a data-visible attribute, unless more complex Alpine-driven logic
            // for visibility is required later.
        },
        notVisible() {
            return !this.visible;
        }
    }));
}