import loadjs from "./loadjs/loadjs";

// --------------------------------------------------------------------------------
// Utility: Generate a unique bundle ID based on an array of script paths.
// It sorts the paths, joins them with a separator, and computes a SHA-256 hash.
// The resulting hash (in hexadecimal) is used as the bundle ID.
// --------------------------------------------------------------------------------
async function generateBundleId(paths) {
    // Sort paths to allow generating the same bundle id if all assets are identical
    paths = [...paths].sort();
    const joinedPaths = paths.join('|');
    const encoder = new TextEncoder();
    const data = encoder.encode(joinedPaths);
    // Compute SHA-256 hash of the joined string
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // Convert the hash bytes to a hexadecimal string
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// --------------------------------------------------------------------------------
// Utility: Dynamically load scripts with loadjs by their paths.
// It first generates a unique bundle ID, then loads the scripts if not already defined.
// Finally, it executes the callback function when the scripts are ready.
// --------------------------------------------------------------------------------
function require(paths, callbackFn, nonce) {
    generateBundleId(paths).then(bundleId => {
        if (!loadjs.isDefined(bundleId)) {
            loadjs(paths, bundleId,
                {
                    async: false,
                    inlineScriptNonce: nonce,
                    inlineStyleNonce: nonce
                });
        }
        loadjs.ready([bundleId], callbackFn);
    });
}

function registerComponents(Alpine) {

// --------------------------------------------------------------------------------
// Alpine.js component: rzAccordion
// This component manages the overall accordion container.
// --------------------------------------------------------------------------------
    Alpine.data('rzAccordion', () => ({
        selected: '',
        allowMultiple: false,
        init() {
            // Set whether multiple sections can be open based on data attribute
            this.allowMultiple = this.$el.dataset.multiple === "true";
        },
        destroy() {
            // Cleanup if needed (currently empty)
        }
    }));

// --------------------------------------------------------------------------------
// Alpine.js component: rzAccordionSection
// This component controls each individual accordion section.
// It listens for changes on the "selected" property to close the section if needed.
// --------------------------------------------------------------------------------
    Alpine.data('rzAccordionSection', () => ({
        open: false,
        sectionId: "",
        expandedClass: "",
        init() {
            // Initialize open state and section identifier from element data attributes
            this.open = this.$el.dataset.isOpen === "true";
            this.sectionId = this.$el.dataset.sectionId;
            this.expandedClass = this.$el.dataset.expandedClass;

            // Watch for changes in the parent "selected" value to close this section if it isn't selected
            const self = this;
            this.$watch('selected', (value, oldValue) => {
                if (value !== self.sectionId && !self.allowMultiple) {
                    self.open = false;
                }
            });
        },
        destroy() {
            // Cleanup if needed (currently empty)
        },
        // Toggle the section's open state and mark this section as selected
        toggle() {
            this.selected = this.sectionId;
            this.open = !this.open;
        },
        // Computed getter for the icon rotation class (rotates icon 180° when open)
        iconRotation() {
            return open ? "rotate-180" : "";
        },
        getExpandedCss() {
            return this.open ? this.expandedClass : "";
        }
    }));
    
// --------------------------------------------------------------------------------
// Alpine.js component: rzAlert
// This component manages an alert's visibility and provides a dismiss method.
// --------------------------------------------------------------------------------
    Alpine.data('rzAlert', () => {
        return {
            showAlert: true,
            dismiss() {
                this.showAlert = false;
            }
        };
    });

// --------------------------------------------------------------------------------
// Alpine.js component: rzBrowser
// This component simulates a browser preview with adjustable screen sizes.
// --------------------------------------------------------------------------------
    Alpine.data('rzBrowser', () => {
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
            // Return CSS classes for browser border based on screen size
            getBrowserBorderCss() {
                return [this.screenSize, this.screenSize === '' ? 'border-none' : 'border-x'];
            },
            // Return CSS classes for desktop text styling
            getDesktopScreenCss() {
                return [this.screenSize === '' ? 'text-on-surface-strong forced-color-adjust-auto dark:text-on-surface-dark-strong' : 'opacity-60'];
            },
            // Return CSS classes for tablet text styling
            getTabletScreenCss() {
                return [this.screenSize === 'max-w-2xl' ? 'text-on-surface-strong forced-color-adjust-auto dark:text-on-surface-dark-strong' : 'opacity-60'];
            },
            // Return CSS classes for phone text styling
            getPhoneScreenCss() {
                return [this.screenSize === 'max-w-sm' ? 'text-on-surface-strong forced-color-adjust-auto dark:text-on-surface-dark-strong' : 'opacity-60'];
            }
        };
    });

// --------------------------------------------------------------------------------
// Alpine.js component: rzCheckboxGroupItem
// Manages a checkbox's state and its associated icon visibility.
// --------------------------------------------------------------------------------
    Alpine.data('rzCheckboxGroupItem', () => {
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
        };
    });

