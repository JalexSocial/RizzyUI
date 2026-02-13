
export default function(Alpine) {
    Alpine.data('rzAspectRatio', () => ({
        /**
         * Executes the `init` operation.
         * @returns {any} Returns the result of `init` when applicable.
         */
        init() {
            const ratio = parseFloat(this.$el.dataset.ratio);
            if (!isNaN(ratio) && ratio > 0) {
                const paddingBottom = (100 / ratio) + '%';
                this.$el.style.paddingBottom = paddingBottom;
            } else {
                // Default to 1:1 ratio if data-ratio is invalid or missing
                this.$el.style.paddingBottom = '100%';
            }
        }
    }));
}
