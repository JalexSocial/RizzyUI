
// --------------------------------------------------------------------------------
// Alpine.js component: rzDateEdit
// This component initializes a date picker (using Flatpickr) on an input element.
// It retrieves its configuration and assets from data attributes.
// --------------------------------------------------------------------------------
export default function(Alpine, require) {
    Alpine.data('rzDateEdit', () => ({
        options: {},
        placeholder: '',
        prependText: '',
        /**
         * Executes the `init` operation.
         * @returns {any} Returns the result of `init` when applicable.
         */
        init() {
            // Retrieve configuration (options, placeholder, prependText) from the element's dataset
            const cfgString = this.$el.dataset.config;
            const inputElem = document.getElementById(this.$el.dataset.uid + "-input");
            if (cfgString) {
                const parsed = JSON.parse(cfgString);
                if (parsed) {
                    this.options = parsed.options || {};
                    this.placeholder = parsed.placeholder || '';
                    this.prependText = parsed.prependText || '';
                }
            }
            // Load Flatpickr assets and initialize the date picker on the input element
            const assets = JSON.parse(this.$el.dataset.assets);
            const nonce = this.$el.dataset.nonce;

            require(assets, {
                success: function () {
                    if (window.flatpickr && inputElem) {
                        window.flatpickr(inputElem, this.options);
                    }
                },
                error: function () {
                    console.error('Failed to load Flatpickr assets.');
                }
            }, nonce);
        }
    }));
}
