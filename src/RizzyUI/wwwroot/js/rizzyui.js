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
                    const scriptNonce = this.$el.dataset.scriptnonce;
                    const styleNonce = this.$el.dataset.stylenonce;

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
                        async: false,
                        inlineScriptNonce: scriptNonce,
                        inlineStyleNonce: styleNonce
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

    Alpine.data('rzTabs',
        () => {
            return {
                buttonRef: null,
                tabSelected: '',
                tabButton: null,
                init() {
                    this.buttonRef = document.getElementById(this.$el.dataset.buttonref);
                    this.tabSelected = this.$el.dataset.tabselected;
                    this.tabButton = this.buttonRef.querySelector('[data-name=\'' + this.tabSelected + '\']');

                    this.tabRepositionMarker(this.tabButton);
                },
                tabButtonClicked(tabButton) {
                    if (tabButton instanceof Event)
                        tabButton = tabButton.target;

                    this.tabSelected = tabButton.dataset.name;
                    this.tabRepositionMarker(tabButton);
                    tabButton.focus();
                },
                tabRepositionMarker(tabButton){
                    this.tabButton = tabButton;
                    this.$refs.tabMarker.style.width = tabButton.offsetWidth + 'px';
                    this.$refs.tabMarker.style.height = tabButton.offsetHeight + 'px';
                    this.$refs.tabMarker.style.left = tabButton.offsetLeft + 'px';
                    setTimeout(() => { this.$refs.tabMarker.style.opacity = 1; }, 150);
                },
                tabContentActive(tabContent) {
                    tabContent = tabContent ?? this.$el;
                    return this.tabSelected === tabContent.dataset.name;
                },
                tabButtonActive(tabButton) {
                    tabButton = tabButton ?? this.$el;
                    return this.tabSelected === tabButton.dataset.name;
                },
                selectedTabTextColor() {
                    const color = this.$el.dataset.selectedtextcolor ?? '';

                    if (this.tabButtonActive(this.$el)) {
                        return color;
                    }

                    return '';
                },
                handleResize() {
                    this.tabRepositionMarker(this.tabButton);
                },
                handleKeyDown(event){
                    const key = event.key;
                    const tabButtons = Array.from(this.buttonRef.querySelectorAll('[role=\'tab\']'));
                    const currentIndex = tabButtons.findIndex(button => this.tabButtonActive(button));
                    let newIndex = currentIndex;

                    if (key === 'ArrowRight') {
                        newIndex = (currentIndex + 1) % tabButtons.length;
                        event.preventDefault();
                    } else if (key === 'ArrowLeft') {
                        newIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
                        event.preventDefault();
                    } else if (key === 'Home') {
                        newIndex = 0;
                        event.preventDefault();
                    } else if (key === 'End') {
                        newIndex = tabButtons.length - 1;
                        event.preventDefault();
                    }

                    if (newIndex !== currentIndex) {
                        this.tabButtonClicked(tabButtons[newIndex]);
                    }
                }
        }
        });

    Alpine.data('rzSidebar',
        () => {
            return {
                showSidebar: false,

                isSidebarHidden() { return !this.showSidebar; },

                toggleSidebar() { this.showSidebar = !this.showSidebar; },

                hideSidebar() { this.showSidebar = false; },

                getSidebarTranslation() {
                    return this.showSidebar ? 'translate-x-0' : '-translate-x-60';
                }
            }
        });

    Alpine.data('rzSidebarLinkItem',
        () => {
            return {
                isExpanded: false,

                init() {
                    this.isExpanded = this.$el.dataset.expanded;
                },

                isCollapsed() { return !this.isExpanded; },

                toggleExpanded() { this.isExpanded = !this.isExpanded; },

                hideSidebar() { this.showSidebar = false; },

                getExpandedClass() {
                    return this.isExpanded ? 'rotate-180' : 'rotate-0';
                }
            }
        });

    Alpine.data('rzHeading',
        () => {
            return {
                observer: null,

                init() {
                    if (typeof this.setCurrentHeading === 'function') {

                        const callback = (entries, observer) => {
                            entries.forEach(entry => {
                                if (entry.isIntersecting) {
                                    this.setCurrentHeading(this.$el.id);
                                }
                            });
                        };

                        const options = { threshold: 0.5 };
                        this.observer = new IntersectionObserver(callback, options);

                        // Start observing the element
                        this.observer.observe(this.$el);
                    }
                },

                destroy() {
                    if (this.observer != null)
                        this.observer.disconnect();
                }
            }
        });
})