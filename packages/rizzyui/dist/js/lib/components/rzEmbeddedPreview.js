
// --------------------------------------------------------------------------------
// Alpine.js component: rzEmbeddedPreview
// Manages an iframe preview and adjusts its height dynamically.
// It also passes dark mode settings to the iframe via postMessage.
// --------------------------------------------------------------------------------
export default function(Alpine) {
    Alpine.data('rzEmbeddedPreview', () => {
        return {
            iframe: null,
            onDarkModeToggle: null,
            /**
             * Executes the `init` operation.
             * @returns {any} Returns the result of `init` when applicable.
             */
            init() {
                try {
                    this.iframe = this.$refs.iframe;
                    const resize = this.debounce(() => {
                        this.resizeIframe(this.iframe);
                    }, 50);

                    // Resize iframe immediately and on any subsequent size changes
                    this.resizeIframe(this.iframe);

                    const resizeObserver = new ResizeObserver(entries => {
                        for (let entry of entries) {
                            resize();
                        }
                    });
                    resizeObserver.observe(this.iframe);

                    const iframe = this.iframe;
                    this.onDarkModeToggle = (event) => {
                        iframe.contentWindow.postMessage(event.detail, '*');
                    };
                    window.addEventListener('darkModeToggle', this.onDarkModeToggle);
                } catch (error) {
                    console.error('Cannot access iframe content');
                }
            },
            // Adjusts the iframe height based on its content
            resizeIframe(iframe) {
                if (iframe) {
                    try {
                        const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
                        if (iframeDocument) {
                            const iframeBody = iframeDocument.body;
                            if (!iframeBody) {
                                setInterval(() => {
                                    this.resizeIframe(iframe);
                                }, 150);
                            } else {
                                const newHeight = iframeBody.scrollHeight + 15;
                                iframe.style.height = newHeight + 'px';
                            }
                        }
                    } catch (error) {
                        console.error('Error resizing iframe:', error);
                    }
                }
            },
            // Debounce helper to limit function calls
            debounce(func, timeout = 300) {
                let timer;
                return (...args) => {
                    clearTimeout(timer);
                    timer = setTimeout(() => {
                        func.apply(this, args);
                    }, timeout);
                };
            },
            /**
             * Executes the `destroy` operation.
             * @returns {any} Returns the result of `destroy` when applicable.
             */
            destroy() {
                window.removeEventListener('darkModeToggle', this.onDarkModeToggle);
            }
        };
    });
}
