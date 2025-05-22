
// --------------------------------------------------------------------------------
// Alpine.js component: rzPrependInput
// Adjusts the padding of an input element based on the width of a prepend element.
// --------------------------------------------------------------------------------
export default function(Alpine) {
    Alpine.data('rzPrependInput', () => {
        return {
            prependContainer: null,
            textInput: null,
            init() {
                // On init, measure the prepend container and adjust input padding
                this.prependContainer = this.$refs.prependContainer;
                this.textInput = this.$refs.textInput;
                let self = this;
                setTimeout(() => {
                    self.updatePadding();
                }, 50);
                // Update padding on window resize
                window.addEventListener('resize', this.updatePadding);
            },
            destroy() {
                window.removeEventListener('resize', this.updatePadding);
            },
            updatePadding() {
                // Get the width of the prepend container and apply it as left padding to the input
                const prependDiv = this.prependContainer;
                const inputElem = this.textInput;
                if (!prependDiv || !inputElem) {
                    if (inputElem) {
                        inputElem.classList.remove('text-transparent');
                    }
                    return;
                }
                const prependWidth = prependDiv.offsetWidth;
                const leftPadding = prependWidth + 10;
                inputElem.style.paddingLeft = leftPadding + 'px';
                inputElem.classList.remove('text-transparent');
            }
        };
    });
}