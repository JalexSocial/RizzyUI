export default function (Alpine) {
    Alpine.data('rzToggle', () => ({
        pressed: false,
        disabled: false,
        controlled: false,

        /**
         * Executes the `init` operation.
         * @returns {any} Returns the result of `init` when applicable.
         */
        init() {
            this.disabled = this.$el.dataset.disabled === 'true';
            const pressedValue = this.$el.dataset.pressed;
            this.controlled = pressedValue === 'true' || pressedValue === 'false';

            if (this.controlled) {
                this.pressed = pressedValue === 'true';
                return;
            }

            this.pressed = this.$el.dataset.defaultPressed === 'true';
        },

        /**
         * Executes the `toggle` operation.
         * @returns {any} Returns the result of `toggle` when applicable.
         */
        toggle() {
            if (this.disabled) return;
            if (this.controlled) return;
            this.pressed = !this.pressed;
        },

        /**
         * Executes the `state` operation.
         * @returns {any} Returns the result of `state` when applicable.
         */
        state() {
            return this.pressed ? "on" : "off";
        },

        /**
         * Executes the `ariaPressed` operation.
         * @returns {any} Returns the result of `ariaPressed` when applicable.
         */
        ariaPressed() {
            return this.pressed.toString();
        },

        /**
         * Executes the `dataDisabled` operation.
         * @returns {any} Returns the result of `dataDisabled` when applicable.
         */
        dataDisabled() {
            return this.disabled ? "" : null;
        }
    }));
}
