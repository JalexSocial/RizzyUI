import {computePosition} from '@floating-ui/dom';

// --------------------------------------------------------------------------------
// Alpine.js component: rzDropdown
// Handles dropdown menus including open/close behavior, keyboard navigation,
// and dynamically computing placement classes.
// --------------------------------------------------------------------------------
export default function(Alpine) {
    Alpine.data('rzDropdown', () => ({
        dropdownEl: null,
        triggerEl: null,
        floatingEl: null,
        anchorCss: "",
        dropdownOpen: false,
        openedWithKeyboard: false,
        init() {
            this.dropdownEl = this.$el;
            this.triggerEl = this.dropdownEl.querySelector('[data-trigger]');
            this.floatingEl = this.dropdownEl.querySelector('[data-floating]');
            this.anchorCss = this.getAnchorCss();
        },
        toggleDropdown() {
            this.anchorCss = this.getAnchorCss();

            let tempContainer = document.createElement('div');
            tempContainer.style.cssText = "position: absolute; top: 0; left: 0; visibility: hidden; pointer-events: none;";
            this.dropdownEl.appendChild(tempContainer);

            // Clone the dropdown menu element (expected to have role="menu")
            let clone = this.floatingEl.cloneNode(true);
            clone.style.transition = "none";
            clone.style.transform = "none";
            clone.style.opacity = "1";
            clone.style.display = "block";
            tempContainer.appendChild(clone);

            computePosition(this.triggerEl, clone).then(({x, y}) => {
                Object.assign(this.floatingEl.style, {
                    left: `${x}px`,
                    top: `${y}px`,
                });

                this.dropdownOpen = !this.dropdownOpen;
                tempContainer.parentNode.removeChild(tempContainer);
            });            
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
            
            if (true) return '';
            
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
}