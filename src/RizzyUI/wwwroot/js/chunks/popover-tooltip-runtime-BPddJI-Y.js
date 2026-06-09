import { n as registerDismissableLayer } from "./dismissableLayer-CkErEHcg.js";
import { a as offset, i as flip, n as autoUpdate, o as shift, r as computePosition, t as arrow } from "./floating-ui.dom-kutZ8Pd_.js";
//#region src/js/lib/components/rzPopover.js
function rzPopover() {
	return {
		open: false,
		ariaExpanded: "false",
		dataState: "closed",
		contentStyle: "",
		triggerEl: null,
		contentEl: null,
		_cleanupAutoUpdate: null,
		_unregisterLayer: null,
		init() {
			this.triggerEl = this.resolveTriggerElement();
			this.$watch("open", (value) => {
				this.ariaExpanded = value.toString();
				this.dataState = value ? "open" : "closed";
				if (value) {
					this.openPopover();
					return;
				}
				this.closePopover();
			});
		},
		destroy() {
			this.teardownAutoUpdate();
			this.unregisterLayer();
		},
		toggle() {
			this.open = !this.open;
			if (!this.open) this.$nextTick(() => this.restoreTriggerFocus());
		},
		async openPopover() {
			this.triggerEl = this.resolveTriggerElement();
			this.contentStyle = this.getInitialContentStyle();
			await this.$nextTick();
			this.contentEl = this.resolveContentElement();
			if (!this.triggerEl || !this.contentEl) return;
			this.registerLayer();
			await this.updatePosition();
			this.startAutoUpdate();
			if (this.shouldFocusFirstElementOnOpen()) this.focusFirstInteractiveElement();
		},
		closePopover() {
			this.teardownAutoUpdate();
			this.unregisterLayer();
			this.contentEl = null;
		},
		registerLayer() {
			this.unregisterLayer();
			if (!this.contentEl) return;
			this._unregisterLayer = registerDismissableLayer({
				id: this.$el.id || void 0,
				root: this.contentEl,
				onDismiss: () => {
					this.open = false;
					this.$nextTick(() => this.restoreTriggerFocus());
				}
			});
		},
		unregisterLayer() {
			if (this._unregisterLayer) {
				this._unregisterLayer();
				this._unregisterLayer = null;
			}
		},
		resolveTriggerElement() {
			const directChildTrigger = Array.from(this.$el.children).find((child) => child?.hasAttribute?.("data-trigger"));
			if (directChildTrigger) return directChildTrigger;
			return this.$el.querySelector("[data-trigger]");
		},
		resolveContentElement() {
			const contentId = this.$el.dataset.contentId;
			return contentId ? document.getElementById(contentId) : null;
		},
		shouldFocusFirstElementOnOpen() {
			return this.$el.dataset.focusFirstElementOnOpen === "true";
		},
		focusFirstInteractiveElement() {
			if (!this.contentEl) return;
			const selector = [
				"button:not([disabled])",
				"[href]",
				"input:not([disabled]):not([type=\"hidden\"])",
				"select:not([disabled])",
				"textarea:not([disabled])",
				"[tabindex]:not([tabindex=\"-1\"])"
			].join(",");
			const target = this.contentEl.querySelector(selector);
			if (target && typeof target.focus === "function") target.focus();
		},
		startAutoUpdate() {
			this.teardownAutoUpdate();
			if (!this.triggerEl || !this.contentEl) return;
			this._cleanupAutoUpdate = autoUpdate(this.triggerEl, this.contentEl, () => {
				this.updatePosition();
			});
		},
		teardownAutoUpdate() {
			if (this._cleanupAutoUpdate) {
				this._cleanupAutoUpdate();
				this._cleanupAutoUpdate = null;
			}
		},
		parseNumber(value, fallback = null) {
			if (value === void 0 || value === null || value === "") return fallback;
			const parsed = Number(value);
			return Number.isNaN(parsed) ? fallback : parsed;
		},
		getInitialContentStyle() {
			return `position: ${this.$el.dataset.strategy || "absolute"}; left: 0px; top: 0px; visibility: hidden;`;
		},
		async updatePosition() {
			if (!this.triggerEl || !this.contentEl || !this.open) return;
			const anchor = this.$el.dataset.anchor || "bottom";
			const mainOffset = this.parseNumber(this.$el.dataset.offset, 0);
			const crossAxisOffset = this.parseNumber(this.$el.dataset.crossAxisOffset, 0);
			const alignmentAxisOffset = this.parseNumber(this.$el.dataset.alignmentAxisOffset, null);
			const strategy = this.$el.dataset.strategy || "absolute";
			const enableFlip = this.$el.dataset.enableFlip !== "false";
			const enableShift = this.$el.dataset.enableShift !== "false";
			const shiftPadding = this.parseNumber(this.$el.dataset.shiftPadding, 8);
			const middleware = [offset({
				mainAxis: mainOffset,
				crossAxis: crossAxisOffset,
				alignmentAxis: alignmentAxisOffset
			})];
			if (enableFlip) middleware.push(flip());
			if (enableShift) middleware.push(shift({ padding: shiftPadding }));
			const { x, y } = await computePosition(this.triggerEl, this.contentEl, {
				placement: anchor,
				strategy,
				middleware
			});
			this.contentStyle = `position: ${strategy}; left: ${x}px; top: ${y}px; visibility: visible;`;
		},
		restoreTriggerFocus() {
			if (this.triggerEl?.isConnected) this.triggerEl.focus();
		}
	};
}
//#endregion
//#region src/js/lib/components/rzTooltip.js
function rzTooltip() {
	return {
		open: false,
		ariaExpanded: "false",
		ariaHidden: "true",
		state: "closed",
		side: "top",
		triggerEl: null,
		contentEl: null,
		arrowEl: null,
		openDelayTimer: null,
		closeDelayTimer: null,
		skipDelayTimer: null,
		openDelayDuration: 700,
		skipDelayDuration: 300,
		closeDelayDuration: 0,
		skipDelayActive: false,
		disableHoverableContent: false,
		anchor: "top",
		strategy: "absolute",
		mainOffset: 4,
		crossAxisOffset: 0,
		alignmentAxisOffset: null,
		shiftPadding: 8,
		enableFlip: true,
		enableShift: true,
		enableAutoUpdate: true,
		isControlledOpenState: false,
		cleanupAutoUpdate: null,
		interactionHandlers: null,
		/**
		* Executes the `init` operation.
		* @returns {any} Returns the result of `init` when applicable.
		*/
		init() {
			this.readDatasetOptions();
			this.open = this.getBooleanDataset("open", this.getBooleanDataset("defaultOpen", false));
			this.ariaExpanded = this.open.toString();
			this.ariaHidden = (!this.open).toString();
			this.state = this.open ? "open" : "closed";
			this.triggerEl = this.$refs.trigger || this.$el.querySelector("[data-slot=\"tooltip-trigger\"]");
			this.contentEl = this.$refs.content || this.$el.querySelector("[data-slot=\"tooltip-content\"]");
			this.arrowEl = this.$el.querySelector("[data-slot=\"tooltip-arrow\"]");
			this.bindInteractionEvents();
			this.$watch("open", (value) => {
				const controlledOpen = this.getBooleanDataset("open", value);
				const nextOpen = this.isControlledOpenState ? controlledOpen : value;
				this.open = nextOpen;
				this.ariaExpanded = nextOpen.toString();
				this.ariaHidden = (!nextOpen).toString();
				this.state = nextOpen ? "open" : "closed";
				if (this.triggerEl) this.triggerEl.dataset.state = this.state;
				if (this.contentEl) this.contentEl.dataset.state = this.state;
				if (nextOpen) {
					this.$nextTick(() => {
						this.updatePosition();
						this.startAutoUpdate();
					});
					return;
				}
				this.stopAutoUpdate();
				this.startSkipDelayWindow();
			});
			if (this.open) this.$nextTick(() => {
				this.updatePosition();
				this.startAutoUpdate();
			});
		},
		/**
		* Executes the `readDatasetOptions` operation.
		* @returns {any} Returns the result of `readDatasetOptions` when applicable.
		*/
		readDatasetOptions() {
			this.anchor = this.$el.dataset.anchor || this.anchor;
			this.strategy = this.$el.dataset.strategy || this.strategy;
			this.mainOffset = this.getNumberDataset("offset", this.mainOffset);
			this.crossAxisOffset = this.getNumberDataset("crossAxisOffset", this.crossAxisOffset);
			this.alignmentAxisOffset = this.getNullableNumberDataset("alignmentAxisOffset", this.alignmentAxisOffset);
			this.shiftPadding = this.getNumberDataset("shiftPadding", this.shiftPadding);
			this.openDelayDuration = this.getNumberDataset("delayDuration", this.openDelayDuration);
			this.skipDelayDuration = this.getNumberDataset("skipDelayDuration", this.skipDelayDuration);
			this.closeDelayDuration = this.getNumberDataset("closeDelayDuration", this.closeDelayDuration);
			this.disableHoverableContent = this.getBooleanDataset("disableHoverableContent", this.disableHoverableContent);
			this.enableFlip = this.getBooleanDataset("enableFlip", this.enableFlip);
			this.enableShift = this.getBooleanDataset("enableShift", this.enableShift);
			this.enableAutoUpdate = this.getBooleanDataset("autoUpdate", this.enableAutoUpdate);
			this.isControlledOpenState = this.getBooleanDataset("openControlled", this.isControlledOpenState);
		},
		/**
		* Executes the `getBooleanDataset` operation.
		* @param {any} name Input value for this method.
		* @param {any} fallbackValue Input value for this method.
		* @returns {any} Returns the result of `getBooleanDataset` when applicable.
		*/
		getBooleanDataset(name, fallbackValue) {
			const value = this.$el.dataset[name];
			if (typeof value === "undefined") return fallbackValue;
			return value === "true";
		},
		/**
		* Executes the `getNumberDataset` operation.
		* @param {any} name Input value for this method.
		* @param {any} fallbackValue Input value for this method.
		* @returns {any} Returns the result of `getNumberDataset` when applicable.
		*/
		getNumberDataset(name, fallbackValue) {
			const value = Number(this.$el.dataset[name]);
			return Number.isFinite(value) ? value : fallbackValue;
		},
		/**
		* Executes the `getNullableNumberDataset` operation.
		* @param {any} name Input value for this method.
		* @param {any} fallbackValue Input value for this method.
		* @returns {any} Returns the result of `getNullableNumberDataset` when applicable.
		*/
		getNullableNumberDataset(name, fallbackValue) {
			const raw = this.$el.dataset[name];
			if (typeof raw === "undefined" || raw === null || raw === "") return fallbackValue;
			const value = Number(raw);
			return Number.isFinite(value) ? value : fallbackValue;
		},
		/**
		* Executes the `bindInteractionEvents` operation.
		* @returns {any} Returns the result of `bindInteractionEvents` when applicable.
		*/
		bindInteractionEvents() {
			this.unbindInteractionEvents();
			if (!this.triggerEl) return;
			this.interactionHandlers = {
				triggerPointerEnter: this.handleTriggerPointerEnter.bind(this),
				triggerPointerLeave: this.handleTriggerPointerLeave.bind(this),
				triggerFocus: this.handleTriggerFocus.bind(this),
				triggerBlur: this.handleTriggerBlur.bind(this),
				triggerKeydown: this.handleTriggerKeydown.bind(this),
				contentPointerEnter: this.handleContentPointerEnter.bind(this),
				contentPointerLeave: this.handleContentPointerLeave.bind(this),
				contentKeydown: this.handleContentKeydown.bind(this)
			};
			this.triggerEl.addEventListener("pointerenter", this.interactionHandlers.triggerPointerEnter);
			this.triggerEl.addEventListener("pointerleave", this.interactionHandlers.triggerPointerLeave);
			this.triggerEl.addEventListener("focus", this.interactionHandlers.triggerFocus);
			this.triggerEl.addEventListener("blur", this.interactionHandlers.triggerBlur);
			this.triggerEl.addEventListener("keydown", this.interactionHandlers.triggerKeydown);
			if (this.contentEl) {
				this.contentEl.addEventListener("pointerenter", this.interactionHandlers.contentPointerEnter);
				this.contentEl.addEventListener("pointerleave", this.interactionHandlers.contentPointerLeave);
				this.contentEl.addEventListener("keydown", this.interactionHandlers.contentKeydown);
			}
		},
		/**
		* Removes tooltip interaction listeners registered during initialization.
		* @returns {void}
		*/
		unbindInteractionEvents() {
			if (!this.interactionHandlers) return;
			if (this.triggerEl) {
				this.triggerEl.removeEventListener("pointerenter", this.interactionHandlers.triggerPointerEnter);
				this.triggerEl.removeEventListener("pointerleave", this.interactionHandlers.triggerPointerLeave);
				this.triggerEl.removeEventListener("focus", this.interactionHandlers.triggerFocus);
				this.triggerEl.removeEventListener("blur", this.interactionHandlers.triggerBlur);
				this.triggerEl.removeEventListener("keydown", this.interactionHandlers.triggerKeydown);
			}
			if (this.contentEl) {
				this.contentEl.removeEventListener("pointerenter", this.interactionHandlers.contentPointerEnter);
				this.contentEl.removeEventListener("pointerleave", this.interactionHandlers.contentPointerLeave);
				this.contentEl.removeEventListener("keydown", this.interactionHandlers.contentKeydown);
			}
			this.interactionHandlers = null;
		},
		/**
		* Executes the `startAutoUpdate` operation.
		* @returns {any} Returns the result of `startAutoUpdate` when applicable.
		*/
		startAutoUpdate() {
			if (!this.enableAutoUpdate || !this.triggerEl || !this.contentEl) return;
			this.stopAutoUpdate();
			this.cleanupAutoUpdate = autoUpdate(this.triggerEl, this.contentEl, () => {
				this.updatePosition();
			});
		},
		/**
		* Executes the `stopAutoUpdate` operation.
		* @returns {any} Returns the result of `stopAutoUpdate` when applicable.
		*/
		stopAutoUpdate() {
			if (typeof this.cleanupAutoUpdate === "function") {
				this.cleanupAutoUpdate();
				this.cleanupAutoUpdate = null;
			}
		},
		/**
		* Executes the `clearTimers` operation.
		* @returns {any} Returns the result of `clearTimers` when applicable.
		*/
		destroy() {
			this.clearTimers();
			this.stopAutoUpdate();
			this.unbindInteractionEvents();
		},
		clearTimers() {
			if (this.openDelayTimer) {
				window.clearTimeout(this.openDelayTimer);
				this.openDelayTimer = null;
			}
			if (this.closeDelayTimer) {
				window.clearTimeout(this.closeDelayTimer);
				this.closeDelayTimer = null;
			}
			if (this.skipDelayTimer) {
				window.clearTimeout(this.skipDelayTimer);
				this.skipDelayTimer = null;
			}
		},
		/**
		* Executes the `startSkipDelayWindow` operation.
		* @returns {any} Returns the result of `startSkipDelayWindow` when applicable.
		*/
		startSkipDelayWindow() {
			if (this.skipDelayDuration <= 0) {
				this.skipDelayActive = false;
				return;
			}
			if (this.skipDelayTimer) window.clearTimeout(this.skipDelayTimer);
			this.skipDelayActive = true;
			this.skipDelayTimer = window.setTimeout(() => {
				this.skipDelayActive = false;
				this.skipDelayTimer = null;
			}, this.skipDelayDuration);
		},
		/**
		* Executes the `queueOpen` operation.
		* @returns {any} Returns the result of `queueOpen` when applicable.
		*/
		queueOpen() {
			if (this.open) return;
			if (this.closeDelayTimer) {
				window.clearTimeout(this.closeDelayTimer);
				this.closeDelayTimer = null;
			}
			const delay = this.skipDelayActive ? 0 : this.openDelayDuration;
			if (delay <= 0) {
				this.open = true;
				return;
			}
			if (this.openDelayTimer) window.clearTimeout(this.openDelayTimer);
			this.openDelayTimer = window.setTimeout(() => {
				this.open = true;
				this.openDelayTimer = null;
			}, delay);
		},
		/**
		* Executes the `queueClose` operation.
		* @returns {any} Returns the result of `queueClose` when applicable.
		*/
		queueClose() {
			if (!this.open && !this.openDelayTimer) return;
			if (this.openDelayTimer) {
				window.clearTimeout(this.openDelayTimer);
				this.openDelayTimer = null;
			}
			if (this.closeDelayDuration <= 0) {
				this.open = false;
				return;
			}
			if (this.closeDelayTimer) window.clearTimeout(this.closeDelayTimer);
			this.closeDelayTimer = window.setTimeout(() => {
				this.open = false;
				this.closeDelayTimer = null;
			}, this.closeDelayDuration);
		},
		/**
		* Executes the `handleTriggerPointerEnter` operation.
		* @returns {any} Returns the result of `handleTriggerPointerEnter` when applicable.
		*/
		handleTriggerPointerEnter() {
			this.queueOpen();
		},
		/**
		* Executes the `handleTriggerPointerLeave` operation.
		* @returns {any} Returns the result of `handleTriggerPointerLeave` when applicable.
		*/
		handleTriggerPointerLeave() {
			this.queueClose();
		},
		/**
		* Executes the `handleTriggerFocus` operation.
		* @returns {any} Returns the result of `handleTriggerFocus` when applicable.
		*/
		handleTriggerFocus() {
			this.queueOpen();
		},
		/**
		* Executes the `handleTriggerBlur` operation.
		* @returns {any} Returns the result of `handleTriggerBlur` when applicable.
		*/
		handleTriggerBlur() {
			this.queueClose();
		},
		/**
		* Executes the `handleContentPointerEnter` operation.
		* @returns {any} Returns the result of `handleContentPointerEnter` when applicable.
		*/
		handleContentPointerEnter() {
			if (this.disableHoverableContent) return;
			if (this.closeDelayTimer) {
				window.clearTimeout(this.closeDelayTimer);
				this.closeDelayTimer = null;
			}
		},
		/**
		* Executes the `handleContentPointerLeave` operation.
		* @returns {any} Returns the result of `handleContentPointerLeave` when applicable.
		*/
		handleContentPointerLeave() {
			if (this.disableHoverableContent) return;
			this.queueClose();
		},
		/**
		* Executes the `handleTriggerKeydown` operation.
		* @param {any} event Input value for this method.
		* @returns {any} Returns the result of `handleTriggerKeydown` when applicable.
		*/
		handleTriggerKeydown(event) {
			if (event.key === "Escape") {
				event.preventDefault?.();
				this.handleWindowEscape();
			}
		},
		/**
		* Executes the `handleContentKeydown` operation.
		* @param {any} event Input value for this method.
		* @returns {any} Returns the result of `handleContentKeydown` when applicable.
		*/
		handleContentKeydown(event) {
			if (event.key === "Escape") {
				event.preventDefault?.();
				this.handleWindowEscape();
			}
		},
		/**
		* Executes the `handleWindowEscape` operation.
		* @returns {any} Returns the result of `handleWindowEscape` when applicable.
		*/
		handleWindowEscape() {
			this.clearTimers();
			this.open = false;
			this.$nextTick(() => this.triggerEl?.focus());
		},
		/**
		* Executes the `updatePosition` operation.
		* @returns {any} Returns the result of `updatePosition` when applicable.
		*/
		updatePosition() {
			if (!this.triggerEl || !this.contentEl) return;
			const middleware = [offset({
				mainAxis: this.mainOffset,
				crossAxis: this.crossAxisOffset,
				alignmentAxis: this.alignmentAxisOffset
			})];
			if (this.enableFlip) middleware.push(flip());
			if (this.enableShift) middleware.push(shift({ padding: this.shiftPadding }));
			if (this.arrowEl) middleware.push(arrow({ element: this.arrowEl }));
			computePosition(this.triggerEl, this.contentEl, {
				placement: this.anchor,
				strategy: this.strategy,
				middleware
			}).then(({ x, y, placement, middlewareData }) => {
				this.side = placement.split("-")[0];
				this.contentEl.dataset.side = this.side;
				this.contentEl.style.position = this.strategy;
				this.contentEl.style.left = `${x}px`;
				this.contentEl.style.top = `${y}px`;
				if (!this.arrowEl || !middlewareData.arrow) return;
				const arrowX = middlewareData.arrow.x;
				const arrowY = middlewareData.arrow.y;
				const staticSide = {
					top: "bottom",
					right: "left",
					bottom: "top",
					left: "right"
				}[this.side] || "bottom";
				this.arrowEl.style.left = arrowX != null ? `${arrowX}px` : "";
				this.arrowEl.style.top = arrowY != null ? `${arrowY}px` : "";
				this.arrowEl.style.right = "";
				this.arrowEl.style.bottom = "";
				this.arrowEl.style[staticSide] = "-5px";
			});
		}
	};
}
//#endregion
export { rzPopover, rzTooltip };

//# sourceMappingURL=popover-tooltip-runtime-BPddJI-Y.js.map