
// --------------------------------------------------------------------------------
// Alpine.js component: rzAlert
// This component manages an alert's visibility and provides a dismiss method.
// --------------------------------------------------------------------------------
export default function(Alpine) {
    Alpine.data('rzAlert', () => {
        return {
            parentElement: null,
            showAlert: true,
            init() {
                const alpineRoot = this.$el.dataset.alpineRoot || this.$el.closest('[data-alpine-root]');
                
                this.parentElement = document.getElementById(alpineRoot);
            },
            dismiss() {
                this.showAlert = false;
                const self = this;
                setTimeout(() => {
                    self.parentElement.style.display = 'none';
                }, 205);
                
            }
        };
    });
}