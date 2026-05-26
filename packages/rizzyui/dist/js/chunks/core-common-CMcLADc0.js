//#region src/js/lib/components/accordionItem.js
function accordionItem() {
	return {
		open: false,
		sectionId: "",
		expandedClass: "",
		init() {
			this.open = this.$el.dataset.isOpen === "true";
			this.sectionId = this.$el.dataset.sectionId;
			this.expandedClass = this.$el.dataset.expandedClass;
			const self = this;
			if (typeof this.selected !== "undefined" && typeof this.allowMultiple !== "undefined") this.$watch("selected", (value, oldValue) => {
				if (value !== self.sectionId && !self.allowMultiple) self.open = false;
			});
			else console.warn("accordionItem: Could not find 'selected' or 'allowMultiple' in parent scope for $watch.");
		},
		destroy() {},
		toggle() {
			this.selected = this.sectionId;
			this.open = !this.open;
		},
		getExpandedCss() {
			return this.open ? this.expandedClass : "";
		},
		getAriaExpanded() {
			return this.open ? "true" : "false";
		}
	};
}
//#endregion
//#region src/js/lib/components/rzAccordion.js
function rzAccordion() {
	return {
		selected: "",
		allowMultiple: false,
		init() {
			this.allowMultiple = this.$el.dataset.multiple === "true";
		},
		destroy() {}
	};
}
//#endregion
//#region src/js/lib/components/rzAlert.js
function rzAlert() {
	return {
		parentElement: null,
		showAlert: true,
		init() {
			const alpineRoot = this.$el.dataset.alpineRoot || this.$el.closest("[data-alpine-root]");
			this.parentElement = document.getElementById(alpineRoot);
		},
		dismiss() {
			this.showAlert = false;
			const self = this;
			setTimeout(() => {
				self.parentElement.style.display = "none";
			}, 205);
		}
	};
}
//#endregion
//#region src/js/lib/components/rzAspectRatio.js
function rzAspectRatio() {
	return { init() {
		const ratio = parseFloat(this.$el.dataset.ratio);
		if (!isNaN(ratio) && ratio > 0) {
			const paddingBottom = 100 / ratio + "%";
			this.$el.style.paddingBottom = paddingBottom;
		} else this.$el.style.paddingBottom = "100%";
	} };
}
//#endregion
//#region src/js/lib/components/rzBackToTop.js
function rzBackToTop() {
	return {
		visible: false,
		threshold: 300,
		_rafPending: false,
		_onScroll: null,
		init() {
			const parsedThreshold = Number(this.$el.dataset.threshold);
			this.threshold = Number.isFinite(parsedThreshold) ? parsedThreshold : 300;
			this._onScroll = () => {
				if (this._rafPending) return;
				this._rafPending = true;
				window.requestAnimationFrame(() => {
					this.visible = window.scrollY > this.threshold;
					this._rafPending = false;
				});
			};
			window.addEventListener("scroll", this._onScroll, { passive: true });
			this._onScroll();
		},
		scrollToTop() {
			const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
			window.scrollTo({
				top: 0,
				behavior
			});
		},
		destroy() {
			if (this._onScroll) window.removeEventListener("scroll", this._onScroll);
		}
	};
}
//#endregion
//#region src/js/lib/components/rzClipboard.js
function rzClipboard() {
	return {
		value: null,
		targetSelector: null,
		preferValue: false,
		feedbackDuration: 1200,
		useFallback: true,
		disabled: false,
		copied: false,
		timeoutHandle: null,
		get notCopied() {
			return !this.copied;
		},
		init() {
			this.value = this.$el.dataset.copyValue || null;
			this.targetSelector = this.$el.dataset.targetSelector || null;
			this.preferValue = this.$el.dataset.preferValue === "true";
			this.feedbackDuration = parseInt(this.$el.dataset.feedbackDuration, 10) || 1200;
			this.useFallback = this.$el.dataset.useFallback === "true";
			this.disabled = this.$el.dataset.disabled === "true";
		},
		getTextToCopy() {
			if (this.preferValue && this.value) return this.value;
			if (this.targetSelector) {
				const target = document.querySelector(this.targetSelector);
				if (target) return target.value !== void 0 ? target.value : target.textContent;
			}
			return this.value;
		},
		async copy() {
			if (this.disabled) return;
			const text = this.getTextToCopy();
			const cleanText = text ? text.trim() : "";
			if (!cleanText) {
				this.dispatchFailed("empty-text");
				return;
			}
			try {
				if (navigator.clipboard && window.isSecureContext) {
					await navigator.clipboard.writeText(cleanText);
					this.onSuccess(cleanText);
				} else if (this.useFallback) if (this.fallbackCopy(cleanText)) this.onSuccess(cleanText);
				else this.dispatchFailed("clipboard-unavailable");
				else this.dispatchFailed("clipboard-unavailable");
			} catch (err) {
				this.dispatchFailed("permission-denied", err);
			}
		},
		onSuccess(text) {
			this.copied = true;
			this.$dispatch("rz:copy", {
				id: this.$el.dataset.alpineRoot,
				text
			});
			if (this.timeoutHandle) clearTimeout(this.timeoutHandle);
			this.timeoutHandle = setTimeout(() => {
				this.copied = false;
			}, this.feedbackDuration);
		},
		fallbackCopy(text) {
			const textArea = document.createElement("textarea");
			textArea.value = text;
			textArea.style.position = "fixed";
			textArea.style.left = "-999999px";
			textArea.style.top = "-999999px";
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			try {
				document.execCommand("copy");
				textArea.remove();
				return true;
			} catch (err) {
				textArea.remove();
				return false;
			}
		},
		dispatchFailed(reason, error = null) {
			this.$dispatch("rz:copy-failed", {
				id: this.$el.dataset.alpineRoot,
				reason,
				error
			});
		}
	};
}
//#endregion
//#region src/js/lib/components/rzCollapsible.js
function rzCollapsible() {
	return {
		isOpen: false,
		init() {
			this.isOpen = this.$el.dataset.defaultOpen === "true";
		},
		toggle() {
			this.isOpen = !this.isOpen;
		},
		state() {
			return this.isOpen ? "open" : "closed";
		}
	};
}
//#endregion
//#region src/js/lib/components/rzDarkModeToggle.js
function rzDarkModeToggle() {
	return {
		get mode() {
			return this.$store.theme.mode;
		},
		get prefersDark() {
			return this.$store.theme.prefersDark;
		},
		get effectiveDark() {
			return this.$store.theme.effectiveDark;
		},
		get isDark() {
			return this.$store.theme.isDark;
		},
		get isLight() {
			return this.$store.theme.isLight;
		},
		setLight() {
			this.$store.theme.setLight();
		},
		setDark() {
			this.$store.theme.setDark();
		},
		setAuto() {
			this.$store.theme.setAuto();
		},
		toggle() {
			this.$store.theme.toggle();
		}
	};
}
//#endregion
//#region src/js/lib/components/rzHeading.js
function rzHeading() {
	return {
		observer: null,
		headingId: "",
		init() {
			this.headingId = this.$el.dataset.alpineRoot;
			const self = this;
			if (typeof this.setCurrentHeading === "function") {
				const callback = (entries, observer) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) self.setCurrentHeading(self.headingId);
					});
				};
				this.observer = new IntersectionObserver(callback, { threshold: .5 });
				this.observer.observe(this.$el);
			}
		},
		destroy() {
			if (this.observer != null) this.observer.disconnect();
		}
	};
}
//#endregion
//#region src/js/lib/components/rzIndicator.js
function rzIndicator() {
	return {
		visible: false,
		init() {
			const colorValue = this.$el.dataset.color;
			if (colorValue) this.$el.style.backgroundColor = colorValue;
			else this.$el.style.backgroundColor = "var(--color-success)";
			if (this.$el.dataset.visible === "true") this.visible = true;
		},
		notVisible() {
			return !this.visible;
		},
		setVisible(value) {
			this.visible = value;
		}
	};
}
//#endregion
//#region src/js/lib/components/rzInputGroupAddon.js
function rzInputGroupAddon() {
	return { handleClick(event) {
		if (event.target.closest("button")) return;
		const parent = this.$el.parentElement;
		if (parent) parent.querySelector("input, textarea")?.focus();
	} };
}
//#endregion
//#region src/js/lib/components/rzPrependInput.js
function rzPrependInput() {
	return {
		prependContainer: null,
		textInput: null,
		init() {
			this.prependContainer = this.$refs.prependContainer;
			this.textInput = this.$refs.textInput;
			let self = this;
			setTimeout(() => {
				self.updatePadding();
			}, 50);
			window.addEventListener("resize", this.updatePadding);
		},
		destroy() {
			window.removeEventListener("resize", this.updatePadding);
		},
		updatePadding() {
			const prependDiv = this.prependContainer;
			const inputElem = this.textInput;
			if (!prependDiv || !inputElem) {
				if (inputElem) inputElem.classList.remove("text-transparent");
				return;
			}
			const leftPadding = prependDiv.offsetWidth + 10;
			inputElem.style.paddingLeft = leftPadding + "px";
			inputElem.classList.remove("text-transparent");
		}
	};
}
//#endregion
//#region src/js/lib/components/rzProgress.js
function rzProgress() {
	return {
		currentVal: 0,
		minVal: 0,
		maxVal: 100,
		percentage: 0,
		label: "",
		init() {
			const element = this.$el;
			this.currentVal = parseInt(element.getAttribute("data-current-val")) || 0;
			this.minVal = parseInt(element.getAttribute("data-min-val")) || 0;
			this.maxVal = parseInt(element.getAttribute("data-max-val")) || 100;
			this.label = element.getAttribute("data-label");
			this.calculatePercentage();
			element.setAttribute("aria-valuenow", this.currentVal);
			element.setAttribute("aria-valuemin", this.minVal);
			element.setAttribute("aria-valuemax", this.maxVal);
			element.setAttribute("aria-valuetext", `${this.percentage}%`);
			this.updateProgressBar();
			new ResizeObserver((entries) => {
				this.updateProgressBar();
			}).observe(element);
			this.$watch("currentVal", () => {
				this.calculatePercentage();
				this.updateProgressBar();
				element.setAttribute("aria-valuenow", this.currentVal);
				element.setAttribute("aria-valuetext", `${this.percentage}%`);
			});
		},
		calculatePercentage() {
			if (this.maxVal === this.minVal) this.percentage = 0;
			else this.percentage = Math.min(Math.max((this.currentVal - this.minVal) / (this.maxVal - this.minVal) * 100, 0), 100);
		},
		buildLabel() {
			var label = this.label || "{percent}%";
			this.calculatePercentage();
			return label.replace("{percent}", this.percentage);
		},
		buildInsideLabelPosition() {
			const progressBar = this.$refs.progressBar;
			const barLabel = this.$refs.progressBarLabel;
			const innerLabel = this.$refs.innerLabel;
			if (barLabel && progressBar && innerLabel) {
				innerLabel.innerText = this.buildLabel();
				if (barLabel.clientWidth > progressBar.clientWidth) barLabel.style.left = progressBar.clientWidth + 10 + "px";
				else barLabel.style.left = progressBar.clientWidth / 2 - barLabel.clientWidth / 2 + "px";
			}
		},
		getLabelCss() {
			const barLabel = this.$refs.progressBarLabel;
			const progressBar = this.$refs.progressBar;
			if (barLabel && progressBar && barLabel.clientWidth > progressBar.clientWidth) return "text-foreground dark:text-foreground";
			return "";
		},
		updateProgressBar() {
			const progressBar = this.$refs.progressBar;
			if (progressBar) {
				progressBar.style.width = `${this.percentage}%`;
				this.buildInsideLabelPosition();
			}
		},
		setProgress(value) {
			this.currentVal = value;
		},
		increment(val = 1) {
			this.currentVal = Math.min(this.currentVal + val, this.maxVal);
		},
		decrement(val = 1) {
			this.currentVal = Math.max(this.currentVal - val, this.minVal);
		}
	};
}
//#endregion
//#region src/js/lib/components/rzTabs.js
function rzTabs() {
	return {
		selectedTab: "",
		_triggers: [],
		_observer: null,
		init() {
			const defaultValue = this.$el.dataset.defaultValue;
			this._observer = new MutationObserver(() => this.refreshTriggers());
			this._observer.observe(this.$el, {
				childList: true,
				subtree: true
			});
			this.refreshTriggers();
			if (defaultValue && this._triggers.some((t) => t.dataset.value === defaultValue)) this.selectedTab = defaultValue;
			else if (this._triggers.length > 0) this.selectedTab = this._triggers[0].dataset.value;
		},
		destroy() {
			if (this._observer) this._observer.disconnect();
		},
		refreshTriggers() {
			this._triggers = Array.from(this.$el.querySelectorAll("[role=\"tab\"]"));
		},
		onTriggerClick(e) {
			const value = e.currentTarget?.dataset?.value;
			if (!value || e.currentTarget.getAttribute("aria-disabled") === "true") return;
			this.selectedTab = value;
			this.$dispatch("rz:tabs-change", { value: this.selectedTab });
		},
		isSelected(value) {
			return this.selectedTab === value;
		},
		bindTrigger() {
			this.selectedTab;
			const value = this.$el.dataset.value;
			const active = this.isSelected(value);
			const disabled = this.$el.getAttribute("aria-disabled") === "true";
			return {
				"aria-selected": String(active),
				"tabindex": active ? "0" : "-1",
				"data-state": active ? "active" : "inactive",
				...disabled && { "disabled": true }
			};
		},
		_attrDisabled() {
			return this.$el.getAttribute("aria-disabled") === "true" ? "true" : null;
		},
		_attrAriaSelected() {
			return String(this.$el.dataset.value === this.selectedTab);
		},
		_attrHidden() {
			return this.$el.dataset.value === this.selectedTab ? null : "true";
		},
		_attrAriaHidden() {
			return String(this.selectedTab !== this.$el.dataset.value);
		},
		_attrDataState() {
			return this.selectedTab === this.$el.dataset.value ? "active" : "inactive";
		},
		_attrTabIndex() {
			return this.selectedTab === this.$el.dataset.value ? "0" : "-1";
		},
		onListKeydown(e) {
			if ([
				"ArrowLeft",
				"ArrowRight",
				"ArrowUp",
				"ArrowDown",
				"Home",
				"End"
			].includes(e.key)) {
				e.preventDefault();
				const availableTriggers = this._triggers.filter((t) => t.getAttribute("aria-disabled") !== "true");
				if (availableTriggers.length === 0) return;
				const activeIndex = availableTriggers.findIndex((t) => t.dataset.value === this.selectedTab);
				if (activeIndex === -1) return;
				const isVertical = e.currentTarget?.getAttribute("aria-orientation") === "vertical";
				const prevKey = isVertical ? "ArrowUp" : "ArrowLeft";
				const nextKey = isVertical ? "ArrowDown" : "ArrowRight";
				let newIndex = activeIndex;
				switch (e.key) {
					case prevKey:
						newIndex = activeIndex - 1 < 0 ? availableTriggers.length - 1 : activeIndex - 1;
						break;
					case nextKey:
						newIndex = (activeIndex + 1) % availableTriggers.length;
						break;
					case "Home":
						newIndex = 0;
						break;
					case "End":
						newIndex = availableTriggers.length - 1;
						break;
				}
				if (newIndex >= 0 && newIndex < availableTriggers.length) {
					const newTrigger = availableTriggers[newIndex];
					this.selectedTab = newTrigger.dataset.value;
					this.$nextTick(() => newTrigger.focus());
				}
			}
		}
	};
}
//#endregion
//#region src/js/lib/components/rzToggle.js
function rzToggle() {
	return {
		pressed: false,
		disabled: false,
		controlled: false,
		init() {
			this.disabled = this.$el.dataset.disabled === "true";
			const pressedValue = this.$el.dataset.pressed;
			this.controlled = pressedValue === "true" || pressedValue === "false";
			if (this.controlled) {
				this.pressed = pressedValue === "true";
				return;
			}
			this.pressed = this.$el.dataset.defaultPressed === "true";
		},
		toggle() {
			if (this.disabled) return;
			if (this.controlled) return;
			this.pressed = !this.pressed;
		},
		state() {
			return this.pressed ? "on" : "off";
		},
		ariaPressed() {
			return this.pressed.toString();
		},
		dataDisabled() {
			return this.disabled ? "" : null;
		}
	};
}
//#endregion
export { accordionItem, rzAccordion, rzAlert, rzAspectRatio, rzBackToTop, rzClipboard, rzCollapsible, rzDarkModeToggle, rzHeading, rzIndicator, rzInputGroupAddon, rzPrependInput, rzProgress, rzTabs, rzToggle };

//# sourceMappingURL=core-common-CMcLADc0.js.map