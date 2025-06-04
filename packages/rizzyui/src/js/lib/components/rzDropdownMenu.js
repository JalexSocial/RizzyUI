
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
        parentEl: null,
        triggerEl: null,
        contentEl: null,
        anchor: 'bottom',
        pixelOffset: 3,
        activeSubmenu: null,
        isSubmenuActive: false,
        
        init() {
            this.parentEl = this.$el;
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

        toggle () {
            if (this.open) {                          
                this.closeAllSubmenus();                
                this.open = false;
                this.$nextTick(() => this.triggerEl?.focus());
            } else {                                  
                this.open = true;
                this.focusedIndex = -1;
            }
        },

        handleOutsideClick () {
            if (!this.open) return;              // already closed → ignore

            this.closeAllSubmenus();             // make sure teleported panels go away
            this.open = false;
            this.$nextTick(() => this.triggerEl?.focus());
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

        focusSelectedItem (item, {keepSubmenusOpen = false} = {}) {
            if (!item ||
                item.getAttribute('aria-disabled') === 'true' ||
                item.hasAttribute('disabled')) return;

            const index = this.menuItems.indexOf(item);
            if (index !== -1 && this.focusedIndex !== index) {
                if (!keepSubmenusOpen) this.closeAllSubmenus();
                this.focusedIndex = index;
                this.menuItems[this.focusedIndex].focus();
            }
        },

        handleItemClick (event) {
            const item = event.currentTarget;

            if (item.getAttribute('aria-disabled') === 'true' || item.hasAttribute('disabled')) {
                return;
            }

            // If this item is a submenu trigger, forward the action to that submenu
            if (item.getAttribute('aria-haspopup') === 'menu') {
                Alpine.$data(item.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
                return;                       // do *not* close the whole dropdown
            }

            // Regular leaf item → close the dropdown
            this.open = false;
            this.$nextTick(() => this.triggerEl?.focus());
        },

        handleItemMousemove(event) {
            const item = event.currentTarget;
            this.focusSelectedItem(item);
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
            const submenus = this.parentEl.querySelectorAll('[x-data^="rzDropdownSubmenu"]');
            submenus.forEach(sm => {
                const alpineInstance = Alpine.$data(sm);
                if (alpineInstance && alpineInstance !== exceptThisOne && alpineInstance.open) {
                    alpineInstance.closeSubmenu();
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
        pixelOffset: 0,       

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

        openSubmenu (isOpen = true, focusFirst = false) {
            if (isOpen && !this.open) {
                this.parentDropdown?.focusSelectedItem(this.triggerEl,
                    { keepSubmenusOpen : true });
                this.parentDropdown?.closeAllSubmenus(this);
                this.open = true;

                // ──► ensure the first item, not the <div>, gets focus
                const giveFocus = () => {
                    if (focusFirst && this.menuItems.length) {
                        this.menuItems[0].focus();
                    } else {
                        this.triggerEl.focus();          // keep the ring on the trigger
                    }
                };
                this.$nextTick(giveFocus);
            }
        },
        
        openSubmenuAndFocusFirst() { 
            this.openSubmenu(true, true);
        },
        
        closeSubmenu() {
            this.open = false;
        },

        handleFocusOut (e) {
            const next = e.relatedTarget;          // element that will receive focus
            if (!next) return;                     // focus left the document

            // keep the submenu open if focus merely moved into the teleported panel
            if (this.$el.contains(next) || this.$refs.subContent?.contains(next)) {
                return;
            }

            // focus really went somewhere else → close
            this.open = false;
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

            if (item === this.triggerEl) {      // submenu trigger
                this.toggleSubmenu();
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