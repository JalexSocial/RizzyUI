import { a as offset, i as flip, n as autoUpdate, o as shift, r as computePosition, t as arrow } from "./floating-ui.dom-X8hpx-Bo.js";
//#region src/js/lib/components/rzPopover.js
function rzPopover() {
	return {
		open: false,
		ariaExpanded: "false",
		dataState: "closed",
		contentStyle: "",
		triggerEl: null,
		contentEl: null,
		_documentClickHandler: null,
		_windowKeydownHandler: null,
		_cleanupAutoUpdate: null,
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
			this.detachGlobalListeners();
		},
		toggle() {
			this.open = !this.open;
		},
		async openPopover() {
			this.triggerEl = this.resolveTriggerElement();
			this.attachGlobalListeners();
			this.contentStyle = this.getInitialContentStyle();
			await this.$nextTick();
			this.contentEl = this.resolveContentElement();
			if (!this.triggerEl || !this.contentEl) return;
			await this.updatePosition();
			this.startAutoUpdate();
		},
		closePopover() {
			this.teardownAutoUpdate();
			this.detachGlobalListeners();
			this.contentEl = null;
		},
		resolveTriggerElement() {
			const directChildTrigger = Array.from(this.$el.children).find((child) => child?.hasAttribute?.("data-trigger"));
			if (directChildTrigger) return directChildTrigger;
			return this.$el.querySelector("[data-trigger]");
		},
		resolveContentElement() {
			const contentId = this.$el.dataset.contentId;
			if (!contentId) return null;
			return document.getElementById(contentId);
		},
		attachGlobalListeners() {
			if (!this._documentClickHandler) {
				this._documentClickHandler = (event) => this.handleDocumentClick(event);
				document.addEventListener("pointerdown", this._documentClickHandler);
			}
			if (!this._windowKeydownHandler) {
				this._windowKeydownHandler = (event) => this.handleWindowKeydown(event);
				window.addEventListener("keydown", this._windowKeydownHandler);
			}
		},
		detachGlobalListeners() {
			if (this._documentClickHandler) {
				document.removeEventListener("pointerdown", this._documentClickHandler);
				this._documentClickHandler = null;
			}
			if (this._windowKeydownHandler) {
				window.removeEventListener("keydown", this._windowKeydownHandler);
				this._windowKeydownHandler = null;
			}
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
		handleDocumentClick(event) {
			if (!this.open) return;
			const target = event.target;
			const clickedInsideTrigger = this.triggerEl?.contains?.(target) ?? false;
			const clickedInsideContent = this.contentEl?.contains?.(target) ?? false;
			if (clickedInsideTrigger || clickedInsideContent) return;
			this.open = false;
			this.$nextTick(() => this.restoreTriggerFocus());
		},
		handleWindowKeydown(event) {
			if (event.key !== "Escape" || !this.open) return;
			this.open = false;
			this.$nextTick(() => this.restoreTriggerFocus());
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
		init() {
			this.readDatasetOptions();
			this.open = this.getBooleanDataset("open", this.getBooleanDataset("defaultOpen", false));
			this.ariaExpanded = this.open.toString();
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
		getBooleanDataset(name, fallbackValue) {
			const value = this.$el.dataset[name];
			if (typeof value === "undefined") return fallbackValue;
			return value === "true";
		},
		getNumberDataset(name, fallbackValue) {
			const value = Number(this.$el.dataset[name]);
			return Number.isFinite(value) ? value : fallbackValue;
		},
		getNullableNumberDataset(name, fallbackValue) {
			const raw = this.$el.dataset[name];
			if (typeof raw === "undefined" || raw === null || raw === "") return fallbackValue;
			const value = Number(raw);
			return Number.isFinite(value) ? value : fallbackValue;
		},
		bindInteractionEvents() {
			if (!this.triggerEl) return;
			this.triggerEl.addEventListener("pointerenter", this.handleTriggerPointerEnter.bind(this));
			this.triggerEl.addEventListener("pointerleave", this.handleTriggerPointerLeave.bind(this));
			this.triggerEl.addEventListener("focus", this.handleTriggerFocus.bind(this));
			this.triggerEl.addEventListener("blur", this.handleTriggerBlur.bind(this));
			this.triggerEl.addEventListener("keydown", this.handleTriggerKeydown.bind(this));
			if (this.contentEl) {
				this.contentEl.addEventListener("pointerenter", this.handleContentPointerEnter.bind(this));
				this.contentEl.addEventListener("pointerleave", this.handleContentPointerLeave.bind(this));
			}
		},
		startAutoUpdate() {
			if (!this.enableAutoUpdate || !this.triggerEl || !this.contentEl) return;
			this.stopAutoUpdate();
			this.cleanupAutoUpdate = autoUpdate(this.triggerEl, this.contentEl, () => {
				this.updatePosition();
			});
		},
		stopAutoUpdate() {
			if (typeof this.cleanupAutoUpdate === "function") {
				this.cleanupAutoUpdate();
				this.cleanupAutoUpdate = null;
			}
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
		handleTriggerPointerEnter() {
			this.queueOpen();
		},
		handleTriggerPointerLeave() {
			this.queueClose();
		},
		handleTriggerFocus() {
			this.queueOpen();
		},
		handleTriggerBlur() {
			this.queueClose();
		},
		handleContentPointerEnter() {
			if (this.disableHoverableContent) return;
			if (this.closeDelayTimer) {
				window.clearTimeout(this.closeDelayTimer);
				this.closeDelayTimer = null;
			}
		},
		handleContentPointerLeave() {
			if (this.disableHoverableContent) return;
			this.queueClose();
		},
		handleTriggerKeydown(event) {
			if (event.key === "Escape") this.handleWindowEscape();
		},
		handleWindowEscape() {
			this.clearTimers();
			this.open = false;
			this.$nextTick(() => this.triggerEl?.focus());
		},
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

//# sourceMappingURL=popover-tooltip-runtime-DigvC58R.js.map