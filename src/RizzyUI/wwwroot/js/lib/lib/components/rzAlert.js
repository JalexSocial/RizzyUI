
// --------------------------------------------------------------------------------
// Alpine.js component: rzAlert
// This component manages an alert's visibility and provides a dismiss method.
// --------------------------------------------------------------------------------
export default function(Alpine) {
    Alpine.data('rzAlert', () => {
        return {
            showAlert: true,
            dismiss() {
                this.showAlert = false;
            }
        };
    });
}