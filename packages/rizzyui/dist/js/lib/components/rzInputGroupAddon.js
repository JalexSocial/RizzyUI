export default function(Alpine) {
    Alpine.data('rzInputGroupAddon', () => ({
        /**
         * Executes the `handleClick` operation.
         * @param {any} event Input value for this method.
         * @returns {any} Returns the result of `handleClick` when applicable.
         */
        handleClick(event) {
            if (event.target.closest('button')) {
                return;
            }
            const parent = this.$el.parentElement;
            if (parent) {
                const input = parent.querySelector('input, textarea');
                input?.focus();
            }
        }
    }));
}
