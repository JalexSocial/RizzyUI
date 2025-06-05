// packages/rizzyui/src/js/lib/components/rzDropdownMenu.js
import { computePosition, offset, flip, shift } from '@floating-ui/dom';

export default function (Alpine) {
    Alpine.data('rzDropdownMenu', () => ({
        /* ------------------------------------------------------------------
           Reactive state (all plain keys – no getters / computed properties)
        ------------------------------------------------------------------ */
        open: false,
        isModal: true,
        ariaExpanded: 'false', // <- string, so we can bind directly
        trapActive: false, // <- boolean for x-trap / inert
        focusedIndex: null,
        menuItems: [],
        parentEl: null,
        triggerEl: null,
        contentEl: null,
        anchor: 'bottom',
        pixelOffset: 3,
        activeSubmenu: null,
        isSubmenuActive: false,
        navThrottle: 100, // delay between moves
        _lastNavAt: 0, // internal time‑stamp, updated after every move
        activeSubmenuId: null,
        selfId: null,

        /* ------------------------------ lifecycle ------------------------------ */
        init() {
            // give the element a stable id if it doesn't already have one
            if (!this.$el.id) this.$el.id = crypto.randomUUID();
            this.selfId = this.$el.id;
            this.parentEl = this.$el;
            this.triggerEl = this.$refs.trigger;
            this.contentEl = this.$refs.content;
            this.anchor = this.$el.dataset.anchor || 'bottom';
            this.pixelOffset = parseInt(this.$el.dataset.offset) || 6;
            this.isModal = this.$el.dataset.modal !== 'false'; // default true

            this.$watch('open', value => {
                if (value) {
                    this._lastNavAt = 0; // clear throttle so the first press is immediate

                    this.$nextTick(() => {
                        this.updatePosition();
                        this.menuItems = Array.from(
                            this.contentEl.querySelectorAll('[role^="menuitem"]:not([disabled],[aria-disabled="true"])')
                        );
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

        /* --------------------------- positioning --------------------------- */
        updatePosition() {
            if (!this.triggerEl || !this.contentEl) return;
            computePosition(this.triggerEl, this.contentEl, {
                placement: this.anchor,
                middleware: [offset(this.pixelOffset), flip(), shift({ padding: 8 })]
            }).then(({ x, y }) => {
                Object.assign(this.contentEl.style, {
                    left: `${x}px`,
                    top: `${y}px`
                });
            });
        },

        /* -------------------------- open / close -------------------------- */
        toggle() {
            if (this.open) {
                this.closeAllSubmenus();
                this.open = false;
                this.$nextTick(() => this.triggerEl?.focus());
            } else {
                this.open = true;
                this.focusedIndex = -1;
            }
        },

        handleOutsideClick() {
            if (!this.open) return;
            this.closeAllSubmenus();
            this.open = false;
            this.$nextTick(() => this.triggerEl?.focus());
        },

        /* ------------------------- keyboard support ------------------------ */
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

        /* -------- generic focus navigation for the root dropdown ---------- */
        focusNextItem() {
            const now = Date.now();
            if (now - this._lastNavAt < this.navThrottle) return;
            this._lastNavAt = now;
            if (!this.menuItems.length) return;
            this.focusedIndex =
                this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1
                    ? 0
                    : this.focusedIndex + 1;
            this.focusCurrentItem();
        },
        focusPreviousItem() {
            const now = Date.now();
            if (now - this._lastNavAt < this.navThrottle) return;
            this._lastNavAt = now;
            if (!this.menuItems.length) return;
            this.focusedIndex =
                this.focusedIndex === null || this.focusedIndex <= 0
                    ? this.menuItems.length - 1
                    : this.focusedIndex - 1;
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
        focusSelectedItem(item, { keepSubmenusOpen = false } = {}) {
            if (!item || item.getAttribute('aria-disabled') === 'true' || item.hasAttribute('disabled')) return;
            const index = this.menuItems.indexOf(item);
            if (index !== -1 && this.focusedIndex !== index) {
                if (!keepSubmenusOpen) this.closeAllSubmenus();
                this.focusedIndex = index;
                this.$nextTick(() => this.menuItems[this.focusedIndex].focus());
            }
        },

        /* ---------------------------- item click --------------------------- */
        handleItemClick(event) {
            const item = event.currentTarget;
            if (item.getAttribute('aria-disabled') === 'true' || item.hasAttribute('disabled')) return;

            // submenu trigger – delegate
            if (item.getAttribute('aria-haspopup') === 'menu') {
                Alpine.$data(item.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
                return;
            }

            // leaf item → close everything
            this.open = false;
            this.$nextTick(() => this.triggerEl?.focus());
        },
        handleItemMousemove(event) {
            this.focusSelectedItem(event.currentTarget);
        },

        /* -------------------------- global key‑outs ------------------------ */
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

        /* ---------------------- submenu book‑keeping ---------------------- */
        closeAllSubmenus(exceptId = null) {
            if (!this.isSubmenuActive) return;

            // don’t close ancestors of the submenu we’re about to open
            const exceptEl = exceptId ? document.getElementById(exceptId) : null;

            const submenus = this.parentEl.querySelectorAll('[x-data^="rzDropdownSubmenu"]');
            submenus.forEach(el => {
                if (exceptEl && el.contains(exceptEl)) return; // keep ancestor chain alive

                const api = Alpine.$data(el);
                if (api && api.open && api.selfId !== exceptId) {
                    api.closeSubmenu();
                }
            });

            const anyOpen = Array.from(submenus).some(el => Alpine.$data(el)?.open);
            this.isSubmenuActive = anyOpen;
            if (!anyOpen) this.activeSubmenuId = null;
        },

        setActiveSubmenu(submenuApi) {
            if (this.activeSubmenuId && this.activeSubmenuId !== submenuApi.selfId) {
                const prev = document.getElementById(this.activeSubmenuId);
                // don’t close if the previous submenu is an ancestor of the new one
                if (!prev || !prev.contains(document.getElementById(submenuApi.selfId))) {
                    Alpine.$data(prev)?.closeSubmenu();
                }
            }
            this.activeSubmenuId = submenuApi.selfId;
            this.isSubmenuActive = true;
        }
    }));

    /* =========================  Sub‑menu component  ========================= */
    Alpine.data('rzDropdownSubmenu', () => ({
        open: false,
        ariaExpanded: 'false',
        parentDropdown: null,
        triggerEl: null,
        menuItems: [],
        focusedIndex: null,
        anchor: 'right-start',
        pixelOffset: 0,
        navThrottle: 100,
        _lastNavAt: 0,
        selfId: null,

        /* -- lifecycle -- */
        init() {
            if (!this.$el.id) this.$el.id = crypto.randomUUID();
            this.selfId = this.$el.id;
            this.parentDropdown = Alpine.$data(this.$el.closest('[x-data^="rzDropdownMenu"]'));
            this.triggerEl = this.$refs.subTrigger;
            this.anchor = this.$el.dataset.subAnchor || this.anchor;
            this.pixelOffset = parseInt(this.$el.dataset.subOffset) || this.pixelOffset;

            this.$watch('open', value => {
                if (value) {
                    this._lastNavAt = 0;
                    this.parentDropdown?.setActiveSubmenu(this);
                    this.$nextTick(() => {
                        const contentEl = this.$refs.subContent;
                        this.updatePosition(contentEl);
                        this.menuItems = Array.from(
                            contentEl.querySelectorAll('[role^="menuitem"]:not([disabled],[aria-disabled="true"])')
                        );
                    });
                    this.ariaExpanded = 'true';
                    this.triggerEl.dataset.state = 'open';
                } else {
                    this.focusedIndex = null;
                    if (this.parentDropdown?.activeSubmenu === this) {
                        this.parentDropdown.activeSubmenu = null;
                    }
                    this.ariaExpanded = 'false';
                    delete this.triggerEl.dataset.state;
                }
            });
        },

        /* -- positioning -- */
        updatePosition(contentEl) {
            if (!this.triggerEl || !contentEl) return;
            computePosition(this.triggerEl, contentEl, {
                placement: this.anchor,
                middleware: [offset(this.pixelOffset), flip(), shift({ padding: 8 })]
            }).then(({ x, y }) => {
                Object.assign(contentEl.style, {
                    left: `${x}px`,
                    top: `${y}px`
                });
            });
        },

        /* -- open / close -- */
        toggleSubmenu() {
            this.open = !this.open;
            if (this.open) {
                this.parentDropdown?.closeAllSubmenus(this.selfId);
                this.parentDropdown?.setActiveSubmenu(this);
                this.focusedIndex = -1;
            }
        },
        openSubmenu(isOpen = true, focusFirst = false) {
            if (isOpen && !this.open) {
                this.parentDropdown?.focusSelectedItem(this.triggerEl, { keepSubmenusOpen: true });
                this.parentDropdown?.closeAllSubmenus(this.selfId);
                this.open = true;
                this.$nextTick(() =>
                    requestAnimationFrame(() => {
                        if (focusFirst && this.menuItems.length) {
                            this.focusedIndex = 0;
                            this.menuItems[0].focus();
                        }
                    })
                );
            }
        },
        openSubmenuAndFocusFirst() {
            this.openSubmenu(true, true);
        },
        closeSubmenu() {
            this.open = false;
        },

        /* -- trigger events -- */
        handleTriggerKeydown(e) {
            if (['ArrowRight', 'Enter', ' '].includes(e.key)) {
                this.openSubmenuAndFocusFirst();
            }
        },
        handleTriggerClick() {
            this.toggleSubmenu();
        },

        /* -- focus containment -- */
        handleFocusOut(e) {
            const next = e.relatedTarget;
            if (!next) return; // focus left the document
            if (this.$el.contains(next) || this.$refs.subContent?.contains(next)) return; // stayed inside
            this.open = false;
        },

        /* -- intra‑panel navigation -- */
        focusNextItem() {
            const now = Date.now();
            if (now - this._lastNavAt < this.navThrottle) return;
            this._lastNavAt = now;
            if (!this.menuItems.length) return;
            this.focusedIndex =
                this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1
                    ? 0
                    : this.focusedIndex + 1;
            this.focusCurrentItem();
        },
        focusPreviousItem() {
            const now = Date.now();
            if (now - this._lastNavAt < this.navThrottle) return;
            this._lastNavAt = now;
            if (!this.menuItems.length) return;
            this.focusedIndex =
                this.focusedIndex === null || this.focusedIndex <= 0
                    ? this.menuItems.length - 1
                    : this.focusedIndex - 1;
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

        /* -- item interactions -- */
        handleItemClick(event) {
            const item = event.currentTarget;
            if (item.getAttribute('aria-disabled') === 'true' || item.hasAttribute('disabled')) return;

            if (item === this.triggerEl) {
                this.toggleSubmenu();
                return;
            }
            this.open = false;
            this.parentDropdown.open = false;
            this.$nextTick(() => this.parentDropdown.triggerEl?.focus());
        },
        handleItemMousemove(event) {
            const item = event.currentTarget;
            if (item.getAttribute('aria-disabled') === 'true' || item.hasAttribute('disabled')) return;
            const index = this.menuItems.indexOf(item);
            if (index !== -1 && this.focusedIndex !== index) {
                this.focusedIndex = index;
            }
        },

        /* -- escape routes -- */
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
