import { c as computePosition, o as offset, f as flip, s as shift } from "./floating-ui.dom-YtTtsTrt.js";
function rzDropdownMenu() {
  return {
    // --- STATE ---
    open: false,
    isModal: true,
    ariaExpanded: "false",
    trapActive: false,
    focusedIndex: null,
    menuItems: [],
    parentEl: null,
    triggerEl: null,
    contentEl: null,
    // Will be populated when menu opens
    anchor: "bottom",
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
      this.anchor = this.$el.dataset.anchor || "bottom";
      this.pixelOffset = parseInt(this.$el.dataset.offset) || 6;
      this.isModal = this.$el.dataset.modal !== "false";
      this.$watch("open", (value) => {
        if (value) {
          this._lastNavAt = 0;
          this.$nextTick(() => {
            this.contentEl = document.getElementById(`${this.selfId}-content`);
            if (!this.contentEl) return;
            this.updatePosition();
            this.menuItems = Array.from(
              this.contentEl.querySelectorAll(
                '[role^="menuitem"]:not([disabled],[aria-disabled="true"])'
              )
            );
          });
          this.ariaExpanded = "true";
          this.triggerEl.dataset.state = "open";
          this.trapActive = this.isModal;
        } else {
          this.focusedIndex = null;
          this.closeAllSubmenus();
          this.ariaExpanded = "false";
          delete this.triggerEl.dataset.state;
          this.trapActive = false;
          this.contentEl = null;
        }
      });
    },
    // --- METHODS ---
    updatePosition() {
      if (!this.triggerEl || !this.contentEl) return;
      this.contentEl.style.setProperty("--rizzy-dropdown-trigger-width", `${this.triggerEl.offsetWidth}px`);
      computePosition(this.triggerEl, this.contentEl, {
        placement: this.anchor,
        middleware: [offset(this.pixelOffset), flip(), shift({ padding: 8 })]
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
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
        this.open = true;
        this.$nextTick(() => {
          if (event.key === "ArrowUp") this.focusLastItem();
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
      this.focusedIndex = this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1 ? 0 : this.focusedIndex + 1;
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
      this.focusedIndex = this.focusedIndex === null || this.focusedIndex <= 0 ? this.menuItems.length - 1 : this.focusedIndex - 1;
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
      if (!item || item.getAttribute("aria-disabled") === "true" || item.hasAttribute("disabled")) return;
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
      if (item.getAttribute("aria-disabled") === "true" || item.hasAttribute("disabled")) return;
      if (item.getAttribute("aria-haspopup") === "menu") {
        window.Alpine.$data(item.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
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
      if (item.getAttribute("aria-haspopup") !== "menu") {
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
      const roots = document.querySelectorAll(
        `[x-data^="rzDropdownSubmenu"][data-parent-id="${this.selfId}"]`
      );
      roots.forEach((el) => window.Alpine.$data(el)?.closeSubmenu?.());
      this.isSubmenuActive = false;
    }
  };
}
function rzDropdownSubmenu() {
  return {
    // --- STATE ---
    open: false,
    ariaExpanded: "false",
    parentDropdown: null,
    triggerEl: null,
    contentEl: null,
    // Will be populated when submenu opens
    menuItems: [],
    focusedIndex: null,
    anchor: "right-start",
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
          this.parentDropdown = window.Alpine.$data(parentEl);
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
      this.$watch("open", (value) => {
        if (value) {
          this._lastNavAt = 0;
          this.parentDropdown.isSubmenuActive = true;
          this.$nextTick(() => {
            this.contentEl = document.getElementById(`${this.selfId}-subcontent`);
            if (!this.contentEl) return;
            this.updatePosition(this.contentEl);
            this.menuItems = Array.from(this.contentEl.querySelectorAll('[role^="menuitem"]:not([disabled], [aria-disabled="true"])'));
          });
          this.ariaExpanded = "true";
          this.triggerEl.dataset.state = "open";
        } else {
          this.focusedIndex = null;
          this.ariaExpanded = "false";
          delete this.triggerEl.dataset.state;
          this.$nextTick(() => {
            const roots = document.querySelectorAll(
              `[x-data^="rzDropdownSubmenu"][data-parent-id="${this.parentDropdown.selfId}"]`
            );
            const anyOpen = Array.from(roots).some((el) => window.Alpine.$data(el)?.open);
            if (!anyOpen) this.parentDropdown.isSubmenuActive = false;
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
        middleware: [offset(this.pixelOffset), flip(), shift({ padding: 8 })]
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
        const isAnyChildOpen = Array.from(childSubmenus).some((el) => window.Alpine.$data(el)?.open);
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
      childSubmenus?.forEach((el) => {
        window.Alpine.$data(el)?.closeSubmenu();
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
        (el) => el.hasAttribute("x-data") && el.getAttribute("x-data").startsWith("rzDropdownSubmenu") && el.id !== this.selfId
      );
      siblings.forEach((el) => {
        window.Alpine.$data(el)?.closeSubmenu();
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
      if (["ArrowRight", "Enter", " "].includes(e.key)) {
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
      this.focusedIndex = this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1 ? 0 : this.focusedIndex + 1;
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
      this.focusedIndex = this.focusedIndex === null || this.focusedIndex <= 0 ? this.menuItems.length - 1 : this.focusedIndex - 1;
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
      if (item.getAttribute("aria-disabled") === "true" || item.hasAttribute("disabled")) return;
      if (item.getAttribute("aria-haspopup") === "menu") {
        window.Alpine.$data(item.closest('[x-data^="rzDropdownSubmenu"]'))?.toggleSubmenu();
        return;
      }
      clearTimeout(this.closeTimeout);
      this.closeSubmenu();
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
      if (item.getAttribute("aria-disabled") === "true" || item.hasAttribute("disabled")) return;
      const index = this.menuItems.indexOf(item);
      if (index !== -1) {
        this.focusedIndex = index;
        item.focus();
      }
      if (item.getAttribute("aria-haspopup") === "menu") {
        window.Alpine.$data(item.closest('[x-data^="rzDropdownSubmenu"]'))?.openSubmenu();
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
  };
}
function rzMenubar() {
  return {
    currentMenuValue: "",
    currentTrigger: null,
    openPath: [],
    closeTimer: null,
    closeDelayMs: 220,
    init() {
      this.onDocumentPointerDown = this.handleDocumentPointerDown.bind(this);
      this.onWindowBlur = this.handleWindowBlur.bind(this);
      this.onDocumentFocusIn = this.handleDocumentFocusIn.bind(this);
      document.addEventListener("pointerdown", this.onDocumentPointerDown, true);
      document.addEventListener("focusin", this.onDocumentFocusIn, true);
      window.addEventListener("blur", this.onWindowBlur);
      this.$watch("currentMenuValue", () => {
        this.$nextTick(() => this.syncSubmenus());
      });
    },
    destroy() {
      document.removeEventListener("pointerdown", this.onDocumentPointerDown, true);
      document.removeEventListener("focusin", this.onDocumentFocusIn, true);
      window.removeEventListener("blur", this.onWindowBlur);
    },
    isMenuOpen() {
      const value = this.$el.dataset.menuContent;
      return this.currentMenuValue !== "" && value === this.currentMenuValue;
    },
    isSubmenuOpen() {
      const ownerId = this.$el.dataset.submenuOwner;
      return !!ownerId && this.openPath.includes(ownerId);
    },
    setTriggerState(trigger, isOpen) {
      if (!trigger) return;
      trigger.dataset.state = isOpen ? "open" : "closed";
      trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
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
          placement: "bottom-start",
          middleware: [offset(4), flip(), shift({ padding: 8 })]
        }).then(({ x, y }) => {
          Object.assign(menuContent.style, { left: `${x}px`, top: `${y}px` });
        });
      });
    },
    closeMenus() {
      this.cancelCloseAll();
      this.currentMenuValue = "";
      this.setTriggerState(this.currentTrigger, false);
      this.currentTrigger = null;
      this.setOpenPath([]);
    },
    getMenuValueFromTrigger(trigger) {
      return trigger?.dataset?.menuValue ?? trigger?.closest("[data-menu-value]")?.dataset?.menuValue ?? "";
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
      if (["Enter", " ", "ArrowDown"].includes(event.key)) {
        this.openMenu(value, trigger);
        event.preventDefault();
        return;
      }
      if (["ArrowRight", "ArrowLeft"].includes(event.key)) {
        const triggers = Array.from(this.$el.querySelectorAll('[data-slot="menubar-trigger"]'));
        const currentIndex = triggers.indexOf(trigger);
        if (currentIndex < 0) return;
        const nextIndex = event.key === "ArrowRight" ? (currentIndex + 1) % triggers.length : (currentIndex - 1 + triggers.length) % triggers.length;
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
      if (event.key === "Escape") {
        this.closeMenus();
        this.currentTrigger?.focus();
      }
      if (event.key === "Tab") {
        this.closeMenus();
      }
    },
    handleItemMouseEnter(event) {
      const item = event.currentTarget;
      if (!item || item.hasAttribute("disabled") || item.getAttribute("aria-disabled") === "true") return;
      item.dataset.highlighted = "";
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
      if (item.hasAttribute("disabled") || item.getAttribute("aria-disabled") === "true") return;
      if (item.getAttribute("aria-haspopup") === "menu") return;
      this.closeMenus();
      this.currentTrigger?.focus();
    },
    toggleCheckboxItem(event) {
      const item = event.currentTarget;
      const checked = item.getAttribute("data-state") === "checked";
      item.setAttribute("data-state", checked ? "unchecked" : "checked");
      item.setAttribute("aria-checked", checked ? "false" : "true");
    },
    selectRadioItem(event) {
      const item = event.currentTarget;
      const group = item.getAttribute("data-radio-group");
      if (!group) return;
      const groupEl = this.$el.closest(`[role="group"][data-radio-group="${group}"]`);
      const allItems = groupEl?.querySelectorAll(`[role="menuitemradio"][data-radio-group="${group}"]`) ?? [];
      allItems.forEach((candidate) => {
        candidate.setAttribute("data-state", "unchecked");
        candidate.setAttribute("aria-checked", "false");
      });
      item.setAttribute("data-state", "checked");
      item.setAttribute("aria-checked", "true");
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
      const openMenuContent = this.currentMenuValue ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) : null;
      const subRoots = openMenuContent?.querySelectorAll('[data-slot="menubar-sub"]') ?? [];
      subRoots.forEach((subRoot) => {
        const trigger = subRoot.querySelector(':scope > [data-slot="menubar-sub-trigger"]');
        const content = subRoot.querySelector(':scope > [data-slot="menubar-sub-content"]');
        const triggerId = trigger?.id;
        const isOpen = !!triggerId && this.openPath.includes(triggerId);
        this.setTriggerState(trigger, isOpen);
        if (content) {
          content.hidden = !isOpen;
          content.style.display = isOpen ? "" : "none";
          content.dataset.state = isOpen ? "open" : "closed";
          if (isOpen && trigger) {
            computePosition(trigger, content, {
              placement: "right-start",
              middleware: [offset(4), flip(), shift({ padding: 8 })]
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
      const openMenuContent = this.currentMenuValue ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) : null;
      if (target instanceof Node && openMenuContent?.contains(target)) return;
      this.closeMenus();
    },
    handleDocumentFocusIn(event) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (this.$el.contains(target)) return;
      const openMenuContent = this.currentMenuValue ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) : null;
      if (openMenuContent?.contains(target)) return;
      this.closeMenus();
    },
    handleWindowBlur() {
      this.closeMenus();
    }
  };
}
function rzNavigationMenu() {
  return {
    activeItemId: null,
    open: false,
    closeTimeout: null,
    prevIndex: null,
    list: null,
    isClosing: false,
    /* ---------- helpers ---------- */
    _triggerIndex(id) {
      if (!this.list) return -1;
      const triggers = Array.from(this.list.querySelectorAll('[x-ref^="trigger_"]'));
      return triggers.findIndex((t) => t.getAttribute("x-ref") === `trigger_${id}`);
    },
    _contentEl(id) {
      return document.getElementById(`${id}-content`);
    },
    /* ---------- lifecycle ---------- */
    init() {
      const contentEls = this.$el.querySelectorAll("[data-popover]");
      contentEls.forEach((el) => {
        el.style.display = "none";
      });
      this.$nextTick(() => {
        this.list = this.$refs.list;
      });
    },
    /* ---------- event handlers (from events with no params) ---------- */
    toggleActive(e) {
      const id = e.currentTarget.getAttribute("x-ref").replace("trigger_", "");
      this.activeItemId === id && this.open ? this.closeMenu() : this.openMenu(id);
    },
    /**
     * Executes the `handleTriggerEnter` operation.
     * @param {any} e Input value for this method.
     * @returns {any} Returns the result of `handleTriggerEnter` when applicable.
     */
    handleTriggerEnter(e) {
      const id = e.currentTarget.getAttribute("x-ref").replace("trigger_", "");
      this.cancelClose();
      if (this.activeItemId !== id && !this.isClosing) {
        requestAnimationFrame(() => this.openMenu(id));
      }
    },
    /**
     * Executes the `handleItemEnter` operation.
     * @param {any} e Input value for this method.
     * @returns {any} Returns the result of `handleItemEnter` when applicable.
     */
    handleItemEnter(e) {
      const item = e.currentTarget;
      if (!item) return;
      this.cancelClose();
      const trigger = item.querySelector('[x-ref^="trigger_"]');
      if (trigger) {
        const id = trigger.getAttribute("x-ref").replace("trigger_", "");
        if (this.activeItemId !== id && !this.isClosing) {
          requestAnimationFrame(() => this.openMenu(id));
        }
      } else {
        if (this.open && !this.isClosing) {
          this.closeMenu();
        }
      }
    },
    /**
     * Executes the `handleContentEnter` operation.
     * @returns {any} Returns the result of `handleContentEnter` when applicable.
     */
    handleContentEnter() {
      this.cancelClose();
    },
    /**
     * Executes the `scheduleClose` operation.
     * @returns {any} Returns the result of `scheduleClose` when applicable.
     */
    scheduleClose() {
      if (this.isClosing || this.closeTimeout) return;
      this.closeTimeout = setTimeout(() => this.closeMenu(), 150);
    },
    /**
     * Executes the `cancelClose` operation.
     * @returns {any} Returns the result of `cancelClose` when applicable.
     */
    cancelClose() {
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
        this.closeTimeout = null;
      }
      this.isClosing = false;
    },
    /* ---------- open / close logic with direct DOM manipulation ---------- */
    openMenu(id) {
      this.cancelClose();
      this.isClosing = false;
      const newIdx = this._triggerIndex(id);
      const dir = newIdx > (this.prevIndex ?? newIdx) ? "end" : "start";
      const isFirstOpen = this.prevIndex === null;
      if (this.open && this.activeItemId && this.activeItemId !== id) {
        const oldTrig = this.$refs[`trigger_${this.activeItemId}`];
        if (oldTrig) delete oldTrig.dataset.state;
        const oldEl = this._contentEl(this.activeItemId);
        if (oldEl) {
          const outgoingDirection = dir === "end" ? "start" : "end";
          oldEl.setAttribute("data-motion", `to-${outgoingDirection}`);
          setTimeout(() => {
            oldEl.style.display = "none";
          }, 150);
        }
      }
      this.activeItemId = id;
      this.open = true;
      this.prevIndex = newIdx;
      const newTrig = this.$refs[`trigger_${id}`];
      const newContentEl = this._contentEl(id);
      if (!newTrig || !newContentEl) return;
      computePosition(newTrig, newContentEl, {
        placement: "bottom-start",
        middleware: [offset(6), flip(), shift({ padding: 8 })]
      }).then(({ x, y }) => {
        Object.assign(newContentEl.style, { left: `${x}px`, top: `${y}px` });
      });
      newContentEl.style.display = "block";
      if (isFirstOpen) {
        newContentEl.setAttribute("data-motion", "fade-in");
      } else {
        newContentEl.setAttribute("data-motion", `from-${dir}`);
      }
      this.$nextTick(() => {
        newTrig.setAttribute("aria-expanded", "true");
        newTrig.dataset.state = "open";
      });
    },
    /**
     * Executes the `closeMenu` operation.
     * @returns {any} Returns the result of `closeMenu` when applicable.
     */
    closeMenu() {
      if (!this.open || this.isClosing) return;
      this.isClosing = true;
      this.cancelClose();
      const activeId = this.activeItemId;
      if (!activeId) {
        this.isClosing = false;
        return;
      }
      const trig = this.$refs[`trigger_${activeId}`];
      if (trig) {
        trig.setAttribute("aria-expanded", "false");
        delete trig.dataset.state;
      }
      const contentEl = this._contentEl(activeId);
      if (contentEl) {
        contentEl.setAttribute("data-motion", "fade-out");
        setTimeout(() => {
          contentEl.style.display = "none";
        }, 150);
      }
      this.open = false;
      this.activeItemId = null;
      this.prevIndex = null;
      setTimeout(() => {
        this.isClosing = false;
      }, 150);
    }
  };
}
export {
  rzDropdownMenu,
  rzDropdownSubmenu,
  rzMenubar,
  rzNavigationMenu
};
//# sourceMappingURL=menu-runtime-lTXFcwok.js.map
