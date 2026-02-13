
// --------------------------------------------------------------------------------
// Alpine.js component: rzCodeViewer
// This component handles code display, syntax highlighting, copy-to-clipboard,
// and expand/collapse functionality.
// --------------------------------------------------------------------------------
export default function(Alpine, require) {
    Alpine.data('rzCodeViewer', () => {
        return {
            expand: false,
            border: true,
            copied: false,
            copyTitle: 'Copy',     // Default title
            copiedTitle: 'Copied!', // Default title
            /**
             * Executes the `init` operation.
             * @returns {any} Returns the result of `init` when applicable.
             */
            init() {
                const assets = JSON.parse(this.$el.dataset.assets);
                const codeId = this.$el.dataset.codeid;
                const nonce = this.$el.dataset.nonce;
                // Get localized titles from data attributes
                this.copyTitle = this.$el.dataset.copyTitle || this.copyTitle;
                this.copiedTitle = this.$el.dataset.copiedTitle || this.copiedTitle;

                require(assets, {
                    success: function () {
                        const codeBlock = document.getElementById(codeId);
                        if (window.hljs && codeBlock) {
                            window.hljs.highlightElement(codeBlock);
                        }
                    },
                    error: function () {
                        console.error('Failed to load Highlight.js');
                    }
                }, nonce);
            },
            // Function to check if code is NOT copied (for x-show)
            notCopied() {
                return !this.copied;
            },
            // Function to reset the copied state (e.g., on blur)
            disableCopied() {
                this.copied = false;
            },
            // Function to toggle the expand state
            toggleExpand() {
                this.expand = !this.expand;
            },
            // Function to copy code to clipboard
            copyHTML() {
                navigator.clipboard.writeText(this.$refs.codeBlock.textContent);
                this.copied = !this.copied;
            },
            // Get the title for the copy button (copy/copied)
            getCopiedTitle() {
                return this.copied ? this.copiedTitle : this.copyTitle;
            },
            // Get CSS classes for the copy button based on copied state
            getCopiedCss() {
                return [this.copied ? 'focus-visible:outline-success' : 'focus-visible:outline-foreground'];
            },
            // Get CSS classes for the code container based on expand state
            getExpandCss() {
                return [this.expand ? '' : 'max-h-60'];
            },
            // Get CSS classes for the expand button icon based on expand state
            getExpandButtonCss() {
                return this.expand ? 'rotate-180' : 'rotate-0';
            }
        };
    });
}
