
// packages/rizzyui/src/js/lib/components/rzDropdownMenu.js
import { computePosition, offset, flip, shift } from '@floating-ui/dom';

export default function(Alpine) {
    /**
     * Manages the state and behavior of the root dropdown menu.
     */
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
        contentEl: null, // Will be populated when menu opens
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
            this.anchor = this.$el.dataset.anchor || 'bottom';
            this.pixelOffset = parseInt(this.$el.dataset.offset) || 6;
            this.isModal = (this.$el.dataset.modal !== 'false');

            this.$watch('open', (value) => {
                if (value) {
                    this._lastNavAt = 0;
                    this.$nextTick(() => {
                        this.contentEl = document.getElementById(`${this.selfId}-content`);
                        if (!this.contentEl) return;

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
                    this.contentEl = null;
                }
            });
        },

        // --- METHODS ---
        updatePosition() {
            if (!this.triggerEl || !this.contentEl) return;
            this.contentEl.style.setProperty('--rizzy-dropdown-trigger-width', `${this.triggerEl.offsetWidth}px`);
            computePosition(this.triggerEl, this.contentEl, {
                placement: this.anchor,
                middleware: [offset(this.pixelOffset), flip(), shift({ padding: 8 })],
            }).then(({ x, y }) => {
                Object.assign(this.contentEl.style, { left: `${x}px`, top: `${y}px` });
            });
        },

        /**
         * Executes the `toggle` operation.
         * @returns {any} Returns the result of `toggle` when applicable.
         */
        toggle() {
            if (this.open) {
                this.open = false;
                let self = this;
                this.$nextTick(() => self.triggerEl?.focus());
            } else {
                this.open = true;
                this.focusedIndex = -1;
            }
        },

        /**
         * Executes the `handleOutsideClick` operation.
         * @returns {any} Returns the result of `handleOutsideClick` when applicable.
         */
        handleOutsideClick() {
            if (!this.open) return;
            this.open = false;
            let self = this;
            this.$nextTick(() => self.triggerEl?.focus());
        },

        /**
         * Executes the `handleTriggerKeydown` operation.
         * @param {any} event Input value for this method.
         * @returns {any} Returns the result of `handleTriggerKeydown` when applicable.
         */
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

        /**
         * Executes the `focusNextItem` operation.
         * @returns {any} Returns the result of `focusNextItem` when applicable.
         */
        focusNextItem() {
            const now = Date.now();
            if (now - this._lastNavAt < this.navThrottle) return;
            this._lastNavAt = now;
            if (!this.menuItems.length) return;
            this.focusedIndex = (this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1) ? 0 : this.focusedIndex + 1;
            this.focusCurrentItem();
        },

        /**
         * Executes the `focusPreviousItem` operation.
         * @returns {any} Returns the result of `focusPreviousItem` when applicable.
         */
        focusPreviousItem() {
            const now = Date.now();
            if (now - this._lastNavAt < this.navThrottle) return;
            this._lastNavAt = now;
            if (!this.menuItems.length) return;
            this.focusedIndex = (this.focusedIndex === null || this.focusedIndex <= 0) ? this.menuItems.length - 1 : this.focusedIndex - 1;
            this.focusCurrentItem();
        },

        /**
         * Executes the `focusFirstItem` operation.
         * @returns {any} Returns the result of `focusFirstItem` when applicable.
         */
        focusFirstItem() {
            if (!this.menuItems.length) return;
            this.focusedIndex = 0;
            this.focusCurrentItem();
        },

        /**
         * Executes the `focusLastItem` operation.
         * @returns {any} Returns the result of `focusLastItem` when applicable.
         */
        focusLastItem() {
            if (!this.menuItems.length) return;
            this.focusedIndex = this.menuItems.length - 1;
            this.focusCurrentItem();
        },

        /**
         * Executes the `focusCurrentItem` operation.
         * @returns {any} Returns the result of `focusCurrentItem` when applicable.
         */
        focusCurrentItem() {
            if (this.focusedIndex !== null && this.menuItems[this.focusedIndex]) {
                this.$nextTick(() => this.menuItems[this.focusedIndex].focus());
            }
        },

        /**
         * Executes the `focusSelectedItem` operation.
         * @param {any} item Input value for this method.
         * @returns {any} Returns the result of `focusSelectedItem` when applicable.
         */
        focusSelectedItem(item) {
            if (!item || item.getAttribute('aria-disabled') === 'true' || item.hasAttribute('disabled')) return;
            const index = this.menuItems.indexOf(item);
            if (index !== -1) {
                this.focusedIndex = index;
                item.focus();
            }
        },

        /**
         * Executes the `handleItemClick` operation.
         * @param {any} event Input value for this method.
         * @returns {any} Returns the result of `handleItemClick` when applicable.
         */
        handleItemClick(event) {
            const item = event.currentTarget;
            if (item.getAttribute('aria-disabled') === 'true' || item.hasAttribute('disabled')) return;
            if (item.getAttribute('aria-haspopup') === 'menu') {
                Alpine.$data(item.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
                return;
            }
            this.open = false;
            let self = this;
            this.$nextTick(() => self.triggerEl?.focus());
        },
        
        /**
         * Executes the `handleItemMouseEnter` operation.
         * @param {any} event Input value for this method.
         * @returns {any} Returns the result of `handleItemMouseEnter` when applicable.
         */
        handleItemMouseEnter(event) {
            const item = event.currentTarget;
            this.focusSelectedItem(item);
            
            if (item.getAttribute('aria-haspopup') !== 'menu') {
                this.closeAllSubmenus();
            }
        },

        /**
         * Executes the `handleWindowEscape` operation.
         * @returns {any} Returns the result of `handleWindowEscape` when applicable.
         */
        handleWindowEscape() {
            if (this.open) {
                this.open = false;
                let self = this;
                this.$nextTick(() => self.triggerEl?.focus());
            }
        },

        /**
         * Executes the `handleContentTabKey` operation.
         * @returns {any} Returns the result of `handleContentTabKey` when applicable.
         */
        handleContentTabKey() {
            if (this.open) {
                this.open = false;
                let self = this;
                this.$nextTick(() => self.triggerEl?.focus());
            }
        },
        
        /**
         * Executes the `handleTriggerMouseover` operation.
         * @returns {any} Returns the result of `handleTriggerMouseover` when applicable.
         */
        handleTriggerMouseover() {
            let self = this;
            this.$nextTick(() => self.$el.firstElementChild?.focus());
        },

        /**
         * Executes the `closeAllSubmenus` operation.
         * @returns {any} Returns the result of `closeAllSubmenus` when applicable.
         */
        closeAllSubmenus() {
            const submenus = this.parentEl.querySelectorAll('[x-data^="rzDropdownSubmenu"]');
            submenus.forEach(el => {
                Alpine.$data(el)?.closeSubmenu();
            });
            this.isSubmenuActive = false;
        }
    }));

    /**
     * Manages the state and behavior of a nested submenu.
     */
    Alpine.data('rzDropdownSubmenu', () => ({
        // --- STATE ---
        open: false,
        ariaExpanded: 'false',
        parentDropdown: null,
        triggerEl: null,
        contentEl: null, // Will be populated when submenu opens
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
            
            const parentId = this.$el.dataset.parentId;
            if (parentId) {
                const parentEl = document.getElementById(parentId);
                if (parentEl) {
                    this.parentDropdown = Alpine.$data(parentEl);
                }
            }
            if (!this.parentDropdown) {
                console.error("RzDropdownSubmenu could not find its parent RzDropdownMenu controller.");
                return;
            }

            this.triggerEl = this.$refs.subTrigger;
            this.siblingContainer = this.$el.parentElement;
            this.anchor = this.$el.dataset.subAnchor || this.anchor;
            this.pixelOffset = parseInt(this.$el.dataset.subOffset) || this.pixelOffset;

            this.$watch('open', (value) => {
                if (value) {
                    this._lastNavAt = 0;
                    this.parentDropdown.isSubmenuActive = true;
                    this.$nextTick(() => {
                        this.contentEl = document.getElementById(`${this.selfId}-subcontent`);
                        if (!this.contentEl) return;

                        this.updatePosition(this.contentEl);
                        this.menuItems = Array.from(this.contentEl.querySelectorAll('[role^="menuitem"]:not([disabled], [aria-disabled="true"])'));
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
                    this.contentEl = null;
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

        /**
         * Executes the `handleTriggerMouseEnter` operation.
         * @returns {any} Returns the result of `handleTriggerMouseEnter` when applicable.
         */
        handleTriggerMouseEnter() {
            clearTimeout(this.closeTimeout);
            this.triggerEl.focus();
            this.openSubmenu();
        },

        /**
         * Executes the `handleTriggerMouseLeave` operation.
         * @returns {any} Returns the result of `handleTriggerMouseLeave` when applicable.
         */
        handleTriggerMouseLeave() {
            this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay);
        },

        /**
         * Executes the `handleContentMouseEnter` operation.
         * @returns {any} Returns the result of `handleContentMouseEnter` when applicable.
         */
        handleContentMouseEnter() {
            clearTimeout(this.closeTimeout);
        },

        /**
         * Executes the `handleContentMouseLeave` operation.
         * @returns {any} Returns the result of `handleContentMouseLeave` when applicable.
         */
        handleContentMouseLeave() {
            const childSubmenus = this.contentEl?.querySelectorAll('[x-data^="rzDropdownSubmenu"]');
            if (childSubmenus) {
                const isAnyChildOpen = Array.from(childSubmenus).some(el => Alpine.$data(el)?.open);
                if (isAnyChildOpen) {
                    return;
                }
            }
            this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay);
        },

        /**
         * Executes the `openSubmenu` operation.
         * @param {any} focusFirst Input value for this method.
         * @returns {any} Returns the result of `openSubmenu` when applicable.
         */
        openSubmenu(focusFirst = false) {
            if (this.open) return;
            this.closeSiblingSubmenus();
            this.open = true;
            if (focusFirst) {
                this.$nextTick(() => requestAnimationFrame(() => this.focusFirstItem()));
            }
        },
        
        /**
         * Executes the `closeSubmenu` operation.
         * @returns {any} Returns the result of `closeSubmenu` when applicable.
         */
        closeSubmenu() {
            const childSubmenus = this.contentEl?.querySelectorAll('[x-data^="rzDropdownSubmenu"]');
            childSubmenus?.forEach(el => {
                Alpine.$data(el)?.closeSubmenu();
            });
            this.open = false;
        },

        /**
         * Executes the `closeSiblingSubmenus` operation.
         * @returns {any} Returns the result of `closeSiblingSubmenus` when applicable.
         */
        closeSiblingSubmenus() {
            if (!this.siblingContainer) return;
            const siblings = Array.from(this.siblingContainer.children).filter(
                el => el.hasAttribute('x-data') && el.getAttribute('x-data').startsWith('rzDropdownSubmenu') && el.id !== this.selfId
            );
            siblings.forEach(el => {
                Alpine.$data(el)?.closeSubmenu();
            });
        },

        /**
         * Executes the `toggleSubmenu` operation.
         * @returns {any} Returns the result of `toggleSubmenu` when applicable.
         */
        toggleSubmenu() {
            this.open ? this.closeSubmenu() : this.openSubmenu();
        },

        /**
         * Executes the `openSubmenuAndFocusFirst` operation.
         * @returns {any} Returns the result of `openSubmenuAndFocusFirst` when applicable.
         */
        openSubmenuAndFocusFirst() {
            this.openSubmenu(true);
        },

        /**
         * Executes the `handleTriggerKeydown` operation.
         * @param {any} e Input value for this method.
         * @returns {any} Returns the result of `handleTriggerKeydown` when applicable.
         */
        handleTriggerKeydown(e) {
            if (['ArrowRight', 'Enter', ' '].includes(e.key)) {
                e.preventDefault();
                this.openSubmenuAndFocusFirst();
            }
        },

        /**
         * Executes the `focusNextItem` operation.
         * @returns {any} Returns the result of `focusNextItem` when applicable.
         */
        focusNextItem() {
            const now = Date.now();
            if (now - this._lastNavAt < this.navThrottle) return;
            this._lastNavAt = now;
            if (!this.menuItems.length) return;
            this.focusedIndex = (this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1) ? 0 : this.focusedIndex + 1;
            this.focusCurrentItem();
        },

        /**
         * Executes the `focusPreviousItem` operation.
         * @returns {any} Returns the result of `focusPreviousItem` when applicable.
         */
        focusPreviousItem() {
            const now = Date.now();
            if (now - this._lastNavAt < this.navThrottle) return;
            this._lastNavAt = now;
            if (!this.menuItems.length) return;
            this.focusedIndex = (this.focusedIndex === null || this.focusedIndex <= 0) ? this.menuItems.length - 1 : this.focusedIndex - 1;
            this.focusCurrentItem();
        },

        /**
         * Executes the `focusFirstItem` operation.
         * @returns {any} Returns the result of `focusFirstItem` when applicable.
         */
        focusFirstItem() {
            if (!this.menuItems.length) return;
            this.focusedIndex = 0;
            this.focusCurrentItem();
        },

        /**
         * Executes the `focusLastItem` operation.
         * @returns {any} Returns the result of `focusLastItem` when applicable.
         */
        focusLastItem() {
            if (!this.menuItems.length) return;
            this.focusedIndex = this.menuItems.length - 1;
            this.focusCurrentItem();
        },

        /**
         * Executes the `focusCurrentItem` operation.
         * @returns {any} Returns the result of `focusCurrentItem` when applicable.
         */
        focusCurrentItem() {
            if (this.focusedIndex !== null && this.menuItems[this.focusedIndex]) {
                this.menuItems[this.focusedIndex].focus();
            }
        },

        /**
         * Executes the `handleItemClick` operation.
         * @param {any} event Input value for this method.
         * @returns {any} Returns the result of `handleItemClick` when applicable.
         */
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

        /**
         * Executes the `handleItemMouseEnter` operation.
         * @param {any} event Input value for this method.
         * @returns {any} Returns the result of `handleItemMouseEnter` when applicable.
         */
        handleItemMouseEnter(event) {
            const item = event.currentTarget;
            if (item.getAttribute('aria-disabled') === 'true' || item.hasAttribute('disabled')) return;

            const index = this.menuItems.indexOf(item);
            if (index !== -1) {
                this.focusedIndex = index;
                item.focus();
            }

            if (item.getAttribute('aria-haspopup') === 'menu') {
                Alpine.$data(item.closest('[x-data^="rzDropdownSubmenu"]'))?.openSubmenu();
            } else {
                this.closeSiblingSubmenus();
            }
        },

        /**
         * Executes the `handleSubmenuEscape` operation.
         * @returns {any} Returns the result of `handleSubmenuEscape` when applicable.
         */
        handleSubmenuEscape() {
            if (this.open) {
                this.open = false;
                this.$nextTick(() => this.triggerEl?.focus());
            }
        },

        /**
         * Executes the `handleSubmenuArrowLeft` operation.
         * @returns {any} Returns the result of `handleSubmenuArrowLeft` when applicable.
         */
        handleSubmenuArrowLeft() {
            if (this.open) {
                this.open = false;
                this.$nextTick(() => this.triggerEl?.focus());
            }
        }
    }));
}
