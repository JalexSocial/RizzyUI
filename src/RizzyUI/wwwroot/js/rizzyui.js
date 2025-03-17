/* RizzyUI JS */
document.addEventListener('alpine:init', () => {

        try {

            let v = new aspnetValidation.ValidationService();
            v.bootstrap({ watch: true });

            window.validation = v;
        } catch (error) {
            console.log("error: aspnetValidation is not available");
        }

        Alpine.data('rzAccordion', () => ({
            selected: '',
            allowMultiple: false,
            init() {
                this.allowMultiple = this.$el.dataset.multiple === "true";
            },
            destroy() {

            }
        }));

        Alpine.data('rzAccordionSection', () => ({
            open: false,
            sectionId: "",
            init() {
                this.open = this.$el.dataset.isOpen === "true";
                this.sectionId = this.$el.dataset.sectionId;

                var self = this;
                this.$watch('selected', (value, oldValue) => {
                    if (value !== self.sectionId && !self.allowMultiple) {
                        self.open = false;
                    }
                })
            },
            destroy() {

            },
            toggle() {
                this.selected = this.sectionId;
                this.open = !this.open;
            },
            // Computed getter for the icon rotation class.
            iconRotation() {
                return open ? "rotate-180" : "";
            }

        }));

        Alpine.data('rzDarkModeToggle', () => ({

            mode: 'light',

            init() {
                const allowedModes = ['light', 'dark', 'auto'];

                let storedMode = localStorage.getItem('darkMode') ?? 'auto';
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (!allowedModes.includes(storedMode)) {
                    storedMode = 'light';
                }

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
                        return [this.screenSize === '' ? 'text-on-surface-strong forced-color-adjust-auto dark:text-on-surface-dark-strong' : 'opacity-60' ];
                    },

                    getTabletScreenCss() {
                        return [ this.screenSize === 'max-w-2xl' ? 'text-on-surface-strong forced-color-adjust-auto dark:text-on-surface-dark-strong' : 'opacity-60' ];
                    },

                    getPhoneScreenCss() {
                        return [ this.screenSize === 'max-w-sm' ? 'text-on-surface-strong forced-color-adjust-auto dark:text-on-surface-dark-strong' : 'opacity-60'];
                    }
                }
            });

        Alpine.data('rzCheckboxGroupItem',
            () => {
                return {
                    checkbox: null,
                    isChecked: false,

                    init() {
                        this.checkbox = this.$refs.chk;
                        this.isChecked = this.checkbox.checked;
                    },

                    toggleCheckbox() {
                        this.isChecked = this.checkbox.checked;
                    },

                    getIconCss() {
                        return this.isChecked ? "" : "hidden";
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
                        return [this.copied ? 'focus-visible:outline-success' : 'focus-visible:outline-on-surface-dark'];
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

        Alpine.data('rzDateEdit', () => ({
            options: {},
            placeholder: '',
            prependText: '',
            init() {
                // Retrieve configuration from dataset
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

                // Load any needed assets
                const assets = JSON.parse(this.$el.dataset.assets);
                const scriptNonce = this.$el.dataset.scriptnonce;
                const styleNonce = this.$el.dataset.stylenonce;

                loadjs(assets, {
                    success: () => {
                        // Once loaded, initialize Flatpickr on the target input
                        if (window.flatpickr && inputElem) {
                            window.flatpickr(inputElem, this.options);
                        }
                    },
                    error: () => {
                        console.error('Failed to load Flatpickr assets.');
                    },
                    async: false,
                    inlineScriptNonce: scriptNonce,
                    inlineStyleNonce: styleNonce
                });
            }
        }));

    Alpine.data('rzDropdown', () => ({
        dropdownEl: null,
        anchorCss: "",
        dropdownOpen: false,
        openedWithKeyboard: false,
        init() {
            this.dropdownEl = this.$el;
            this.anchorCss = this.getAnchorCss();
        },

        toggleDropdown() {
            this.anchorCss = this.getAnchorCss();
            this.dropdownOpen = !this.dropdownOpen;
        },
        openDropdown() {
            this.anchorCss = this.getAnchorCss();
            this.dropdownOpen = true;
            this.openedWithKeyboard = false;
        },
        openWithKeyboard() {
            this.anchorCss = this.getAnchorCss();
            this.dropdownOpen = true;
            this.openedWithKeyboard = true;
            this.focusWrapNext();
        },
        closeDropdown() {
            this.dropdownOpen = false;
            this.openedWithKeyboard = false;
        },
        focusWrapNext() {
            this.$focus.wrap().next();
        },
        focusWrapPrevious() {
            this.$focus.wrap().previous();
        },
        getAnchorCss() {
            let defaultAnchorRaw = this.dropdownEl.getAttribute('data-anchor') || "";
            let defaultAnchor = defaultAnchorRaw.replace(/-/g, "").toLowerCase();

            // Mapping from normalized anchor string to Tailwind CSS classes.
            const anchorClasses = {
                "topstart": "bottom-full right-0 mb-2 origin-bottom-right",
                "topcenter": "left-1/2 bottom-full transform -translate-x-1/2 mb-2 origin-bottom",
                "topend": "bottom-full left-0 mb-2 origin-bottom-left",
                "start": "right-full top-1/2 -translate-y-1/2 me-2 origin-right",
                "end": "left-full top-1/2 -translate-y-1/2 ms-2 origin-left",
                "bottomstart": "right-0 mt-2 origin-top-right",
                "bottomcenter": "-translate-x-1/2 mt-2 origin-top",
                "bottomend": "left-0 mt-2 origin-top-left"
            };

            let cssClasses = anchorClasses[defaultAnchor] || "";

            // Get the trigger element’s bounding rectangle.
            const triggerRect = this.dropdownEl.getBoundingClientRect();

            // --- Off-screen measurement ---
            // Create a temporary container (preserving layout context) as a child of the dropdown.
            let tempContainer = document.createElement('div');
            tempContainer.style.cssText =
                "position: absolute; top: 0; left: 0; visibility: hidden; pointer-events: none;";
            this.dropdownEl.appendChild(tempContainer);

            // Clone the dropdown menu element (with role="menu")
            const originalMenu = this.dropdownEl.querySelector('[role="menu"]');
            if (!originalMenu) {
                // If no menu is found, simply return the default classes.
                return cssClasses;
            }
            let clone = originalMenu.cloneNode(true);
            clone.style.transition = "none";
            clone.style.transform = "none";
            clone.style.opacity = "1";
            // Ensure the clone is rendered as block.
            clone.style.display = "block";
            // Append the clone to the temporary container.
            tempContainer.appendChild(clone);

            // Force a reflow by reading the bounding rect.
            let cloneRect = clone.getBoundingClientRect();
            tempContainer.parentNode.removeChild(tempContainer);

            // Use a small margin as spacing.
            const margin = 8;

            // Determine if the default placement would clip the dropdown.
            let wouldClip = false;
            if (defaultAnchor.startsWith("top")) {
                // Dropdown appears above trigger.
                if (triggerRect.top < cloneRect.height + margin) {
                    wouldClip = true;
                }
            } else if (defaultAnchor.startsWith("bottom")) {
                // Dropdown appears below trigger.
                if (triggerRect.bottom + cloneRect.height + margin > window.innerHeight) {
                    wouldClip = true;
                }
            } else if (defaultAnchor === "start") {
                if (triggerRect.left < cloneRect.width + margin) {
                    wouldClip = true;
                }
            } else if (defaultAnchor === "end") {
                if (triggerRect.right + cloneRect.width + margin > window.innerWidth) {
                    wouldClip = true;
                }
            }

            // If clipping is detected, select a fallback anchor.
            if (wouldClip) {
                const fallbackMapping = {
                    "topstart": "bottomstart",
                    "topcenter": "bottomcenter",
                    "topend": "bottomend",
                    "bottomstart": "topstart",
                    "bottomcenter": "topcenter",
                    "bottomend": "topend",
                    "start": "end",
                    "end": "start"
                };
                let fallbackAnchor = fallbackMapping[defaultAnchor] || defaultAnchor;
                cssClasses = anchorClasses[fallbackAnchor] || cssClasses;
            }

            // Store and return the final class string.
            return cssClasses;
        }

        }));

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

    Alpine.data('rzMarkdown',
        () => {
            return {
                init() {
                    // Retrieve the assets from the dataset
                    const assets = JSON.parse(this.$el.dataset.assets);
                    const scriptNonce = this.$el.dataset.scriptnonce;
                    const styleNonce = this.$el.dataset.stylenonce;

                    loadjs(assets, {
                        success: () => {
                            window.hljs.highlightAll();
                        },
                        error: () => {
                            console.error('Failed to load Highlight.js');
                        },
                        async: false,
                        inlineScriptNonce: scriptNonce,
                        inlineStyleNonce: styleNonce
                    });
                },
            }
        });

    Alpine.data('rzPrependInput', () => {

            return {
                prependContainer: null,
                textInput: null,
                init() {
                    // On component init, measure the prepend container's width
                    // and apply that as padding to the text input.
                    this.prependContainer = this.$refs.prependContainer;
                    this.textInput = this.$refs.textInput;

                    let self = this;

                    setTimeout(() => { self.updatePadding(); }, 50);

                    // If you'd like the padding to adapt if the user resizes the window:
                    window.addEventListener('resize', this.updatePadding);
                },

                destroy() {
                    // Clean up the event listener when this component is removed
                    window.removeEventListener('resize', this.updatePadding);
                },

                updatePadding() {
                    // Using x-ref to find the prepend container and the actual text input
                    const prependDiv = this.prependContainer;
                    const inputElem = this.textInput;

                    if (!prependDiv || !inputElem) {
                        if (inputElem) {
                            inputElem.classList.remove('text-transparent');
                        }
                        return;
                    }

                    // Get the rendered width of the prepend container (in px).
                    const prependWidth = prependDiv.offsetWidth;

                    // Optionally add a small buffer to keep text from hugging the border:
                    const leftPadding = prependWidth + 10;

                    // Apply inline style on the input to exactly match that width
                    inputElem.style.paddingLeft = leftPadding + 'px';
                    inputElem.classList.remove('text-transparent');
                }
            };
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
                    return "text-on-surface dark:text-on-surface-dark";
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