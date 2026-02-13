// packages/rizzyui/src/js/lib/components/rzSheet.js
export default function(Alpine) {
    Alpine.data('rzSheet', () => ({
        open: false,

        /**
         * Executes the `init` operation.
         * @returns {any} Returns the result of `init` when applicable.
         */
        init() {
            this.open = this.$el.dataset.defaultOpen === 'true';
        },

        /**
         * Executes the `toggle` operation.
         * @returns {any} Returns the result of `toggle` when applicable.
         */
        toggle() {
            this.open = !this.open;
        },

        /**
         * Executes the `close` operation.
         * @returns {any} Returns the result of `close` when applicable.
         */
        close() {
            this.open = false;
        },

        /**
         * Executes the `show` operation.
         * @returns {any} Returns the result of `show` when applicable.
         */
        show() {
            this.open = true;
        },

        /**
         * Executes the `state` operation.
         * @returns {any} Returns the result of `state` when applicable.
         */
        state() {
            return this.open ? 'open' : 'closed';
        }
    }));
}
