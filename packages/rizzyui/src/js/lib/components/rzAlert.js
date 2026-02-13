
// --------------------------------------------------------------------------------
// Alpine.js component: rzAlert
// This component manages an alert's visibility and provides a dismiss method.
// --------------------------------------------------------------------------------
export default function(Alpine) {
    Alpine.data('rzAlert', () => {
        return {
            parentElement: null,
            showAlert: true,
            /**
             * Executes the `init` operation.
             * @returns {any} Returns the result of `init` when applicable.
             */
            init() {
                const alpineRoot = this.$el.dataset.alpineRoot || this.$el.closest('[data-alpine-root]');
                
                this.parentElement = document.getElementById(alpineRoot);
            },
            /**
             * Executes the `dismiss` operation.
             * @returns {any} Returns the result of `dismiss` when applicable.
             */
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
