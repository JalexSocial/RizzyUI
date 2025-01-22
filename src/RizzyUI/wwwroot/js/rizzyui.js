/* RizzyUI JS */
if (!document.__htmx_nonceprovider) {
    document.addEventListener("htmx:configRequest", (event) => {
        const headers = event.detail.headers;
        if (htmx.config.inlineScriptNonce) {
            headers['Rizzy-Script-Nonce'] = htmx.config.inlineScriptNonce;
        }
        if (htmx.config.inlineStyleNonce) {
            headers['Rizzy-Style-Nonce'] = htmx.config.inlineStyleNonce;
        }
    });

    document.__htmx_nonceprovider = true;
}

document.addEventListener('alpine:init', () => {

        try {

            let v = new aspnetValidation.ValidationService();
            v.bootstrap({ watch: true });

            window.validation = v;
        } catch (error) {
            console.log("error: aspnetValidation is not available");
        }

        Alpine.data('rzDarkModeToggle', () => ({

            mode: 'light',

            init() {
                const storedMode = localStorage.getItem('darkMode') ?? 'auto';
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                localStorage.setItem('darkMode', storedMode);

                const applyTheme = () => {
                    document.documentElement.classList.toggle('dark',
                        storedMode === 'dark' || (storedMode === 'auto' && prefersDark));
                };

                applyTheme();

                // Reapply theme on OS-level changes to the color scheme
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
            },

            // Getter properties used by the Razor markup
            isDark() {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                var storedMode = localStorage.getItem('darkMode');

                return this.mode === 'dark' || (this.mode === 'auto' && prefersDark);
            },
            isLight() {
                return !this.isDark();
            },

            toggle() {
                var storedMode = localStorage.getItem('darkMode');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (storedMode === 'light')
                    storedMode = 'dark';
                else if (storedMode === 'dark')
                    storedMode = 'light';
                else if (storedMode === 'auto') {
                    if (prefersDark)
                        storedMode = 'light';
                    else
                        storedMode = 'dark';
                }

                localStorage.setItem('darkMode', storedMode);
                this.mode = storedMode;

                const isDark = storedMode === 'dark' || (storedMode === 'auto' && prefersDark);
                document.documentElement.classList.toggle('dark', isDark);

                const darkModeEvent = new CustomEvent('darkModeToggle', {
                    detail: { darkMode: isDark }
                });

                window.dispatchEvent(darkModeEvent);
            }
        }));

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
                    },

                    getBrowserBorderCss() {
                        return [this.screenSize, this.screenSize === '' ? 'border-none' : 'border-x'];
                    },

                    getDesktopScreenCss() {
                        return [this.screenSize === '' ? 'text-onSurfaceStrong forced-color-adjust-auto dark:text-onSurfaceStrongDark' : 'opacity-60' ];
                    },

                    getTabletScreenCss() {
                        return [ this.screenSize === 'max-w-2xl' ? 'text-onSurfaceStrong forced-color-adjust-auto dark:text-onSurfaceStrongDark' : 'opacity-60' ];
                    },

                    getPhoneScreenCss() {
                        return [ this.screenSize === 'max-w-sm' ? 'text-onSurfaceStrong forced-color-adjust-auto dark:text-onSurfaceStrongDark' : 'opacity-60'];
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
                    },
                    notCopied() {
                        return !this.copied;
                    },
                    disableCopied() {
                        this.copied = false;
                    },
                    toggleExpand() {
                        this.expand = !this.expand;
                    },
                    copyHTML() {
                        navigator.clipboard.writeText(this.$refs.codeBlock.textContent);
                        this.copied = !this.copied;
                    },
                    getCopiedTitle() {
                        return this.copied ? 'copied' : 'copy';
                    },
                    getCopiedCss() {
                        return [this.copied ? 'focus-visible:outline-success' : 'focus-visible:outline-onSurfaceDark'];
                    },
                    getExpandCss() {
                        return [this.expand ? '' : 'max-h-60'];
                    },
                    getExpandButtonCss() {
                        return this.expand ? 'rotate-180' : 'rotate-0';
                    },
                    getExpandMaxHeightCss() {
                        return [this.expand ? '' : 'max-h-[400px]', this.border ? 'border' : 'border-none', 'rounded-b'];
                    },
                    getBorderCss() {
                        return [this.border ? 'border-b' : ''];
                    }
                }
            });

        Alpine.data('rzEmbeddedPreview', () => {
            return {
                iframe: null,
                onDarkModeToggle: null,
                init() {
                    try {
                        this.iframe = this.$refs.iframe;
                        const resize = this.debounce(() => { this.resizeIframe(this.iframe); }, 50);

                        // If init is called after the iframe loads, make sure we still resize the iframe
                        this.resizeIframe(this.iframe);

                        // observe any changes in size to the iframe
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
                resizeIframe(iframe) {

                    if (iframe) {
                        try {
                            const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;

                            if (iframeDocument) {

                                const iframeBody = iframeDocument.body;

                                if (!iframeBody) {
                                    setInterval(() => { this.resizeIframe(iframe); }, 150);
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
                debounce(func, timeout = 300) {
                    let timer;
                    return (...args) => {
                        clearTimeout(timer);
                        timer = setTimeout(() => { func.apply(this, args); }, timeout);
                    };
                },
                destroy() {
                    window.removeEventListener('darkModeToggle', this.onDarkModeToggle);
                }
            }
        });

        Alpine.data('rzProgress', () => ({
            currentVal: 0,
            minVal: 0,
            maxVal: 100,
            percentage: 0,
            label: '',

            init() {
                const element = this.$el;

                // Retrieve data attributes from the root element
                this.currentVal = parseInt(element.getAttribute('data-current-val')) || 0;
                this.minVal = parseInt(element.getAttribute('data-min-val')) || 0;
                this.maxVal = parseInt(element.getAttribute('data-max-val')) || 100;
                this.label = element.getAttribute('data-label');

                // Calculate initial percentage
                this.calculatePercentage();

                // Update ARIA attributes
                element.setAttribute('aria-valuenow', this.currentVal);
                element.setAttribute('aria-valuemin', this.minVal);
                element.setAttribute('aria-valuemax', this.maxVal);
                element.setAttribute('aria-valuetext', `${this.percentage}%`);

                // Set the width of the progress bar
                this.updateProgressBar();

                const resizeObserver = new ResizeObserver(entries => {
                    this.updateProgressBar();
                });

                resizeObserver.observe(element);

                // Listen for custom events to update progress
                this.$watch('currentVal', () => {
                    this.calculatePercentage();
                    this.updateProgressBar();
                    element.setAttribute('aria-valuenow', this.currentVal);
                    element.setAttribute('aria-valuetext', `${this.percentage}%`);
                });
            },

            calculatePercentage() {
                if (this.maxVal === this.minVal) {
                    this.percentage = 0;
                } else {
                    this.percentage = Math.min(Math.max(((this.currentVal - this.minVal) / (this.maxVal - this.minVal)) * 100, 0), 100);
                }
            },

            buildLabel() {
                var label = this.label || '{percent}%';
                this.calculatePercentage();
                return label.replace('{percent}', this.percentage);
            },

            buildInsideLabelPosition() {
                const progressBar = this.$refs.progressBar;
                const barLabel = this.$refs.progressBarLabel;
                const innerLabel = this.$refs.innerLabel;

                if (barLabel && progressBar && innerLabel) {
                    innerLabel.innerText = this.buildLabel();

                    if (barLabel.clientWidth > progressBar.clientWidth) {
                        barLabel.style.left = (progressBar.clientWidth + 10) + 'px';
                    } else {
                        barLabel.style.left = (progressBar.clientWidth / 2 - barLabel.clientWidth / 2) + 'px';
                    }
                }
            },

            getLabelCss() {
                const barLabel = this.$refs.progressBarLabel;
                const progressBar = this.$refs.progressBar;

                if (barLabel && progressBar && barLabel.clientWidth > progressBar.clientWidth) {
                    return "text-onSurface dark:text-onSurfaceDark";
                }

                return "";
            },

            updateProgressBar() {
                const progressBar = this.$refs.progressBar;
                if (progressBar) {
                    progressBar.style.width = `${this.percentage}%`;
                    this.buildInsideLabelPosition();
                }
            },

            // Method to update progress value
            setProgress(value) {
                this.currentVal = value;
            },

            // Method to increment progress value
            increment(val = 1) {
                this.currentVal = Math.min(this.currentVal + val, this.maxVal);
            },

            // Method to decrement progress value
            decrement(val = 1) {
                this.currentVal = Math.max(this.currentVal - val, this.minVal);
            }
        }));

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
                    getSelectedCss() {
                        const id = this.$el.dataset.headingid;

                        return { 'font-bold': this.currentHeadingId === id };
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