// --------------------------------------------------------------------------------
// Alpine.js component: rzCodeViewer
// This component handles code display, syntax highlighting, copy-to-clipboard,
// and expand/collapse functionality.
// --------------------------------------------------------------------------------
    Alpine.data('rzCodeViewer', () => {
        return {
            expand: false,
            border: true,
            codeStyle: '',
            copied: false,
            init() {
                // Retrieve assets and configuration from data attributes
                const assets = JSON.parse(this.$el.dataset.assets);
                const codeId = this.$el.dataset.codeid;
                const nonce = this.$el.dataset.nonce;

                require(assets, {
                    success: function () {
                        // After assets load, highlight the code block using Highlight.js
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
            notCopied() {
                return !this.copied;
            },
            disableCopied() {
                this.copied = false;
            },
            toggleExpand() {
                this.expand = !this.expand;
            },
            // Copy the inner text of the code block to the clipboard
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
        };
    });

// --------------------------------------------------------------------------------
// Alpine.js component: rzDateEdit
// This component initializes a date picker (using Flatpickr) on an input element.
// It retrieves its configuration and assets from data attributes.
// --------------------------------------------------------------------------------
    Alpine.data('rzDateEdit', () => ({
        options: {},
        placeholder: '',
        prependText: '',
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

// --------------------------------------------------------------------------------
// Alpine.js component: rzDropdown
// Handles dropdown menus including open/close behavior, keyboard navigation,
// and dynamically computing placement classes.
// --------------------------------------------------------------------------------
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
        // Computes the Tailwind CSS classes for the dropdown's anchor based on its data attribute
        getAnchorCss() {
            let defaultAnchorRaw = this.dropdownEl.getAttribute('data-anchor') || "";
            let defaultAnchor = defaultAnchorRaw.replace(/-/g, "").toLowerCase();
            // Map normalized anchor strings to Tailwind CSS class strings
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
            // Measure the dropdown trigger element
            const triggerRect = this.dropdownEl.getBoundingClientRect();

            // Create a temporary container for off-screen measurement
            let tempContainer = document.createElement('div');
            tempContainer.style.cssText = "position: absolute; top: 0; left: 0; visibility: hidden; pointer-events: none;";
            this.dropdownEl.appendChild(tempContainer);

            // Clone the dropdown menu element (expected to have role="menu")
            const originalMenu = this.dropdownEl.querySelector('[role="menu"]');
            if (!originalMenu) {
                return cssClasses;
            }
            let clone = originalMenu.cloneNode(true);
            clone.style.transition = "none";
            clone.style.transform = "none";
            clone.style.opacity = "1";
            clone.style.display = "block";
            tempContainer.appendChild(clone);

            // Force reflow to get dimensions
            let cloneRect = clone.getBoundingClientRect();
            tempContainer.parentNode.removeChild(tempContainer);

            const margin = 8;
            let wouldClip = false;
            if (defaultAnchor.startsWith("top")) {
                if (triggerRect.top < cloneRect.height + margin) {
                    wouldClip = true;
                }
            } else if (defaultAnchor.startsWith("bottom")) {
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

            // If clipping is detected, use a fallback anchor mapping
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
            return cssClasses;
        }
    }));

// --------------------------------------------------------------------------------
// Alpine.js component: rzDarkModeToggle
// This component toggles between light and dark themes.
// It reads the stored mode, applies the theme, and listens for OS-level changes.
// --------------------------------------------------------------------------------
    Alpine.data('rzDarkModeToggle', () => ({
        mode: 'light',
        applyTheme: null,
        init() {
            const hasLocalStorage = typeof window !== 'undefined' && 'localStorage' in window;
            const allowedModes = ['light', 'dark', 'auto'];
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            let storedMode = "auto"; 
            
            if (hasLocalStorage) {
                storedMode = localStorage.getItem('darkMode') ?? 'auto';

                // Validate stored mode against allowed values
                if (!allowedModes.includes(storedMode)) {
                    storedMode = 'light';
                }                
            }
            
            if (hasLocalStorage) {
                localStorage.setItem('darkMode', storedMode);
            }

            // Function to apply the theme based on stored mode and OS preference
            this.applyTheme = () => {
                document.documentElement.classList.toggle('dark',
                    storedMode === 'dark' || (storedMode === 'auto' && prefersDark));
            };
            this.applyTheme();

            // Listen for OS-level color scheme changes to reapply the theme
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.applyTheme);
        },
        // Returns true if dark mode should be active
        isDark() {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            var storedMode = localStorage.getItem('darkMode');
            return this.mode === 'dark' || (this.mode === 'auto' && prefersDark);
        },
        // Returns true if light mode should be active
        isLight() {
            return !this.isDark();
        },
        // Toggle the dark mode setting and dispatch a custom event
        toggle() {
            let storedMode = localStorage.getItem('darkMode');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (storedMode === 'light')
                storedMode = 'dark';
            else if (storedMode === 'dark')
                storedMode = 'light';
            else if (storedMode === 'auto') {
                storedMode = prefersDark ? 'light' : 'dark';
            }

            this.mode = storedMode;
            localStorage.setItem('darkMode', storedMode);

            const isDark = storedMode === 'dark' || (storedMode === 'auto' && prefersDark);
            document.documentElement.classList.toggle('dark', isDark);

            const darkModeEvent = new CustomEvent('darkModeToggle', {
                detail: {darkMode: isDark}
            });
            window.dispatchEvent(darkModeEvent);
        },
        destroy() {
            if (this.applyTheme) {
                window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this.applyTheme);
            }
        }
    }));
    
// --------------------------------------------------------------------------------
// Alpine.js component: rzEmbeddedPreview
// Manages an iframe preview and adjusts its height dynamically.
// It also passes dark mode settings to the iframe via postMessage.
// --------------------------------------------------------------------------------
    Alpine.data('rzEmbeddedPreview', () => {
        return {
            iframe: null,
            onDarkModeToggle: null,
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
            destroy() {
                window.removeEventListener('darkModeToggle', this.onDarkModeToggle);
            }
        };
    });

// --------------------------------------------------------------------------------
// Alpine.js component: rzEmpty
// Empty component to prevent CSP errors if defining x-data on it's own without a
// parameter
// --------------------------------------------------------------------------------
    Alpine.data('rzEmpty', () => {
    });
    
// --------------------------------------------------------------------------------
// Alpine.js component: rzHeading
// Observes heading elements to automatically update the current heading in the quick-reference.
// --------------------------------------------------------------------------------
    Alpine.data('rzHeading', () => {
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
                    const options = {threshold: 0.5};
                    this.observer = new IntersectionObserver(callback, options);
                    // Begin observing the heading element
                    this.observer.observe(this.$el);
                }
            },
            destroy() {
                if (this.observer != null)
                    this.observer.disconnect();
            }
        };
    });
    
