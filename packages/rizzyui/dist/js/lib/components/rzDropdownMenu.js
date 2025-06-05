
// packages/rizzyui/src/js/lib/components/rzDropdownMenu.js
import { computePosition, offset, flip, shift } from '@floating-ui/dom';

export default function(Alpine) {
    Alpine.data('rzDropdownMenu', () => ({
        // --- STATE ---
        open: false,
        isModal: true,
        ariaExpanded: 'false',
        trapActive: false,
        focusedIndex: null,
        menuItems: [],
        parentEl: null,
        triggerEl: null,
        contentEl: null,
        anchor: 'bottom',
        pixelOffset: 3,
        isSubmenuActive: false,
        navThrottle: 100,
        _lastNavAt: 0,
        selfId: null,

        // --- INIT ---
        init() {
            if (!this.$el.id) this.$el.id = crypto.randomUUID();
            this.selfId = this.$el.id;
            this.parentEl = this.$el;
            this.triggerEl = this.$refs.trigger;
            this.contentEl = this.$refs.content;
            this.anchor = this.$el.dataset.anchor || 'bottom';
            this.pixelOffset = parseInt(this.$el.dataset.offset) || 6;
            this.isModal = (this.$el.dataset.modal !== 'false');

            this.$watch('open', (value) => {
                if (value) {
                    this._lastNavAt = 0;
                    this.$nextTick(() => {
                        this.updatePosition();
                        this.menuItems = Array.from(
                            this.contentEl.querySelectorAll(
                                '[role^="menuitem"]:not([disabled],[aria-disabled="true"])'
                            ));
                    });
                    this.ariaExpanded = 'true';
                    this.triggerEl.dataset.state = 'open';
                    this.trapActive = this.isModal;
                } else {
                    this.focusedIndex = null;
                    this.closeAllSubmenus();
                    this.ariaExpanded = 'false';
                    delete this.triggerEl.dataset.state;
                    this.trapActive = false;
                }
            });
        },

        // --- METHODS ---
        updatePosition() {
            if (!this.triggerEl || !this.contentEl) return;
            computePosition(this.triggerEl, this.contentEl, {
                placement: this.anchor,
                middleware: [offset(this.pixelOffset), flip(), shift({ padding: 8 })],
            }).then(({ x, y }) => {
                Object.assign(this.contentEl.style, { left: `${x}px`, top: `${y}px` });
            });
        },

        toggle() {
            if (this.open) {
                this.open = false;
                this.$nextTick(() => this.triggerEl?.focus());
            } else {
                this.open = true;
                this.focusedIndex = -1;
            }
        },

        handleOutsideClick() {
            if (!this.open) return;
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
            const now = Date.now();
            if (now - this._lastNavAt < this.navThrottle) return;
            this._lastNavAt = now;
            if (!this.menuItems.length) return;
            this.focusedIndex = (this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1) ? 0 : this.focusedIndex + 1;
            this.focusCurrentItem();
        },

        focusPreviousItem() {
            const now = Date.now();
            if (now - this._lastNavAt < this.navThrottle) return;
            this._lastNavAt = now;
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
                this.$nextTick(() => this.menuItems[this.focusedIndex].focus());
            }
        },

        handleItemClick(event) {
            const item = event.currentTarget;
            if (item.getAttribute('aria-disabled') === 'true' || item.hasAttribute('disabled')) return;
            if (item.getAttribute('aria-haspopup') === 'menu') {
                Alpine.$data(item.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
                return;
            }
            this.open = false;
            this.$nextTick(() => this.triggerEl?.focus());
        },
        
        handleItemMousemove(event) {
            const item = event.currentTarget;
            if (!item || item.getAttribute('aria-disabled') === 'true' || item.hasAttribute('disabled')) return;

            const index = this.menuItems.indexOf(item);
            if (index !== -1 && this.focusedIndex !== index) {
                this.focusedIndex = index;
                this.menuItems[this.focusedIndex].focus();
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
        
        handleTriggerMouseover() {
             this.$nextTick(() => this.$el.firstChild?.focus());
        },

        closeAllSubmenus() {
            const submenus = this.parentEl.querySelectorAll('[x-data^="rzDropdownSubmenu"]');
            submenus.forEach(el => {
                Alpine.$data(el)?.closeSubmenu();
            });
            this.isSubmenuActive = false;
        }
    }));

    Alpine.data('rzDropdownSubmenu', () => ({
        // --- STATE ---
        open: false,
        ariaExpanded: 'false',
        parentDropdown: null,
        parentSubmenu: null, // <-- NEW
        triggerEl: null,
        menuItems: [],
        focusedIndex: null,
        anchor: 'right-start',
        pixelOffset: 0,
        navThrottle: 100,
        _lastNavAt: 0,
        selfId: null,
        siblingContainer: null,
        closeTimeout: null,
        closeDelay: 150,

        // --- INIT ---
        init() {
            if (!this.$el.id) this.$el.id = crypto.randomUUID();
            this.selfId = this.$el.id;
            this.parentDropdown = Alpine.$data(this.$el.closest('[x-data^="rzDropdownMenu"]'));
            this.triggerEl = this.$refs.subTrigger;
            this.siblingContainer = this.$el.parentElement;
            this.anchor = this.$el.dataset.subAnchor || this.anchor;
            this.pixelOffset = parseInt(this.$el.dataset.subOffset) || this.pixelOffset;

            // Find parent submenu if nested
            const parentSubmenuEl = this.$el.parentElement.closest('[x-data^="rzDropdownSubmenu"]');
            if (parentSubmenuEl) {
                this.parentSubmenu = Alpine.$data(parentSubmenuEl);
            }

            this.$watch('open', (value) => {
                if (value) {
                    this._lastNavAt = 0;
                    this.parentDropdown.isSubmenuActive = true;
                    this.$nextTick(() => {
                        const contentEl = this.$refs.subContent;
                        this.updatePosition(contentEl);
                        this.menuItems = Array.from(contentEl.querySelectorAll('[role^="menuitem"]:not([disabled], [aria-disabled="true"])'));
                    });
                    this.ariaExpanded = 'true';
                    this.triggerEl.dataset.state = 'open';
                } else {
                    this.focusedIndex = null;
                    this.ariaExpanded = 'false';
                    delete this.triggerEl.dataset.state;
                    this.$nextTick(() => {
                        const anySubmenuIsOpen = this.parentDropdown.parentEl.querySelector('[x-data^="rzDropdownSubmenu"] [data-state="open"]');
                        if (!anySubmenuIsOpen) this.parentDropdown.isSubmenuActive = false;
                    });
                }
            });
        },
        
        // --- METHODS ---
        updatePosition(contentEl) {
            if (!this.triggerEl || !contentEl) return;
            computePosition(this.triggerEl, contentEl, {
                placement: this.anchor,
                middleware: [offset(this.pixelOffset), flip(), shift({ padding: 8 })],
            }).then(({ x, y }) => {
                Object.assign(contentEl.style, { left: `${x}px`, top: `${y}px` });
            });
        },

        cancelCloseTimeout() {
            clearTimeout(this.closeTimeout);
        },

        handleTriggerMouseEnter() {
            this.parentSubmenu?.cancelCloseTimeout();
            clearTimeout(this.closeTimeout);
            this.openSubmenu();
        },

        handleTriggerMouseLeave() {
            this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay);
        },

        handleContentMouseEnter() {
            this.parentSubmenu?.cancelCloseTimeout();
            clearTimeout(this.closeTimeout);
        },

        handleContentMouseLeave() {
            this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay);
        },

        handleTriggerFocusIn() {
            this.parentSubmenu?.cancelCloseTimeout();
            clearTimeout(this.closeTimeout);
        },

        handleTriggerFocusOut() {
            this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay);
        },

        handleContentFocusIn() {
            this.parentSubmenu?.cancelCloseTimeout();
            clearTimeout(this.closeTimeout);
        },

        handleContentFocusOut() {
            this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay);
        },

        openSubmenu(focusFirst = false) {
            if (this.open) return;
            this.closeSiblingSubmenus();
            this.open = true;
            this.$nextTick(() => {
                if (focusFirst && this.menuItems.length > 0) {
                    this.focusedIndex = 0;
                    this.menuItems[0].focus();
                }
            });
        },
        
        closeSubmenu() {
            const childSubmenus = this.$refs.subContent?.querySelectorAll('[x-data^="rzDropdownSubmenu"]');
            childSubmenus?.forEach(el => {
                Alpine.$data(el)?.closeSubmenu();
            });
            this.open = false;
        },

        closeSiblingSubmenus() {
            if (!this.siblingContainer) return;
            const siblings = Array.from(this.siblingContainer.children).filter(
                el => el.hasAttribute('x-data') && el.getAttribute('x-data').startsWith('rzDropdownSubmenu') && el.id !== this.selfId
            );
            siblings.forEach(el => {
                Alpine.$data(el)?.closeSubmenu();
            });
        },

        toggleSubmenu() {
            this.open ? this.closeSubmenu() : this.openSubmenu();
        },

        openSubmenuAndFocusFirst() {
            this.openSubmenu(true);
        },

        handleTriggerKeydown(e) {
            if (['ArrowRight', 'Enter', ' '].includes(e.key)) {
                e.preventDefault();
                this.openSubmenuAndFocusFirst();
            }
        },

        focusNextItem() {
            const now = Date.now();
            if (now - this._lastNavAt < this.navThrottle) return;
            this._lastNavAt = now;
            if (!this.menuItems.length) return;
            this.focusedIndex = (this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1) ? 0 : this.focusedIndex + 1;
            this.focusCurrentItem();
        },

        focusPreviousItem() {
            const now = Date.now();
            if (now - this._lastNavAt < this.navThrottle) return;
            this._lastNavAt = now;
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
            if (item.getAttribute('aria-disabled') === 'true' || item.hasAttribute('disabled')) return;
            if (item.getAttribute('aria-haspopup') === 'menu') {
                Alpine.$data(item.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
                return; 
            }
            this.parentDropdown.open = false;
            this.$nextTick(() => this.parentDropdown.triggerEl?.focus());
        },

        handleItemMousemove(event) {
            const item = event.currentTarget;
            if (item.getAttribute('aria-disabled') === 'true' || item.hasAttribute('disabled')) return;

            if (item.getAttribute('aria-haspopup') === 'menu') {
                Alpine.$data(item.closest('[x-data^="rzDropdownSubmenu"]'))?.openSubmenu();
            } else {
                this.closeSiblingSubmenus();
            }

            const index = this.menuItems.indexOf(item);
            if (index !== -1 && this.focusedIndex !== index) {
                this.focusedIndex = index;
                this.menuItems[this.focusedIndex].focus();
            }
        },

        handleSubmenuEscape() {
            if (this.open) {
                this.open = false;
                this.$nextTick(() => this.triggerEl?.focus());
            }
        },

        handleSubmenuArrowLeft() {
            if (this.open) {
                this.open = false;
                this.$nextTick(() => this.triggerEl?.focus());
            }
        }
    }));
}