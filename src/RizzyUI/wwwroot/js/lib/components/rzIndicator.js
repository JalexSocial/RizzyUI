
export default function(Alpine) {
    Alpine.data('rzIndicator', () => ({
        visible: false,
        /**
         * Executes the `init` operation.
         * @returns {any} Returns the result of `init` when applicable.
         */
        init() {
            const colorValue = this.$el.dataset.color;
            if (colorValue) {
                this.$el.style.backgroundColor = colorValue;
            } else {
                this.$el.style.backgroundColor = "var(--color-success)";
            }
            
            if (this.$el.dataset.visible === "true") {
                this.visible = true;
            }
            
            // Visibility is handled by x-show in the .razor template directly
            // bound to the Blazor 'Visible' parameter. No need for Alpine to manage it
            // from a data-visible attribute, unless more complex Alpine-driven logic
            // for visibility is required later.
        },
        /**
         * Executes the `notVisible` operation.
         * @returns {any} Returns the result of `notVisible` when applicable.
         */
        notVisible() {
            return !this.visible;
        },
        /**
         * Executes the `setVisible` operation.
         * @param {any} value Input value for this method.
         * @returns {any} Returns the result of `setVisible` when applicable.
         */
        setVisible(value) {
            this.visible = value;
        }
    }));
}
