/* RizzyUI JS */

document.addEventListener('alpine:init', () => {
    Alpine.data('rzAlert',
        () => {
            return {
                showAlert: true,

                dismiss() {
                    this.showAlert = false;
                }
            }
        });

    Alpine.data('rzBrowser',
        () => {
            return {
                screenSize: '',

                setDesktopScreenSize() {
                    this.screenSize = '';
                },

                setTabletScreenSize() {
                    this.screenSize = 'max-w-2xl';
                },

                setPhoneScreenSize() {
                    this.screenSize = 'max-w-sm';
                }

            }
        });

    Alpine.data('rzCodeViewer',
        () => {
            return {
                expand: false,
                border: true,
                codeStyle: '',
                copied: false,
                notCopied() {
                    return !this.copied;
                },
                toggleCopied() {
                    this.copied = !this.copied;
                },
                toggleExpand() {
                    this.expand = !this.expand;
                },
                copyHTML() {
                    navigator.clipboard.writeText(this.$refs.codeBlock.textContent);
                    this.copied = !this.copied;
                },
                init() {
                    // Retrieve the assets from the dataset
                    const assets = JSON.parse(this.$el.dataset.assets);
                    const codeId = this.$el.dataset.codeid;

                    loadjs(assets, {
                        success: () => {
                            // Ensure Highlight.js styles are applied after the script loads
                            const codeBlock = document.getElementById(codeId);

                            if (window.hljs && codeBlock) {
                                window.hljs.highlightElement(codeBlock);
                            }
                        },
                        error: () => {
                            console.error('Failed to load Highlight.js');
                        },
                        async: false
                    });
                }
            }
        });

    Alpine.data('rzQuickReferenceContainer',
        () => {
            return {
                headings: [],
                currentHeadingId: '',
                handleHeadingClick() {
                    const id = this.$el.dataset.headingid;
                    setTimeout(() => { this.currentHeadingId = id; }, 10);
                },
                setCurrentHeading(id) {
                    if (this.headings.includes(id)) {
                        this.currentHeadingId = id;
                    }
                },
                init() {
                    this.headings = JSON.parse(this.$el.dataset.headings);
                    this.currentHeadingId = this.$el.dataset.currentheadingid;
                }
            }
        });
})