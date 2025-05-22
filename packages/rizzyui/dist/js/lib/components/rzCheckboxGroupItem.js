
// --------------------------------------------------------------------------------
// Alpine.js component: rzCheckboxGroupItem
// Manages a checkbox's state and its associated icon visibility.
// --------------------------------------------------------------------------------
export default function(Alpine) {
    Alpine.data('rzCheckboxGroupItem', () => {
        return {
            checkbox: null,
            isChecked: false,
            init() {
                this.checkbox = this.$refs.chk;
                this.isChecked = this.checkbox.checked;
            },
            toggleCheckbox() {
                this.isChecked = this.checkbox.checked;
            },
            getIconCss() {
                return this.isChecked ? "" : "hidden";
            }
        };
    });
}