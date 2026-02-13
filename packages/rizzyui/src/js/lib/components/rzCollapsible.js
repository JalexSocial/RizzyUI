
export default function(Alpine) {
    Alpine.data('rzCollapsible', () => ({
        isOpen: false,

        /**
         * Executes the `init` operation.
         * @returns {any} Returns the result of `init` when applicable.
         */
        init() {
            this.isOpen = this.$el.dataset.defaultOpen === 'true';
        },

        /**
         * Executes the `toggle` operation.
         * @returns {any} Returns the result of `toggle` when applicable.
         */
        toggle() {
            this.isOpen = !this.isOpen;
        },

        /**
         * Executes the `state` operation.
         * @returns {any} Returns the result of `state` when applicable.
         */
        state() {
            return this.isOpen ? 'open' : 'closed';
        }
    }));
}
