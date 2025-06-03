
// packages/rizzyui/src/js/lib/components/rzDropdownMenu.js
import { computePosition, offset, flip, shift } from '@floating-ui/dom';

export default function(Alpine) {
    Alpine.data('rzDropdownMenu', () => ({
        /* ------------------------------------------------------------------
           Reactive state (all plain keys – no getters / computed properties)
        ------------------------------------------------------------------ */
        open: false,
        isModal: true,
        ariaExpanded: 'false',     // <- string, so we can bind directly
        trapActive: false,         // <- boolean for x-trap / inert
        focusedIndex: null,
        menuItems: [],
        triggerEl: null,
        contentEl: null,
        anchor: 'bottom',
        pixelOffset: 6,
        activeSubmenu: null,
        isSubmenuActive: false,
        
        init() {
            this.triggerEl = this.$refs.trigger;
            this.contentEl = this.$refs.content;
            this.anchor = this.$el.dataset.anchor || 'bottom';
            this.pixelOffset = parseInt(this.$el.dataset.offset) || 6;
            this.isModal = (this.$el.dataset.modal !== 'false'); 

            this.$watch('open', (value) => {
                if (value) {
                    this.$nextTick(() => {
                        this.updatePosition();
                        this.menuItems = Array.from(
                            this.contentEl.querySelectorAll(
                                '[role^="menuitem"]:not([disabled],[aria-disabled="true"])'
                        ));
                    });
                    this.ariaExpanded = 'true';
                    this.trapActive   = this.isModal;
                } else {
                    this.focusedIndex = null;
                    this.closeAllSubmenus();
                    this.ariaExpanded = 'false';
                    this.trapActive   = false;
                }
            });
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
            if (item.getAttribute('aria-haspopup') === 'menu') { 
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
            this.activeSubmenu = null;
            this.isSubmenuActive = false;
        },
        
        setActiveSubmenu(submenuInstance) {
            if (this.activeSubmenu && this.activeSubmenu !== submenuInstance) {
                this.activeSubmenu.open = false;
            }
            this.activeSubmenu = submenuInstance;
            this.isSubmenuActive = this.activeSubmenu && this.activeSubmenu.open;
        }
    }));

    Alpine.data('rzDropdownSubmenu', () => ({
        open: false,
        ariaExpanded: 'false',
        parentDropdown: null,
        triggerEl: null,
        menuItems: [],
        focusedIndex: null,
        anchor: 'right-start', 
        pixelOffset: -4,       

        init() {
            this.parentDropdown = Alpine.$data(this.$el.closest('[x-data^="rzDropdownMenu"]'));
            this.triggerEl = this.$refs.subTrigger;
            this.anchor = this.$el.dataset.subAnchor || this.anchor; 
            this.pixelOffset = parseInt(this.$el.dataset.subOffset) || this.pixelOffset;

            this.$watch('open', (value) => {
                if (value) {
                    this.parentDropdown?.setActiveSubmenu(this);
                    this.$nextTick(() => {
                        const contentEl = this.$refs.subContent;
                        this.updatePosition(contentEl);
                        this.menuItems = Array.from(contentEl.querySelectorAll('[role^="menuitem"]:not([disabled], [aria-disabled="true"])'));
                    });
                    this.ariaExpanded = 'true';
                } else {
                    this.focusedIndex = null;
                    if (this.parentDropdown?.activeSubmenu === this) {
                        this.parentDropdown.activeSubmenu = null;
                    }
                    this.ariaExpanded = 'false';
                }
            });
        },
        
        updatePosition(contentEl) {
            if (!this.triggerEl || !contentEl) return;
            computePosition(this.triggerEl, contentEl, {
                placement: this.anchor,
                middleware: [
                    offset(this.pixelOffset),
                    flip(),
                    shift({padding: 8})
                ],
            }).then(({x, y}) => {
                Object.assign(contentEl.style, {
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
        
        openSubmenu(isOpen = true, focusFirst = false) {
            if (isOpen && !this.open) {
                this.parentDropdown?.closeAllSubmenus(this);
                this.open = true;
                if (focusFirst) {
                    this.$nextTick(() => this.focusFirstItem());
                }
            }
        },
        
        openSubmenuAndFocusFirst() { 
            this.openSubmenu(true, true);
        },
        
        closeSubmenu() {
            this.openSubmenu(false);
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