
// --------------------------------------------------------------------------------
// Alpine.js component: rzMarkdown
// Initializes Markdown rendering with syntax highlighting.
// --------------------------------------------------------------------------------
export default function(Alpine, require) {
    Alpine.data('rzMarkdown', () => {
        return {
            /**
             * Executes the `init` operation.
             * @returns {any} Returns the result of `init` when applicable.
             */
            init() {
                // Retrieve asset configuration from dataset attributes
                const assets = JSON.parse(this.$el.dataset.assets);
                const nonce = this.$el.dataset.nonce;

                require(assets, {
                    success: function () {
                        window.hljs.highlightAll();
                    },
                    error: function () {
                        console.error('Failed to load Highlight.js');
                    }
                }, nonce);

            }
        };
    });
}
