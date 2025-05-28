import {computePosition, flip, shift, offset} from '@floating-ui/dom';

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
        anchor: "",
        offset: 6,
        dropdownOpen: false,
        openedWithKeyboard: false,
        init() {
            this.dropdownEl = this.$el;
            this.offset = parseInt(this.$el.dataset.offset || 6);
            this.anchor = (this.$el.dataset.anchor || "bottom").toLowerCase();
            this.triggerEl = this.dropdownEl.querySelector('[data-trigger]');
            this.floatingEl = this.dropdownEl.querySelector('[data-floating]');
        },
        toggleDropdown() {
            this.dropdownOpen = !this.dropdownOpen;
            this.updateFloatingCss();
        },
        openDropdown() {
            this.dropdownOpen = true;
            this.openedWithKeyboard = false;
            this.updateFloatingCss();            
        },
        openWithKeyboard() {
            this.dropdownOpen = true;
            this.openedWithKeyboard = true;
            this.updateFloatingCss();            
            this.focusWrapNext();
        },
        closeDropdown() {
            this.dropdownOpen = false;
            this.openedWithKeyboard = false;
            this.updateFloatingCss();            
        },
        focusWrapNext() {
            this.$focus.wrap().next();
        },
        focusWrapPrevious() {
            this.$focus.wrap().previous();
        },
        // Computes the Tailwind CSS classes for the dropdown's anchor based on its data attribute
        updateFloatingCss() {
            this.floatingEl.style.display = this.dropdownOpen ? "block" : "none";

            if (this.dropdownOpen) {
                computePosition(this.triggerEl, this.floatingEl, {
                    placement: this.anchor,
                    middleware: [offset(this.offset), flip(), shift()]
                }).then(({x, y}) => {
                    Object.assign(this.floatingEl.style, {
                        left: `${x}px`,
                        top: `${y}px`,
                    });
                });
            }
        }
    }));
}