
// packages/rizzyui/src/js/lib/components/rzDropdownMenu.js
import { computePosition, offset, flip, shift } from '@floating-ui/dom';

export default function(Alpine) {
    Alpine.data('rzDropdownMenu', () => ({
        open: false,
        isModal: true,
        focusedIndex: null,
        menuItems: [],
        triggerEl: null,
        contentEl: null,
        anchor: 'bottom',
        pixelOffset: 6,
        activeSubmenu: null,

        init() {
            this.triggerEl = this.$refs.trigger;
            this.contentEl = this.$refs.content;
            this.anchor = this.$el.dataset.anchor || 'bottom';
            this.pixelOffset = parseInt(this.$el.dataset.offset) || 6;
            this.isModal = (this.$el.dataset.modal !== 'false'); // Default to true if not specified or invalid

            this.$watch('open', (value) => {
                if (value) {
                    this.$nextTick(() => {
                        this.updatePosition();
                        this.menuItems = Array.from(this.contentEl.querySelectorAll('[role^="menuitem"]:not([disabled], [aria-disabled="true"])'));
                    });
                } else {
                    this.focusedIndex = null;
                    this.closeAllSubmenus();
                }
            });
        },

        getAriaExpandedState() {
            return this.open.toString();
        },

        isFocusTrappedAndOpen() {
            return this.open && this.isModal;
        },

        updatePosition() {
            if (!this.triggerEl || !this.contentEl) return;
            computePosition(this.triggerEl, this.contentEl, {
                placement: this.anchor,
                middleware: [
                    offset(this.pixelOffset),
                    flip(),
                    shift({ padding: 8 })
                ],
            }).then(({ x, y }) => {
                Object.assign(this.contentEl.style, {
                    left: `${x}px`,
                    top: `${y}px`,
                });
            });
        },

        toggle() {
            this.open = !this.open;
            if (this.open) {
                this.focusedIndex = -1; 
            }
        },
        
        handleTriggerKeydown(event) {
            // event is already passed by Alpine if not explicitly named in x-on
            if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
                event.preventDefault();
                this.open = true;
                this.$nextTick(() => {
                    if (event.key === 'ArrowUp') this.focusLastItem();
                    else this.focusFirstItem();
                });
            }
        },

        focusNextItem() {
            if (!this.menuItems.length) return;
            this.focusedIndex = (this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1) ? 0 : this.focusedIndex + 1;
            this.focusCurrentItem();
        },

        focusPreviousItem() {
            if (!this.menuItems.length) return;
            this.focusedIndex = (this.focusedIndex === null || this.focusedIndex <= 0) ? this.menuItems.length - 1 : this.focusedIndex - 1;
            this.focusCurrentItem();
        },

        focusFirstItem() {
            if (!this.menuItems.length) return;
            this.focusedIndex = 0;
            this.focusCurrentItem();
        },

        focusLastItem() {
            if (!this.menuItems.length) return;
            this.focusedIndex = this.menuItems.length - 1;
            this.focusCurrentItem();
        },

        focusCurrentItem() {
            if (this.focusedIndex !== null && this.menuItems[this.focusedIndex]) {
                this.menuItems[this.focusedIndex].focus();
            }
        },
        
        handleItemClick(event) {
            const item = event.currentTarget;
            if (item.getAttribute('aria-disabled') === 'true' || item.hasAttribute('disabled')) {
                return;
            }
            if (item.getAttribute('aria-haspopup') === 'menu') { // It's a sub-trigger
                return; 
            }
            this.open = false;
            this.$nextTick(() => this.triggerEl?.focus());
        },

        handleItemMousemove(event) {
            const item = event.currentTarget;
             if (item.getAttribute('aria-disabled') === 'true' || item.hasAttribute('disabled')) {
                return;
            }
            const index = this.menuItems.indexOf(item);
            if (index !== -1 && this.focusedIndex !== index) {
                this.focusedIndex = index;
                // Do not focus on mousemove to prevent focus stealing from keyboard users
                // this.focusCurrentItem(); 
            }
        },

        handleWindowEscape() {
            if (this.open) {
                this.open = false;
                this.$nextTick(() => this.triggerEl?.focus());
            }
        },

        handleContentTabKey() {
            if (this.open) {
                this.open = false;
                this.$nextTick(() => this.triggerEl?.focus());
            }
        },

        closeAllSubmenus(exceptThisOne = null) {
            const submenus = this.$el.querySelectorAll('[x-data^="rzDropdownSubmenu"]');
            submenus.forEach(sm => {
                const alpineInstance = Alpine.$data(sm);
                if (alpineInstance && alpineInstance !== exceptThisOne && alpineInstance.open) {
                    alpineInstance.open = false;
                }
            });
        },
        
        setActiveSubmenu(submenuInstance) {
            if (this.activeSubmenu && this.activeSubmenu !== submenuInstance) {
                this.activeSubmenu.open = false;
            }
            this.activeSubmenu = submenuInstance;
        }
    }));

    Alpine.data('rzDropdownSubmenu', () => ({
        open: false,
        parentDropdown: null,
        triggerEl: null,
        contentEl: null,
        menuItems: [],
        focusedIndex: null,
        anchor: 'right-start',
        pixelOffset: -4,

        init() {
            this.parentDropdown = Alpine.$data(this.$el.closest('[x-data^="rzDropdownMenu"]'));
            this.triggerEl = this.$refs.subTrigger;
            this.contentEl = this.$refs.subContent;
            // data-sub-anchor and data-sub-offset can be added to DropdownMenuSub.razor if needed
            this.anchor = this.$el.dataset.subAnchor || this.anchor; 
            this.pixelOffset = parseInt(this.$el.dataset.subOffset) || this.pixelOffset;

            this.$watch('open', (value) => {
                if (value) {
                    this.parentDropdown?.setActiveSubmenu(this);
                    this.$nextTick(() => {
                        this.updatePosition();
                        this.menuItems = Array.from(this.contentEl.querySelectorAll('[role^="menuitem"]:not([disabled], [aria-disabled="true"])'));
                    });
                } else {
                    this.focusedIndex = null;
                    if (this.parentDropdown?.activeSubmenu === this) {
                        this.parentDropdown.activeSubmenu = null;
                    }
                }
            });
        },

        get getAriaExpandedState() {
            return this.open.toString();
        },
        
        updatePosition() {
            if (!this.triggerEl || !this.contentEl) return;
            computePosition(this.triggerEl, this.contentEl, {
                placement: this.anchor,
                middleware: [
                    offset(this.pixelOffset),
                    flip(),
                    shift({padding: 8})
                ],
            }).then(({x, y}) => {
                Object.assign(this.contentEl.style, {
                    left: `${x}px`,
                    top: `${y}px`,
                });
            });
        },

        toggleSubmenu() {
            this.open = !this.open;
            if (this.open) {
                this.parentDropdown?.closeAllSubmenus(this);
                this.focusedIndex = -1; 
            }
        },
        
        openSubmenu(isOpen, focusFirst = false) {
            if (isOpen && !this.open) {
                this.parentDropdown?.closeAllSubmenus(this);
                this.open = true;
                if (focusFirst) {
                    this.$nextTick(() => this.focusFirstItem());
                }
            }
        },
        
        openSubmenuAndFocusFirst() { // Specifically for ArrowRight on subtrigger
            this.openSubmenu(true, true);
        },

        handleFocusOut(event) {
            if (!this.$el.contains(event.relatedTarget)) {
                this.open = false;
            }
        },

        focusNextItem() {
            if (!this.menuItems.length) return;
            this.focusedIndex = (this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1) ? 0 : this.focusedIndex + 1;
            this.focusCurrentItem();
        },

        focusPreviousItem() {
            if (!this.menuItems.length) return;
            this.focusedIndex = (this.focusedIndex === null || this.focusedIndex <= 0) ? this.menuItems.length - 1 : this.focusedIndex - 1;
            this.focusCurrentItem();
        },
        
        focusFirstItem() {
            if (!this.menuItems.length) return;
            this.focusedIndex = 0;
            this.focusCurrentItem();
        },

        focusLastItem() {
            if (!this.menuItems.length) return;
            this.focusedIndex = this.menuItems.length - 1;
            this.focusCurrentItem();
        },

        focusCurrentItem() {
             if (this.focusedIndex !== null && this.menuItems[this.focusedIndex]) {
                this.menuItems[this.focusedIndex].focus();
            }
        },
        
        handleItemClick(event) {
            const item = event.currentTarget;
            if (item.getAttribute('aria-disabled') === 'true' || item.hasAttribute('disabled')) {
                return;
            }
            this.open = false; 
            this.parentDropdown.open = false; 
            this.$nextTick(() => this.parentDropdown.triggerEl?.focus());
        },
        
        handleItemMousemove(event) {
            const item = event.currentTarget;
             if (item.getAttribute('aria-disabled') === 'true' || item.hasAttribute('disabled')) {
                return;
            }
            const index = this.menuItems.indexOf(item);
            if (index !== -1 && this.focusedIndex !== index) {
                this.focusedIndex = index;
                // Do not focus on mousemove
            }
        },

        handleSubmenuEscape() {
            if(this.open) {
                this.open = false;
                this.$nextTick(() => this.triggerEl?.focus());
            }
        },

        handleSubmenuArrowLeft() {
            if(this.open) {
                this.open = false;
                this.$nextTick(() => this.triggerEl?.focus());
            }
        }
    }));
}