// --------------------------------------------------------------------------------
// Alpine.js component: rzMarkdown
// Initializes Markdown rendering with syntax highlighting.
// --------------------------------------------------------------------------------
    Alpine.data('rzMarkdown', () => {
        return {
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

// --------------------------------------------------------------------------------
// Alpine.js component: rzPrependInput
// Adjusts the padding of an input element based on the width of a prepend element.
// --------------------------------------------------------------------------------
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

// --------------------------------------------------------------------------------
// Alpine.js component: rzProgress
// Implements a progress bar with dynamic percentage calculation, ARIA attributes,
// and methods to update, increment, or decrement progress.
// --------------------------------------------------------------------------------
    Alpine.data('rzProgress', () => ({
        currentVal: 0,
        minVal: 0,
        maxVal: 100,
        percentage: 0,
        label: '',
        init() {
            const element = this.$el;
            // Retrieve progress values from data attributes
            this.currentVal = parseInt(element.getAttribute('data-current-val')) || 0;
            this.minVal = parseInt(element.getAttribute('data-min-val')) || 0;
            this.maxVal = parseInt(element.getAttribute('data-max-val')) || 100;
            this.label = element.getAttribute('data-label');
            // Calculate initial percentage and update ARIA attributes
            this.calculatePercentage();
            element.setAttribute('aria-valuenow', this.currentVal);
            element.setAttribute('aria-valuemin', this.minVal);
            element.setAttribute('aria-valuemax', this.maxVal);
            element.setAttribute('aria-valuetext', `${this.percentage}%`);
            this.updateProgressBar();

            const resizeObserver = new ResizeObserver(entries => {
                this.updateProgressBar();
            });
            resizeObserver.observe(element);

            // Watch for changes in currentVal to update progress dynamically
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
        // Methods to set, increment, or decrement the progress value
        setProgress(value) {
            this.currentVal = value;
        },
        increment(val = 1) {
            this.currentVal = Math.min(this.currentVal + val, this.maxVal);
        },
        decrement(val = 1) {
            this.currentVal = Math.max(this.currentVal - val, this.minVal);
        }
    }));

// --------------------------------------------------------------------------------
// Alpine.js component: rzQuickReferenceContainer
// Maintains a list of heading IDs for a quick-reference sidebar.
// --------------------------------------------------------------------------------
    Alpine.data('rzQuickReferenceContainer', () => {
        return {
            headings: [],
            currentHeadingId: '',
            handleHeadingClick() {
                const id = this.$el.dataset.headingid;
                setTimeout(() => {
                    this.currentHeadingId = id;
                }, 10);
            },
            setCurrentHeading(id) {
                if (this.headings.includes(id)) {
                    this.currentHeadingId = id;
                }
            },
            getSelectedCss() {
                const id = this.$el.dataset.headingid;
                return {'font-bold': this.currentHeadingId === id};
            },
            init() {
                this.headings = JSON.parse(this.$el.dataset.headings);
                this.currentHeadingId = this.$el.dataset.currentheadingid;
            }
        };
    });

// --------------------------------------------------------------------------------
// Alpine.js component: rzTabs
// Implements tabbed navigation with keyboard support and marker repositioning.
// --------------------------------------------------------------------------------
    Alpine.data('rzTabs', () => {
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
            tabRepositionMarker(tabButton) {
                this.tabButton = tabButton;
                this.$refs.tabMarker.style.width = tabButton.offsetWidth + 'px';
                this.$refs.tabMarker.style.height = tabButton.offsetHeight + 'px';
                this.$refs.tabMarker.style.left = tabButton.offsetLeft + 'px';
                setTimeout(() => {
                    this.$refs.tabMarker.style.opacity = 1;
                }, 150);
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
            handleKeyDown(event) {
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
        };
    });

// --------------------------------------------------------------------------------
// Alpine.js component: rzSidebar
// Controls the visibility and animation of a collapsible sidebar.
// --------------------------------------------------------------------------------
    Alpine.data('rzSidebar', () => {
        return {
            showSidebar: false,
            isSidebarHidden() {
                return !this.showSidebar;
            },
            toggleSidebar() {
                this.showSidebar = !this.showSidebar;
            },
            hideSidebar() {
                this.showSidebar = false;
            },
            // Return translation classes based on sidebar state for smooth slide-in/out
            getSidebarTranslation() {
                return this.showSidebar ? 'translate-x-0' : '-translate-x-60';
            }
        };
    });

// --------------------------------------------------------------------------------
// Alpine.js component: rzSidebarLinkItem
// Manages individual sidebar link items, including collapsible behavior.
// --------------------------------------------------------------------------------
    Alpine.data('rzSidebarLinkItem', () => {
        return {
            isExpanded: false,
            chevronExpandedClass: "",
            chevronCollapsedClass: "",
            init() {
                this.isExpanded = this.$el.dataset.expanded;
                this.chevronExpandedClass = this.$el.dataset.chevronExpandedClass;
                this.chevronCollapsedClass = this.$el.dataset.chevronCollapsedClass;
            },
            isCollapsed() {
                return !this.isExpanded;
            },
            toggleExpanded() {
                this.isExpanded = !this.isExpanded;
            },
            hideSidebar() {
                this.showSidebar = false;
            },
            getExpandedClass() {
                return this.isExpanded ? this.chevronExpandedClass : this.chevronCollapsedClass;
            }
        };
    });

}

export { registerComponents, require };
