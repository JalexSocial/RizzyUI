import { computePosition, offset, flip, shift } from '@floating-ui/dom';

export default function(Alpine) {
    Alpine.data('rzMenubar', () => ({
        currentMenuValue: '',
        currentTrigger: null,
        ariaExpanded: 'false',

        isMenuOpen() {
            const value = this.$el.dataset.menuContent;
            return this.currentMenuValue !== '' && value === this.currentMenuValue;
        },

        setTriggerState(trigger, isOpen) {
            if (!trigger) return;
            trigger.dataset.state = isOpen ? 'open' : 'closed';
            this.ariaExpanded = isOpen ? 'true' : 'false';
        },

        openMenu(value, trigger) {
            if (!value) return;
            this.closeAllSubmenus();

            if (this.currentTrigger && this.currentTrigger !== trigger) {
                this.setTriggerState(this.currentTrigger, false);
            }

            this.currentMenuValue = value;
            this.currentTrigger = trigger;
            this.setTriggerState(trigger, true);

            this.$nextTick(() => {
                const menuContent = this.$el.querySelector(`[data-menu-content="${value}"]`) ?? document.querySelector(`[data-menu-content="${value}"]`);
                if (!menuContent || !trigger) return;

                computePosition(trigger, menuContent, {
                    placement: 'bottom-start',
                    middleware: [offset(4), flip(), shift({ padding: 8 })],
                }).then(({ x, y }) => {
                    Object.assign(menuContent.style, { left: `${x}px`, top: `${y}px` });
                });
            });
        },

        closeMenus() {
            this.currentMenuValue = '';
            this.setTriggerState(this.currentTrigger, false);
            this.currentTrigger = null;
            this.closeAllSubmenus();
        },

        closeAllSubmenus() {
            window.dispatchEvent(new CustomEvent('menubar-close-all-submenus'));
        },

        getMenuValueFromTrigger(trigger) {
            return trigger?.dataset?.menuValue ?? trigger?.closest('[data-menu-value]')?.dataset?.menuValue ?? '';
        },

        handleTriggerPointerDown(event) {
            if (event.button !== 0 || event.ctrlKey) return;
            const trigger = event.currentTarget;
            const value = this.getMenuValueFromTrigger(trigger);
            if (this.currentMenuValue === value) {
                this.closeMenus();
            } else {
                this.openMenu(value, trigger);
            }
            event.preventDefault();
        },

        handleTriggerPointerEnter(event) {
            if (!this.currentMenuValue) return;
            const trigger = event.currentTarget;
            const value = this.getMenuValueFromTrigger(trigger);
            if (value && value !== this.currentMenuValue) {
                this.openMenu(value, trigger);
                trigger.focus();
            }
        },

        handleTriggerKeydown(event) {
            const trigger = event.currentTarget;
            const value = this.getMenuValueFromTrigger(trigger);
            if (['Enter', ' ', 'ArrowDown'].includes(event.key)) {
                this.openMenu(value, trigger);
                event.preventDefault();
                return;
            }

            if (['ArrowRight', 'ArrowLeft'].includes(event.key)) {
                const triggers = Array.from(this.$el.querySelectorAll('[data-slot="menubar-trigger"]'));
                const currentIndex = triggers.indexOf(trigger);
                if (currentIndex < 0) return;
                const nextIndex = event.key === 'ArrowRight'
                    ? (currentIndex + 1) % triggers.length
                    : (currentIndex - 1 + triggers.length) % triggers.length;
                const nextTrigger = triggers[nextIndex];
                if (!nextTrigger) return;
                nextTrigger.focus();
                if (this.currentMenuValue) {
                    this.openMenu(this.getMenuValueFromTrigger(nextTrigger), nextTrigger);
                }
                event.preventDefault();
            }
        },

        handleContentKeydown(event) {
            if (event.key === 'Escape') {
                this.closeMenus();
                this.currentTrigger?.focus();
            }
        },


        handleItemMouseEnter(event) {
            const item = event.currentTarget;
            if (!item || item.hasAttribute('disabled') || item.getAttribute('aria-disabled') === 'true') return;
            item.dataset.highlighted = '';
            item.focus();
            window.dispatchEvent(new CustomEvent('menubar-close-submenus', {
                detail: { hoveredItemId: item.id },
            }));
        },

        handleItemMouseLeave(event) {
            const item = event.currentTarget;
            if (!item) return;
            delete item.dataset.highlighted;
            if (document.activeElement === item) {
                item.blur();
            }
        },

        handleItemClick(event) {
            const item = event.currentTarget;
            if (item.hasAttribute('disabled') || item.getAttribute('aria-disabled') === 'true') return;
            if (item.getAttribute('aria-haspopup') === 'menu') return;
            this.closeMenus();
            this.currentTrigger?.focus();
        },

        toggleCheckboxItem(event) {
            const item = event.currentTarget;
            const checked = item.getAttribute('data-state') === 'checked';
            item.setAttribute('data-state', checked ? 'unchecked' : 'checked');
            item.setAttribute('aria-checked', checked ? 'false' : 'true');
        },

        selectRadioItem(event) {
            const item = event.currentTarget;
            const group = item.getAttribute('data-radio-group');
            if (!group) return;
            const allItems = this.$el.querySelectorAll(`[data-radio-group="${group}"][role="menuitemradio"]`);
            allItems.forEach((candidate) => {
                candidate.setAttribute('data-state', 'unchecked');
                candidate.setAttribute('aria-checked', 'false');
            });
            item.setAttribute('data-state', 'checked');
            item.setAttribute('aria-checked', 'true');
        }
    }));

    Alpine.data('rzMenubarSubmenu', () => ({
        open: false,
        persistOpenUntilOutsideClick: false,
        ariaExpanded: 'false',
        menuItems: [],
        focusedIndex: null,

        init() {
            this.$watch('open', (value) => {
                this.ariaExpanded = value ? 'true' : 'false';
                this.$nextTick(() => {
                    this.menuItems = Array.from(this.$el.querySelectorAll('[role^="menuitem"]'));
                });
            });
        },

        openSubmenu() {
            this.persistOpenUntilOutsideClick = false;
            this.open = true;
        },

        closeSubmenu() {
            this.open = false;
            this.focusedIndex = null;
            this.persistOpenUntilOutsideClick = false;
        },

        toggleSubmenu() {
            this.persistOpenUntilOutsideClick = false;
            this.open = !this.open;
        },

        openSubmenuAndFocusFirst() {
            this.persistOpenUntilOutsideClick = false;
            this.open = true;
            this.$nextTick(() => {
                this.focusedIndex = 0;
                this.menuItems[0]?.focus();
            });
        },

        handleSubRootMouseEnter() {
            if (!this.open) return;
            this.persistOpenUntilOutsideClick = true;
        },

        handleSubOutsidePointerDown() {
            this.closeSubmenu();
        },

        handleParentItemHover(event) {
            if (!this.open) return;
            const hoveredItemId = event.detail?.hoveredItemId;
            const hoveredItem = hoveredItemId ? document.getElementById(hoveredItemId) : null;

            if (hoveredItem && this.$el.contains(hoveredItem)) return;
            if (this.persistOpenUntilOutsideClick) return;

            this.closeSubmenu();
        },

        forceCloseSubmenu() {
            this.closeSubmenu();
        },

        focusNextItem() {
            if (!this.menuItems.length) return;
            this.focusedIndex = this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1 ? 0 : this.focusedIndex + 1;
            this.menuItems[this.focusedIndex]?.focus();
        },

        focusPreviousItem() {
            if (!this.menuItems.length) return;
            this.focusedIndex = this.focusedIndex === null || this.focusedIndex <= 0 ? this.menuItems.length - 1 : this.focusedIndex - 1;
            this.menuItems[this.focusedIndex]?.focus();
        }
    }));
}
