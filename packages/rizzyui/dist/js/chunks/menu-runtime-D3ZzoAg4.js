import { r as isFocusable, t as focusFirst } from "./focusable-BNFX31oP.js";
import { n as registerDismissableLayer } from "./dismissableLayer-Bs5bSSd5.js";
import { a as offset, i as flip, o as shift, r as computePosition } from "./floating-ui.dom-DibK2yqb.js";
//#region src/js/runtime/a11y/rovingFocusGroup.js
var KEY_PREV = new Set(["ArrowLeft", "ArrowUp"]);
var KEY_NEXT = new Set(["ArrowRight", "ArrowDown"]);
/**
* @typedef {'horizontal' | 'vertical' | 'both'} RovingOrientation
* @typedef {'skip' | 'stop'} DisabledItemPolicy
*
* @typedef {Object} RovingFocusGroupOptions
* @property {RovingOrientation} [orientation='horizontal'] Supported arrow key orientation.
* @property {boolean} [loop=true] Wrap focus from end to start (and start to end) when true.
* @property {DisabledItemPolicy} [disabledItemPolicy='skip'] Whether disabled items are skipped or stop movement.
* @property {number} [activeIndex=0] Initial active index.
* @property {(container: Element) => Element[]} [getItems] Optional resolver for group items.
* @property {(item: Element) => boolean} [isItemDisabled] Optional disabled predicate for an item.
*/
function getOwnerDocument(container) {
	return container?.ownerDocument ?? globalThis.document;
}
function isDisabledByDefault(item) {
	if (!item) return true;
	if ("disabled" in item && item.disabled) return true;
	return item.getAttribute?.("aria-disabled") === "true";
}
function clampIndex(index, count) {
	if (count <= 0) return -1;
	return Math.max(0, Math.min(index, count - 1));
}
function resolveInitialIndex(items, startIndex, isItemDisabled) {
	const candidate = clampIndex(startIndex, items.length);
	if (candidate < 0) return -1;
	if (!isItemDisabled(items[candidate])) return candidate;
	for (let i = 0; i < items.length; i += 1) if (!isItemDisabled(items[i])) return i;
	return -1;
}
/**
* Creates a roving tabindex focus manager for a composite widget container.
*
* The group listens on the container for keyboard and pointer interactions,
* maintains a single `tabindex="0"` item, and sets all peers to `tabindex="-1"`.
*
* @param {Element} container Composite widget container that owns roving items.
* @param {RovingFocusGroupOptions} [options] Configuration options.
* @returns {{
*   destroy: () => void,
*   updateItems: () => Element[],
*   setActiveIndex: (index: number, opts?: { focus?: boolean }) => Element | null,
*   setActiveItem: (item: Element, opts?: { focus?: boolean }) => Element | null,
*   getItems: () => Element[],
*   getActiveIndex: () => number,
*   getActiveItem: () => Element | null
* }} Roving focus controller.
*/
function createRovingFocusGroup(container, options = {}) {
	if (!container || typeof container.addEventListener !== "function") throw new Error("createRovingFocusGroup requires a valid container element.");
	const orientation = options.orientation ?? "horizontal";
	const loop = options.loop ?? true;
	const disabledItemPolicy = options.disabledItemPolicy ?? "skip";
	const isItemDisabled = options.isItemDisabled ?? isDisabledByDefault;
	const resolveItems = options.getItems ?? ((root) => Array.from(root.querySelectorAll?.("*") ?? []));
	const doc = getOwnerDocument(container);
	let items = [];
	let activeIndex = -1;
	function getItems() {
		return items.slice();
	}
	function getActiveIndex() {
		return activeIndex;
	}
	function getActiveItem() {
		return activeIndex >= 0 ? items[activeIndex] ?? null : null;
	}
	function applyTabIndexes() {
		items.forEach((item, index) => {
			item.setAttribute?.("tabindex", index === activeIndex ? "0" : "-1");
		});
	}
	function setActiveIndex(index, opts = {}) {
		activeIndex = clampIndex(index, items.length);
		applyTabIndexes();
		const activeItem = getActiveItem();
		if (opts.focus && activeItem && typeof activeItem.focus === "function") activeItem.focus();
		return activeItem;
	}
	function setActiveItem(item, opts = {}) {
		const idx = items.indexOf(item);
		if (idx < 0) return null;
		return setActiveIndex(idx, opts);
	}
	function updateItems() {
		items = resolveItems(container).filter((item) => container.contains?.(item) && (isFocusable(item) || isItemDisabled(item)));
		if (!items.length) {
			activeIndex = -1;
			return [];
		}
		const focusedIndex = items.indexOf(doc?.activeElement ?? null);
		if (focusedIndex >= 0) activeIndex = focusedIndex;
		else activeIndex = resolveInitialIndex(items, activeIndex >= 0 ? activeIndex : options.activeIndex ?? 0, isItemDisabled);
		applyTabIndexes();
		return getItems();
	}
	function isPrevKey(key) {
		if (orientation === "horizontal") return key === "ArrowLeft";
		if (orientation === "vertical") return key === "ArrowUp";
		return KEY_PREV.has(key);
	}
	function isNextKey(key) {
		if (orientation === "horizontal") return key === "ArrowRight";
		if (orientation === "vertical") return key === "ArrowDown";
		return KEY_NEXT.has(key);
	}
	function findNextEnabledIndex(start, step) {
		if (!items.length || activeIndex < 0) return -1;
		let index = start;
		let visited = 0;
		while (visited < items.length) {
			index += step;
			if (index < 0 || index >= items.length) {
				if (!loop) return -1;
				index = index < 0 ? items.length - 1 : 0;
			}
			if (isItemDisabled(items[index])) {
				if (disabledItemPolicy === "stop") return -1;
				visited += 1;
				continue;
			}
			return index;
		}
		return -1;
	}
	function findEdgeEnabledIndex(fromEnd = false) {
		const start = fromEnd ? items.length - 1 : 0;
		const end = fromEnd ? -1 : items.length;
		const step = fromEnd ? -1 : 1;
		for (let i = start; i !== end; i += step) {
			if (!isItemDisabled(items[i])) return i;
			if (disabledItemPolicy === "stop") return -1;
		}
		return -1;
	}
	function handleKeyboard(event) {
		if (!event || !items.length || activeIndex < 0) return;
		const key = event.key;
		let nextIndex = -1;
		if (isPrevKey(key)) nextIndex = findNextEnabledIndex(activeIndex, -1);
		else if (isNextKey(key)) nextIndex = findNextEnabledIndex(activeIndex, 1);
		else if (key === "Home") nextIndex = findEdgeEnabledIndex(false);
		else if (key === "End") nextIndex = findEdgeEnabledIndex(true);
		if (nextIndex >= 0) {
			event.preventDefault?.();
			setActiveIndex(nextIndex, { focus: true });
		}
	}
	function handlePointer(event) {
		const target = event?.target;
		if (!target || !items.length) return;
		const item = items.find((candidate) => candidate === target || candidate.contains?.(target));
		if (!item) return;
		const itemIndex = items.indexOf(item);
		if (itemIndex >= 0 && !isItemDisabled(item)) setActiveIndex(itemIndex, { focus: false });
	}
	container.addEventListener("keydown", handleKeyboard);
	container.addEventListener("pointerdown", handlePointer);
	container.addEventListener("click", handlePointer);
	updateItems();
	return {
		destroy() {
			container.removeEventListener("keydown", handleKeyboard);
			container.removeEventListener("pointerdown", handlePointer);
			container.removeEventListener("click", handlePointer);
		},
		updateItems,
		setActiveIndex,
		setActiveItem,
		getItems,
		getActiveIndex,
		getActiveItem
	};
}
//#endregion
//#region src/js/lib/components/rzDropdownMenu.js
function rzDropdownMenu() {
	/**
	* Manages the state and behavior of the root dropdown menu.
	*/
	return {
		open: false,
		isModal: true,
		ariaExpanded: "false",
		trapActive: false,
		focusedIndex: null,
		menuItems: [],
		parentEl: null,
		triggerEl: null,
		contentEl: null,
		anchor: "bottom",
		pixelOffset: 3,
		isSubmenuActive: false,
		selfId: null,
		_unregisterLayer: null,
		_rovingFocus: null,
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
					this.$nextTick(() => {
						this.contentEl = document.getElementById(`${this.selfId}-content`);
						if (!this.contentEl) return;
						this.updatePosition();
						this.menuItems = this.getEnabledMenuItems();
						this.registerDismissableLayer();
						this.setupRovingFocus();
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
					this.destroyRovingFocus();
					this.unregisterDismissableLayer();
					this.contentEl = null;
				}
			});
		},
		updatePosition() {
			if (!this.triggerEl || !this.contentEl) return;
			this.contentEl.style.setProperty("--rizzy-dropdown-trigger-width", `${this.triggerEl.offsetWidth}px`);
			computePosition(this.triggerEl, this.contentEl, {
				placement: this.anchor,
				middleware: [
					offset(this.pixelOffset),
					flip(),
					shift({ padding: 8 })
				]
			}).then(({ x, y }) => {
				Object.assign(this.contentEl.style, {
					left: `${x}px`,
					top: `${y}px`
				});
			});
		},
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
		handleOutsideClick() {
			if (!this.open) return;
			this.open = false;
			let self = this;
			this.$nextTick(() => self.triggerEl?.focus());
		},
		handleTriggerKeydown(event) {
			if ([
				"Enter",
				" ",
				"ArrowDown",
				"ArrowUp"
			].includes(event.key)) {
				event.preventDefault();
				this.open = true;
				this.$nextTick(() => {
					if (event.key === "ArrowUp") this.focusLastItem();
					else this.focusFirstItem();
				});
			}
		},
		getEnabledMenuItems() {
			if (!this.contentEl) return [];
			return Array.from(this.contentEl.querySelectorAll("[role^=\"menuitem\"]:not([disabled],[aria-disabled=\"true\"])"));
		},
		registerDismissableLayer() {
			this.unregisterDismissableLayer();
			if (!this.contentEl) return;
			this._unregisterLayer = registerDismissableLayer({
				id: this.selfId,
				root: this.contentEl,
				onDismiss: () => {
					this.open = false;
					this.$nextTick(() => this.triggerEl?.focus());
				}
			});
		},
		unregisterDismissableLayer() {
			if (this._unregisterLayer) {
				this._unregisterLayer();
				this._unregisterLayer = null;
			}
		},
		setupRovingFocus() {
			this.destroyRovingFocus();
			if (!this.contentEl) return;
			this._rovingFocus = createRovingFocusGroup(this.contentEl, {
				orientation: "vertical",
				loop: true,
				disabledItemPolicy: "skip",
				getItems: () => this.getEnabledMenuItems()
			});
			this.menuItems = this._rovingFocus.updateItems();
		},
		destroyRovingFocus() {
			if (this._rovingFocus) {
				this._rovingFocus.destroy();
				this._rovingFocus = null;
			}
		},
		focusNextItem() {
			if (!this.menuItems.length) return;
			this.focusedIndex = this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1 ? 0 : this.focusedIndex + 1;
			this.focusCurrentItem();
		},
		focusPreviousItem() {
			if (!this.menuItems.length) return;
			this.focusedIndex = this.focusedIndex === null || this.focusedIndex <= 0 ? this.menuItems.length - 1 : this.focusedIndex - 1;
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
			if (this.focusedIndex !== null && this.menuItems[this.focusedIndex]) this.$nextTick(() => this.menuItems[this.focusedIndex].focus());
		},
		focusSelectedItem(item) {
			if (!item || item.getAttribute("aria-disabled") === "true" || item.hasAttribute("disabled")) return;
			const index = this.menuItems.indexOf(item);
			if (index !== -1) {
				this.focusedIndex = index;
				item.focus();
			}
		},
		handleItemClick(event) {
			const item = event.currentTarget;
			if (item.getAttribute("aria-disabled") === "true" || item.hasAttribute("disabled")) return;
			if (item.getAttribute("aria-haspopup") === "menu") {
				window.Alpine.$data(item.closest("[x-data^=\"rzDropdownSubmenu\"]"))?.toggleSubmenu();
				return;
			}
			this.open = false;
			let self = this;
			this.$nextTick(() => self.triggerEl?.focus());
		},
		handleItemMouseEnter(event) {
			const item = event.currentTarget;
			this.focusSelectedItem(item);
			if (item.getAttribute("aria-haspopup") !== "menu") this.closeAllSubmenus();
		},
		handleWindowEscape() {
			if (this.open) {
				this.open = false;
				let self = this;
				this.$nextTick(() => self.triggerEl?.focus());
			}
		},
		handleContentTabKey() {
			if (this.open) {
				this.open = false;
				let self = this;
				this.$nextTick(() => self.triggerEl?.focus());
			}
		},
		handleTriggerMouseover() {
			let self = this;
			this.$nextTick(() => self.$el.firstElementChild?.focus());
		},
		closeAllSubmenus() {
			document.querySelectorAll(`[x-data^="rzDropdownSubmenu"][data-parent-id="${this.selfId}"]`).forEach((el) => window.Alpine.$data(el)?.closeSubmenu?.());
			this.isSubmenuActive = false;
		}
	};
}
/**
* Manages the state and behavior of a nested submenu.
*/
function rzDropdownSubmenu() {
	return {
		open: false,
		ariaExpanded: "false",
		parentDropdown: null,
		triggerEl: null,
		contentEl: null,
		menuItems: [],
		focusedIndex: null,
		anchor: "right-start",
		pixelOffset: 0,
		selfId: null,
		_unregisterLayer: null,
		_rovingFocus: null,
		siblingContainer: null,
		closeTimeout: null,
		closeDelay: 150,
		init() {
			if (!this.$el.id) this.$el.id = crypto.randomUUID();
			this.selfId = this.$el.id;
			const parentId = this.$el.dataset.parentId;
			if (parentId) {
				const parentEl = document.getElementById(parentId);
				if (parentEl) this.parentDropdown = window.Alpine.$data(parentEl);
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
						this.menuItems = Array.from(this.contentEl.querySelectorAll("[role^=\"menuitem\"]:not([disabled], [aria-disabled=\"true\"])"));
					});
					this.ariaExpanded = "true";
					this.triggerEl.dataset.state = "open";
				} else {
					this.focusedIndex = null;
					this.ariaExpanded = "false";
					delete this.triggerEl.dataset.state;
					this.$nextTick(() => {
						const roots = document.querySelectorAll(`[x-data^="rzDropdownSubmenu"][data-parent-id="${this.parentDropdown.selfId}"]`);
						if (!Array.from(roots).some((el) => window.Alpine.$data(el)?.open)) this.parentDropdown.isSubmenuActive = false;
					});
					this.destroyRovingFocus();
					this.unregisterDismissableLayer();
					this.contentEl = null;
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
					shift({ padding: 8 })
				]
			}).then(({ x, y }) => {
				Object.assign(contentEl.style, {
					left: `${x}px`,
					top: `${y}px`
				});
			});
		},
		handleTriggerMouseEnter() {
			clearTimeout(this.closeTimeout);
			this.triggerEl.focus();
			this.openSubmenu();
		},
		handleTriggerMouseLeave() {
			this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay);
		},
		handleContentMouseEnter() {
			clearTimeout(this.closeTimeout);
		},
		handleContentMouseLeave() {
			const childSubmenus = this.contentEl?.querySelectorAll("[x-data^=\"rzDropdownSubmenu\"]");
			if (childSubmenus) {
				if (Array.from(childSubmenus).some((el) => window.Alpine.$data(el)?.open)) return;
			}
			this.closeTimeout = setTimeout(() => this.closeSubmenu(), this.closeDelay);
		},
		openSubmenu(focusFirst = false) {
			if (this.open) return;
			this.closeSiblingSubmenus();
			this.open = true;
			if (focusFirst) this.$nextTick(() => requestAnimationFrame(() => this.focusFirstItem()));
		},
		closeSubmenu() {
			(this.contentEl?.querySelectorAll("[x-data^=\"rzDropdownSubmenu\"]"))?.forEach((el) => {
				window.Alpine.$data(el)?.closeSubmenu();
			});
			this.open = false;
		},
		closeSiblingSubmenus() {
			if (!this.siblingContainer) return;
			Array.from(this.siblingContainer.children).filter((el) => el.hasAttribute("x-data") && el.getAttribute("x-data").startsWith("rzDropdownSubmenu") && el.id !== this.selfId).forEach((el) => {
				window.Alpine.$data(el)?.closeSubmenu();
			});
		},
		toggleSubmenu() {
			this.open ? this.closeSubmenu() : this.openSubmenu();
		},
		openSubmenuAndFocusFirst() {
			this.openSubmenu(true);
		},
		handleTriggerKeydown(e) {
			if ([
				"ArrowRight",
				"Enter",
				" "
			].includes(e.key)) {
				e.preventDefault();
				this.openSubmenuAndFocusFirst();
			}
		},
		getEnabledMenuItems() {
			if (!this.contentEl) return [];
			return Array.from(this.contentEl.querySelectorAll("[role^=\"menuitem\"]:not([disabled],[aria-disabled=\"true\"])"));
		},
		registerDismissableLayer() {
			this.unregisterDismissableLayer();
			if (!this.contentEl) return;
			this._unregisterLayer = registerDismissableLayer({
				id: this.selfId,
				root: this.contentEl,
				onDismiss: () => {
					this.open = false;
					this.$nextTick(() => this.triggerEl?.focus());
				}
			});
		},
		unregisterDismissableLayer() {
			if (this._unregisterLayer) {
				this._unregisterLayer();
				this._unregisterLayer = null;
			}
		},
		setupRovingFocus() {
			this.destroyRovingFocus();
			if (!this.contentEl) return;
			this._rovingFocus = createRovingFocusGroup(this.contentEl, {
				orientation: "vertical",
				loop: true,
				disabledItemPolicy: "skip",
				getItems: () => this.getEnabledMenuItems()
			});
			this.menuItems = this._rovingFocus.updateItems();
		},
		destroyRovingFocus() {
			if (this._rovingFocus) {
				this._rovingFocus.destroy();
				this._rovingFocus = null;
			}
		},
		focusNextItem() {
			if (!this.menuItems.length) return;
			this.focusedIndex = this.focusedIndex === null || this.focusedIndex >= this.menuItems.length - 1 ? 0 : this.focusedIndex + 1;
			this.focusCurrentItem();
		},
		focusPreviousItem() {
			if (!this.menuItems.length) return;
			this.focusedIndex = this.focusedIndex === null || this.focusedIndex <= 0 ? this.menuItems.length - 1 : this.focusedIndex - 1;
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
			if (this.focusedIndex !== null && this.menuItems[this.focusedIndex]) this.menuItems[this.focusedIndex].focus();
		},
		handleItemClick(event) {
			const item = event.currentTarget;
			if (item.getAttribute("aria-disabled") === "true" || item.hasAttribute("disabled")) return;
			if (item.getAttribute("aria-haspopup") === "menu") {
				window.Alpine.$data(item.closest("[x-data^=\"rzDropdownSubmenu\"]"))?.toggleSubmenu();
				return;
			}
			clearTimeout(this.closeTimeout);
			this.closeSubmenu();
			this.parentDropdown.open = false;
			this.$nextTick(() => this.parentDropdown.triggerEl?.focus());
		},
		handleItemMouseEnter(event) {
			const item = event.currentTarget;
			if (item.getAttribute("aria-disabled") === "true" || item.hasAttribute("disabled")) return;
			const index = this.menuItems.indexOf(item);
			if (index !== -1) {
				this.focusedIndex = index;
				item.focus();
			}
			if (item.getAttribute("aria-haspopup") === "menu") window.Alpine.$data(item.closest("[x-data^=\"rzDropdownSubmenu\"]"))?.openSubmenu();
			else this.closeSiblingSubmenus();
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
	};
}
//#endregion
//#region src/js/lib/components/rzMenubar.js
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
			if (this.currentTrigger && this.currentTrigger !== trigger) this.setTriggerState(this.currentTrigger, false);
			this.currentMenuValue = value;
			this.currentTrigger = trigger;
			this.setTriggerState(trigger, true);
			this.setOpenPath([]);
			this.$nextTick(() => {
				const menuContent = this.$el.querySelector(`[data-menu-content="${value}"]`) ?? document.querySelector(`[data-menu-content="${value}"]`);
				if (!menuContent || !trigger) return;
				computePosition(trigger, menuContent, {
					placement: "bottom-start",
					middleware: [
						offset(4),
						flip(),
						shift({ padding: 8 })
					]
				}).then(({ x, y }) => {
					Object.assign(menuContent.style, {
						left: `${x}px`,
						top: `${y}px`
					});
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
			if (this.currentMenuValue === value) this.closeMenus();
			else this.openMenu(value, trigger);
			event.preventDefault();
		},
		handleTriggerPointerEnter(event) {
			if (!this.currentMenuValue) return;
			const trigger = event.currentTarget;
			const value = this.getMenuValueFromTrigger(trigger);
			if (value && value !== this.currentMenuValue) this.openMenu(value, trigger);
		},
		handleTriggerKeydown(event) {
			const trigger = event.currentTarget;
			const value = this.getMenuValueFromTrigger(trigger);
			if ([
				"Enter",
				" ",
				"ArrowDown"
			].includes(event.key)) {
				this.openMenu(value, trigger);
				event.preventDefault();
				return;
			}
			if (["ArrowRight", "ArrowLeft"].includes(event.key)) {
				const triggers = Array.from(this.$el.querySelectorAll("[data-slot=\"menubar-trigger\"]"));
				const currentIndex = triggers.indexOf(trigger);
				if (currentIndex < 0) return;
				const nextTrigger = triggers[event.key === "ArrowRight" ? (currentIndex + 1) % triggers.length : (currentIndex - 1 + triggers.length) % triggers.length];
				if (!nextTrigger) return;
				nextTrigger.focus();
				if (this.currentMenuValue) this.openMenu(this.getMenuValueFromTrigger(nextTrigger), nextTrigger);
				event.preventDefault();
			}
		},
		handleContentKeydown(event) {
			if (event.key === "Escape") {
				this.closeMenus();
				this.currentTrigger?.focus();
			}
			if (event.key === "Tab") this.closeMenus();
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
			if (document.activeElement === item) item.blur();
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
			(this.$el.closest(`[role="group"][data-radio-group="${group}"]`)?.querySelectorAll(`[role="menuitemradio"][data-radio-group="${group}"]`) ?? []).forEach((candidate) => {
				candidate.setAttribute("data-state", "unchecked");
				candidate.setAttribute("aria-checked", "false");
			});
			item.setAttribute("data-state", "checked");
			item.setAttribute("aria-checked", "true");
		},
		buildPathToSubTrigger(element) {
			const path = [];
			let currentSub = element.closest("[data-slot=\"menubar-sub\"]");
			while (currentSub) {
				const subTrigger = currentSub.querySelector(":scope > [data-slot=\"menubar-sub-trigger\"]");
				if (!subTrigger?.id) break;
				path.unshift(subTrigger.id);
				currentSub = currentSub.parentElement?.closest("[data-slot=\"menubar-sub\"]") ?? null;
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
				(event.currentTarget.closest("[data-slot=\"menubar-sub\"]")?.querySelector("[data-slot=\"menubar-sub-content\"] [role^=\"menuitem\"]"))?.focus();
			});
		},
		focusNextItem(event) {
			const items = Array.from(event.currentTarget.querySelectorAll("[role^=\"menuitem\"]"));
			if (!items.length) return;
			const currentIndex = items.indexOf(document.activeElement);
			items[currentIndex < 0 || currentIndex >= items.length - 1 ? 0 : currentIndex + 1]?.focus();
		},
		focusPreviousItem(event) {
			const items = Array.from(event.currentTarget.querySelectorAll("[role^=\"menuitem\"]"));
			if (!items.length) return;
			const currentIndex = items.indexOf(document.activeElement);
			items[currentIndex <= 0 ? items.length - 1 : currentIndex - 1]?.focus();
		},
		handleSubContentLeftKey(event) {
			const trigger = event.currentTarget.closest("[data-slot=\"menubar-sub\"]")?.querySelector(":scope > [data-slot=\"menubar-sub-trigger\"]");
			if (!trigger) return;
			const path = this.buildPathToSubTrigger(trigger);
			this.setOpenPath(path.slice(0, -1));
			trigger.focus();
		},
		syncSubmenus() {
			((this.currentMenuValue ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) : null)?.querySelectorAll("[data-slot=\"menubar-sub\"]") ?? []).forEach((subRoot) => {
				const trigger = subRoot.querySelector(":scope > [data-slot=\"menubar-sub-trigger\"]");
				const content = subRoot.querySelector(":scope > [data-slot=\"menubar-sub-content\"]");
				const triggerId = trigger?.id;
				const isOpen = !!triggerId && this.openPath.includes(triggerId);
				this.setTriggerState(trigger, isOpen);
				if (content) {
					content.hidden = !isOpen;
					content.style.display = isOpen ? "" : "none";
					content.dataset.state = isOpen ? "open" : "closed";
					if (isOpen && trigger) computePosition(trigger, content, {
						placement: "right-start",
						middleware: [
							offset(4),
							flip(),
							shift({ padding: 8 })
						]
					}).then(({ x, y }) => {
						Object.assign(content.style, {
							left: `${x}px`,
							top: `${y}px`
						});
					});
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
			if ((this.currentMenuValue ? this.$el.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) ?? document.querySelector(`[data-menu-content="${this.currentMenuValue}"]`) : null)?.contains(target)) return;
			this.closeMenus();
		},
		handleWindowBlur() {
			this.closeMenus();
		}
	};
}
//#endregion
//#region src/js/lib/components/rzNavigationMenu.js
function rzNavigationMenu() {
	return {
		activeItemId: null,
		open: false,
		closeTimeout: null,
		prevIndex: null,
		list: null,
		isClosing: false,
		_topLevelItems() {
			if (!this.list) return [];
			return Array.from(this.list.querySelectorAll("[data-slot=\"navigation-menu-item\"]")).filter((item) => item.parentElement === this.list);
		},
		_contentForItem(item) {
			if (!item) return null;
			return Array.from(item.children ?? []).find((child) => child.getAttribute?.("data-slot") === "navigation-menu-content") ?? null;
		},
		_topLevelControlForItem(item) {
			const content = this._contentForItem(item);
			return Array.from(item.querySelectorAll("[data-slot=\"navigation-menu-trigger\"], [data-slot=\"navigation-menu-link\"]")).find((candidate) => !content?.contains(candidate)) ?? null;
		},
		_topLevelControls() {
			return this._topLevelItems().map((item) => this._topLevelControlForItem(item)).filter(Boolean);
		},
		_triggerIndex(id) {
			const content = this._contentEl(id);
			if (!content) return -1;
			const control = this._topLevelControlForItem(content.closest("[data-slot=\"navigation-menu-item\"]"));
			return this._topLevelControls().findIndex((item) => item === control);
		},
		_controlEl(id) {
			return this.$refs[`trigger_${id}`] ?? this._topLevelControlForItem(this._contentEl(id)?.closest("[data-slot=\"navigation-menu-item\"]"));
		},
		_contentEl(id) {
			return document.getElementById(`${id}-content`);
		},
		_isEditableTarget(target) {
			if (!target || target.nodeType !== 1) return false;
			const tagName = target.tagName?.toLowerCase();
			return target.isContentEditable || [
				"input",
				"select",
				"textarea"
			].includes(tagName);
		},
		_contextFromTarget(target) {
			if (!target || !this.list || this._isEditableTarget(target)) return null;
			if (target.closest?.("[data-slot=\"navigation-menu-content\"]")) return null;
			const control = target.closest?.("[data-slot=\"navigation-menu-trigger\"], [data-slot=\"navigation-menu-link\"]");
			if (!control || !this.list.contains(control)) return null;
			const item = this._topLevelItems().find((candidate) => candidate.contains(control));
			if (!item) return null;
			const content = this._contentForItem(item);
			if (content?.contains(control)) return null;
			const controls = this._topLevelControls();
			const index = controls.findIndex((candidate) => candidate === control);
			if (index < 0) return null;
			return {
				control,
				item,
				content,
				controls,
				index
			};
		},
		_focusContent(content) {
			if (!content) return;
			if (focusFirst(content)) return;
			if (!content.hasAttribute("tabindex")) content.setAttribute("tabindex", "-1");
			content.focus?.();
		},
		init() {
			this.$el.querySelectorAll("[data-popover]").forEach((el) => {
				el.style.display = "none";
			});
			this.$nextTick(() => {
				this.list = this.$refs.list;
			});
		},
		toggleActive(e) {
			const id = e.currentTarget.getAttribute("x-ref").replace("trigger_", "");
			this.activeItemId === id && this.open ? this.closeMenu() : this.openMenu(id);
		},
		handleKeydown(e) {
			if (!e || e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "ArrowDown") return;
			const target = e.target ?? document.activeElement;
			const context = this._contextFromTarget(target);
			if (!context) return;
			if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
				e.preventDefault();
				const direction = e.key === "ArrowLeft" ? -1 : 1;
				const nextIndex = (context.index + direction + context.controls.length) % context.controls.length;
				context.controls[nextIndex]?.focus?.();
				return;
			}
			if (!context.content) return;
			const id = context.content.getAttribute("data-item-id");
			if (!id) return;
			e.preventDefault();
			this.openMenu(id);
			this.$nextTick(() => {
				requestAnimationFrame(() => this._focusContent(context.content));
			});
		},
		handleTriggerEnter(e) {
			const id = e.currentTarget.getAttribute("x-ref").replace("trigger_", "");
			this.cancelClose();
			if (this.activeItemId !== id && !this.isClosing) requestAnimationFrame(() => this.openMenu(id));
		},
		handleItemEnter(e) {
			const item = e.currentTarget;
			if (!item) return;
			this.cancelClose();
			const trigger = item.querySelector("[x-ref^=\"trigger_\"]");
			if (trigger) {
				const id = trigger.getAttribute("x-ref").replace("trigger_", "");
				if (this.activeItemId !== id && !this.isClosing) requestAnimationFrame(() => this.openMenu(id));
			} else if (this.open && !this.isClosing) this.closeMenu();
		},
		handleContentEnter() {
			this.cancelClose();
		},
		scheduleClose() {
			if (this.isClosing || this.closeTimeout) return;
			this.closeTimeout = setTimeout(() => this.closeMenu(), 150);
		},
		cancelClose() {
			if (this.closeTimeout) {
				clearTimeout(this.closeTimeout);
				this.closeTimeout = null;
			}
			this.isClosing = false;
		},
		openMenu(id) {
			this.cancelClose();
			this.isClosing = false;
			const newIdx = this._triggerIndex(id);
			const dir = newIdx > (this.prevIndex ?? newIdx) ? "end" : "start";
			const isFirstOpen = this.prevIndex === null;
			if (this.open && this.activeItemId && this.activeItemId !== id) {
				const oldTrig = this.$refs[`trigger_${this.activeItemId}`];
				if (oldTrig) {
					oldTrig.setAttribute("aria-expanded", "false");
					oldTrig.dataset.state = "closed";
				}
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
			const newControl = this._controlEl(id);
			const newContentEl = this._contentEl(id);
			if (!newControl || !newContentEl) return;
			computePosition(newControl, newContentEl, {
				placement: "bottom-start",
				middleware: [
					offset(6),
					flip(),
					shift({ padding: 8 })
				]
			}).then(({ x, y }) => {
				Object.assign(newContentEl.style, {
					left: `${x}px`,
					top: `${y}px`
				});
			});
			newContentEl.style.display = "block";
			if (isFirstOpen) newContentEl.setAttribute("data-motion", "fade-in");
			else newContentEl.setAttribute("data-motion", `from-${dir}`);
			this.$nextTick(() => {
				if (newTrig) {
					newTrig.setAttribute("aria-expanded", "true");
					newTrig.dataset.state = "open";
				}
			});
		},
		closeMenu(e = null) {
			if (!this.open || this.isClosing) return;
			this.isClosing = true;
			this.cancelClose();
			const activeId = this.activeItemId;
			const shouldRestoreFocus = !!(e && e.type === "keydown" && e.key === "Escape");
			if (!activeId) {
				this.isClosing = false;
				return;
			}
			const trig = this.$refs[`trigger_${activeId}`];
			if (trig) {
				trig.setAttribute("aria-expanded", "false");
				trig.dataset.state = "closed";
			}
			const contentEl = this._contentEl(activeId);
			if (contentEl) {
				contentEl.setAttribute("data-motion", "fade-out");
				setTimeout(() => {
					contentEl.style.display = "none";
				}, 150);
			}
			if (shouldRestoreFocus && trig && document.activeElement && contentEl && contentEl.contains(document.activeElement)) trig.focus();
			this.open = false;
			this.activeItemId = null;
			this.prevIndex = null;
			setTimeout(() => {
				this.isClosing = false;
			}, 150);
		}
	};
}
//#endregion
export { rzDropdownMenu, rzDropdownSubmenu, rzMenubar, rzNavigationMenu };

//# sourceMappingURL=menu-runtime-D3ZzoAg4.js.map