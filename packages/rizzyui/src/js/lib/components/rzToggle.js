export default function rzToggle() {
    return {
        pressed: false,
        disabled: false,
        controlled: false,

        /**
         * Executes the `init` operation.
         * @returns {any} Returns the result of `init` when applicable.
         */
        init() {
            this.disabled = this.$el.dataset.disabled === 'true';
            this.initChangeEvent();
            const pressedValue = this.$el.dataset.pressed;
            this.controlled = pressedValue === 'true' || pressedValue === 'false';

            if (this.controlled) {
                this.pressed = pressedValue === 'true';
                return;
            }

            this.pressed = this.$el.dataset.defaultPressed === 'true';
        },

        /**
         * Dispatches `rz:toggle:change` ({ pressed, value }) when the pressed state changes, and
         * enables the hidden input (Name/Value) only while pressed (Summit SF-015, decision D-24).
         */
        initChangeEvent() {
            this.$watch('pressed', (pressed) => {
                const input = this.$el.querySelector(':scope > input[data-toggle-input]');
                if (input) input.disabled = !pressed;
                this.$el.dispatchEvent(new CustomEvent('rz:toggle:change', {
                    bubbles: true,
                    detail: { pressed, value: this.$el.dataset.value ?? null },
                }));
            });
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
    };
}
