export default function (Alpine) {
    Alpine.data('rzToggle', () => ({
        pressed: false,
        disabled: false,
        controlled: false,

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

        toggle() {
            if (this.disabled) return;
            if (this.controlled) return;
            this.pressed = !this.pressed;
        },

        state() {
            return this.pressed ? "on" : "off";
        },

        ariaPressed() {
            return this.pressed.toString();
        },

        dataDisabled() {
            return this.disabled ? "" : null;
        }
    }));
}
