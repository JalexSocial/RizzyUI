import { computePosition, offset, flip, shift } from '@floating-ui/dom';

export default function(Alpine) {
    Alpine.data('rzMenubar', () => ({
        currentMenuValue: '',
        currentTrigger: null,
        openPath: [],
        closeTimer: null,
        closeDelayMs: 220,

        init() {
            this.onDocumentPointerDown = this.handleDocumentPointerDown.bind(this);
            this.onWindowBlur = this.handleWindowBlur.bind(this);
            this.onDocumentFocusIn = this.handleDocumentFocusIn.bind(this);

            document.addEventListener('pointerdown', this.onDocumentPointerDown, true);
            document.addEventListener('focusin', this.onDocumentFocusIn, true);
            window.addEventListener('blur', this.onWindowBlur);

            this.$watch('currentMenuValue', () => {
                this.$nextTick(() => this.syncSubmenus());
            });
        },

        destroy() {
            document.removeEventListener('pointerdown', this.onDocumentPointerDown, true);
            document.removeEventListener('focusin', this.onDocumentFocusIn, true);
            window.removeEventListener('blur', this.onWindowBlur);
        },

        isMenuOpen() {
            const value = this.$el.dataset.menuContent;
            return this.currentMenuValue !== '' && value === this.currentMenuValue;
        },

        isSubmenuOpen() {
            const ownerId = this.$el.dataset.submenuOwner;
            return !!ownerId && this.openPath.includes(ownerId);
        },

        setTriggerState(trigger, isOpen) {
            if (!trigger) return;
            trigger.dataset.state = isOpen ? 'open' : 'closed';
            trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        },

        commonPrefixLen(a, b) {
            let i = 0;
            while (i < a.length && i < b.length && a[i] === b[i]) i++;
            return i;
        },

        setOpenPath(newPath) {
            const normalizedPath = Array.isArray(newPath) ? newPath.filter(Boolean) : [];
            const prefix = this.commonPrefixLen(this.openPath, normalizedPath);

            if (prefix !== this.openPath.length || prefix !== normalizedPath.length) {
                this.openPath = normalizedPath;
                this.$nextTick(() => this.syncSubmenus());
            }
        },

        openMenu(value, trigger) {
            if (!value) return;
            this.cancelCloseAll();

            if (this.currentTrigger && this.currentTrigger !== trigger) {
                this.setTriggerState(this.currentTrigger, false);
            }

            this.currentMenuValue = value;
            this.currentTrigger = trigger;
            this.setTriggerState(trigger, true);
            this.setOpenPath([]);

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
            this.cancelCloseAll();
            this.currentMenuValue = '';
            this.setTriggerState(this.currentTrigger, false);
            this.currentTrigger = null;
            this.setOpenPath([]);
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
            if (event.key === 'Tab') {
                this.closeMenus();
            }
        },

        handleItemMouseEnter(event) {
            const item = event.currentTarget;
            if (!item || item.hasAttribute('disabled') || item.getAttribute('aria-disabled') === 'true') return;
            item.dataset.highlighted = '';
            item.focus();

            const itemPath = this.buildPathToSubTrigger(item);
            this.setOpenPath(itemPath);
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
            const groupEl = this.$el.closest(`[role="group"][data-radio-group="${group}"]`);
            const allItems = groupEl?.querySelectorAll(`[role="menuitemradio"][data-radio-group="${group}"]`) ?? [];

            allItems.forEach((candidate) => {
                candidate.setAttribute('data-state', 'unchecked');
                candidate.setAttribute('aria-checked', 'false');
            });
            item.setAttribute('data-state', 'checked');
            item.setAttribute('aria-checked', 'true');
        },

        buildPathToSubTrigger(element) {
            const path = [];
            let currentSub = element.closest('[data-slot="menubar-sub"]');

            while (currentSub) {
                const subTrigger = currentSub.querySelector(':scope > [data-slot="menubar-sub-trigger"]');
                if (!subTrigger?.id) break;
                path.unshift(subTrigger.id);
                currentSub = currentSub.parentElement?.closest('[data-slot="menubar-sub"]') ?? null;
            }

            return path;
        },

        handleSubTriggerPointerEnter(event) {
            if (!this.currentMenuValue) return;
            this.cancelCloseAll();
            const trigger = event.currentTarget;
            const newPath = this.buildPathToSubTrigger(trigger);
            this.setOpenPath(newPath);
        },

        handleSubTriggerClick(event) {
            const trigger = event.currentTarget;
            const newPath = this.buildPathToSubTrigger(trigger);
            const isOpen = this.openPath.length === newPath.length && this.openPath.every((value, index) => value === newPath[index]);
            this.setOpenPath(isOpen ? newPath.slice(0, -1) : newPath);
        },

        handleSubTriggerKeyRight(event) {
            this.handleSubTriggerPointerEnter(event);
            this.$nextTick(() => {
                const subRoot = event.currentTarget.closest('[data-slot="menubar-sub"]');
                const firstItem = subRoot?.querySelector('[data-slot="menubar-sub-content"] [role^="menuitem"]');
                firstItem?.focus();
            });
        },

        focusNextItem(event) {
            const items = Array.from(event.currentTarget.querySelectorAll('[role^="menuitem"]'));
            if (!items.length) return;
            const currentIndex = items.indexOf(document.activeElement);
            const nextIndex = currentIndex < 0 || currentIndex >= items.length - 1 ? 0 : currentIndex + 1;
            items[nextIndex]?.focus();
        },

        focusPreviousItem(event) {
            const items = Array.from(event.currentTarget.querySelectorAll('[role^="menuitem"]'));
            if (!items.length) return;
            const currentIndex = items.indexOf(document.activeElement);
            const nextIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
            items[nextIndex]?.focus();
        },

        handleSubContentLeftKey(event) {
            const subRoot = event.currentTarget.closest('[data-slot="menubar-sub"]');
            const trigger = subRoot?.querySelector(':scope > [data-slot="menubar-sub-trigger"]');
            if (!trigger) return;

            const path = this.buildPathToSubTrigger(trigger);
            this.setOpenPath(path.slice(0, -1));
            trigger.focus();
        },

        syncSubmenus() {
            const openMenuContent = this.currentMenuValue
                ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`)
                : null;

            // Find all submenus within the currently open menu
            const subRoots = openMenuContent?.querySelectorAll('[data-slot="menubar-sub"]') ?? [];

            subRoots.forEach((subRoot) => {
                // We manually find the trigger and content here, so we don't need to pass $el
                const trigger = subRoot.querySelector(':scope > [data-slot="menubar-sub-trigger"]');
                const content = subRoot.querySelector(':scope > [data-slot="menubar-sub-content"]');
                const triggerId = trigger?.id;

                // Calculate open state based on the trigger ID and the current path
                const isOpen = !!triggerId && this.openPath.includes(triggerId);

                this.setTriggerState(trigger, isOpen);

                if (content) {
                    // DIRECTLY toggle visibility. 
                    // This bypasses the need for x-show and works perfectly with CSP.
                    content.style.display = isOpen ? '' : 'none';
                    content.dataset.state = isOpen ? 'open' : 'closed';

                    // Only compute position if open
                    if (isOpen && trigger) {
                        computePosition(trigger, content, {
                            placement: 'right-start',
                            middleware: [offset(4), flip(), shift({ padding: 8 })],
                        }).then(({ x, y }) => {
                            Object.assign(content.style, { left: `${x}px`, top: `${y}px` });
                        });
                    }
                }
            });
        },

        scheduleCloseAll() {
            this.cancelCloseAll();
            this.closeTimer = setTimeout(() => {
                this.closeMenus();
            }, this.closeDelayMs);
        },

        cancelCloseAll() {
            if (this.closeTimer) {
                clearTimeout(this.closeTimer);
                this.closeTimer = null;
            }
        },

        handleDocumentPointerDown(event) {
            const target = event.target;
            if (target instanceof Node && this.$el.contains(target)) return;

            const openMenuContent = this.currentMenuValue
                ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`)
                : null;
            if (target instanceof Node && openMenuContent?.contains(target)) return;

            this.closeMenus();
        },

        handleDocumentFocusIn(event) {
            const target = event.target;
            if (!(target instanceof Node)) return;
            if (this.$el.contains(target)) return;

            const openMenuContent = this.currentMenuValue
                ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`)
                : null;
            if (openMenuContent?.contains(target)) return;

            this.closeMenus();
        },

        handleWindowBlur() {
            this.closeMenus();
        }
    }));
}
