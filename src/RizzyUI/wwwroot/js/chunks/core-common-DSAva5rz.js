// src/js/lib/components/accordionItem.js
function accordionItem() {
	return {
		open: false,
		sectionId: "",
		expandedClass: "",
		/**
		* Executes the `init` operation.
		* @returns {any} Returns the result of `init` when applicable.
		*/
		init() {
			this.open = this.$el.dataset.isOpen === "true";
			this.sectionId = this.$el.dataset.sectionId;
			this.expandedClass = this.$el.dataset.expandedClass;
			const self = this;
			if (typeof this.selected !== "undefined" && typeof this.allowMultiple !== "undefined") this.$watch("selected", (value) => {
				if (value !== self.sectionId && !self.allowMultiple) self.open = false;
			});
			else console.warn("accordionItem: Could not find 'selected' or 'allowMultiple' in parent scope for $watch.");
		},
		/**
		* Executes the `destroy` operation.
		* @returns {any} Returns the result of `destroy` when applicable.
		*/
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
		},
		handleKeydown(event) {
			if (!event || ![
				"ArrowDown",
				"ArrowUp",
				"Home",
				"End"
			].includes(event.key)) return;
			const accordion = this.$el.closest("[data-slot=\"accordion\"]");
			const triggers = Array.from(accordion?.querySelectorAll("[data-slot=\"accordion-trigger\"]") ?? []).filter((trigger) => !trigger.disabled && trigger.getAttribute("aria-disabled") !== "true");
			if (triggers.length === 0) return;
			const currentIndex = triggers.indexOf(event.currentTarget);
			if (currentIndex === -1) return;
			event.preventDefault();
			let nextIndex = currentIndex;
			if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % triggers.length;
			else if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
			else if (event.key === "Home") nextIndex = 0;
			else if (event.key === "End") nextIndex = triggers.length - 1;
			triggers[nextIndex]?.focus();
		}
	};
}
// src/js/lib/components/rzAccordion.js
function rzAccordion() {
	return {
		selected: "",
		allowMultiple: false,
		/**
		* Executes the `init` operation.
		* @returns {any} Returns the result of `init` when applicable.
		*/
		init() {
			this.allowMultiple = this.$el.dataset.multiple === "true";
		},
		/**
		* Executes the `destroy` operation.
		* @returns {any} Returns the result of `destroy` when applicable.
		*/
		destroy() {}
	};
}
// src/js/lib/components/rzAlert.js
function rzAlert() {
	return {
		parentElement: null,
		showAlert: true,
		/**
		* Executes the `init` operation.
		* @returns {any} Returns the result of `init` when applicable.
		*/
		init() {
			const alpineRoot = this.$el.dataset.alpineRoot || this.$el.closest("[data-alpine-root]");
			this.parentElement = document.getElementById(alpineRoot);
		},
		/**
		* Executes the `dismiss` operation.
		* @returns {any} Returns the result of `dismiss` when applicable.
		*/
		dismiss() {
			this.showAlert = false;
			const self = this;
			setTimeout(() => {
				self.parentElement.style.display = "none";
			}, 205);
		}
	};
}
// src/js/lib/components/rzAspectRatio.js
function rzAspectRatio() {
	return { 
	/**
	* Executes the `init` operation.
	* @returns {any} Returns the result of `init` when applicable.
	*/
init() {
		const ratio = parseFloat(this.$el.dataset.ratio);
		if (!isNaN(ratio) && ratio > 0) {
			const paddingBottom = 100 / ratio + "%";
			this.$el.style.paddingBottom = paddingBottom;
		} else this.$el.style.paddingBottom = "100%";
	} };
}
// src/js/lib/components/rzBackToTop.js
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
// src/js/lib/components/rzClipboard.js
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
				} else if (this.useFallback) {
					if (this.fallbackCopy(cleanText)) this.onSuccess(cleanText);
					else this.dispatchFailed("clipboard-unavailable");
				} else this.dispatchFailed("clipboard-unavailable");
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
// src/js/lib/components/rzCollapsible.js
function rzCollapsible() {
	return {
		isOpen: false,
		/**
		* Executes the `init` operation.
		* @returns {any} Returns the result of `init` when applicable.
		*/
		init() {
			this.isOpen = this.$el.dataset.defaultOpen === "true";
		},
		/**
		* Executes the `toggle` operation.
		* @returns {any} Returns the result of `toggle` when applicable.
		*/
		toggle() {
			this.isOpen = !this.isOpen;
		},
		/**
		* Executes the `state` operation.
		* @returns {any} Returns the result of `state` when applicable.
		*/
		state() {
			return this.isOpen ? "open" : "closed";
		}
	};
}
// src/js/lib/components/rzDarkModeToggle.js
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
// src/js/lib/components/rzFocusFirstInvalid.js
/**
* Focuses the first invalid control of the enclosing form when it initializes (Summit SF-045).
* Controls that hide their native element (Tom Select, visually hidden checkboxes and switches) get
* the first visible focusable element of the same field instead.
*/
function rzFocusFirstInvalid() {
	return { init() {
		const form = this.$el.closest("form");
		if (!form) return;
		this.$nextTick(() => {
			const invalid = form.querySelector("[aria-invalid=\"true\"]");
			if (!(invalid instanceof HTMLElement)) return;
			((isVisible(invalid) ? invalid : visibleControlOf(invalid)) ?? invalid).focus();
		});
	} };
}
function isVisible(element) {
	return typeof element.checkVisibility === "function" ? element.checkVisibility() : element.getClientRects().length > 0;
}
function visibleControlOf(element) {
	return [...(element.closest("[data-slot=\"field\"]") ?? element.parentElement)?.querySelectorAll("input:not([type=hidden]), select, textarea, button, [tabindex=\"0\"]") ?? []].find((candidate) => candidate instanceof HTMLElement && isVisible(candidate)) ?? null;
}
// src/js/lib/components/rzHeading.js
function rzHeading() {
	return {
		observer: null,
		headingId: "",
		/**
		* Executes the `init` operation.
		* @returns {any} Returns the result of `init` when applicable.
		*/
		init() {
			this.headingId = this.$el.dataset.alpineRoot;
			const self = this;
			if (typeof this.setCurrentHeading === "function") {
				const callback = (entries, observer) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) self.setCurrentHeading(self.headingId);
					});
				};
				const options = { threshold: .5 };
				this.observer = new IntersectionObserver(callback, options);
				this.observer.observe(this.$el);
			}
		},
		/**
		* Executes the `destroy` operation.
		* @returns {any} Returns the result of `destroy` when applicable.
		*/
		destroy() {
			if (this.observer != null) this.observer.disconnect();
		}
	};
}
// src/js/lib/components/rzIndicator.js
function rzIndicator() {
	return {
		visible: false,
		/**
		* Executes the `init` operation.
		* @returns {any} Returns the result of `init` when applicable.
		*/
		init() {
			const colorValue = this.$el.dataset.color;
			if (colorValue) this.$el.style.backgroundColor = colorValue;
			else this.$el.style.backgroundColor = "var(--color-success)";
			if (this.$el.dataset.visible === "true") this.visible = true;
		},
		/**
		* Executes the `notVisible` operation.
		* @returns {any} Returns the result of `notVisible` when applicable.
		*/
		notVisible() {
			return !this.visible;
		},
		/**
		* Executes the `setVisible` operation.
		* @param {any} value Input value for this method.
		* @returns {any} Returns the result of `setVisible` when applicable.
		*/
		setVisible(value) {
			this.visible = value;
		}
	};
}
// src/js/lib/components/rzInputGroupAddon.js
function rzInputGroupAddon() {
	return { 
	/**
	* Executes the `handleClick` operation.
	* @param {any} event Input value for this method.
	* @returns {any} Returns the result of `handleClick` when applicable.
	*/
handleClick(event) {
		if (event.target.closest("button")) return;
		const parent = this.$el.parentElement;
		if (parent) parent.querySelector("input, textarea")?.focus();
	} };
}
// src/js/lib/components/rzPrependInput.js
function rzPrependInput() {
	return {
		prependContainer: null,
		textInput: null,
		/**
		* Executes the `init` operation.
		* @returns {any} Returns the result of `init` when applicable.
		*/
		init() {
			this.prependContainer = this.$refs.prependContainer;
			this.textInput = this.$refs.textInput;
			let self = this;
			setTimeout(() => {
				self.updatePadding();
			}, 50);
			window.addEventListener("resize", this.updatePadding);
		},
		/**
		* Executes the `destroy` operation.
		* @returns {any} Returns the result of `destroy` when applicable.
		*/
		destroy() {
			window.removeEventListener("resize", this.updatePadding);
		},
		/**
		* Executes the `updatePadding` operation.
		* @returns {any} Returns the result of `updatePadding` when applicable.
		*/
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
// src/js/lib/components/rzProgress.js
function toNumber(raw, fallback) {
	if (raw === null || raw === void 0 || raw === "") return fallback;
	const value = Number(raw);
	return Number.isFinite(value) ? value : fallback;
}
function rzProgress() {
	return {
		value: null,
		min: 0,
		max: 100,
		valueText: null,
		init() {
			const element = this.$el;
			this.min = toNumber(element.dataset.min, 0);
			this.max = toNumber(element.dataset.max, 100);
			this.value = toNumber(element.dataset.value, null);
			this.valueText = element.getAttribute("aria-valuetext");
		},
		/** Whether the progress is unknown (no value). */
		get indeterminate() {
			return this.value === null;
		},
		/** The value as a percentage of the range, clamped to 0–100; 0 when indeterminate. */
		get percentage() {
			if (this.value === null || this.max <= this.min) return 0;
			const percent = (this.value - this.min) / (this.max - this.min) * 100;
			return Math.min(Math.max(percent, 0), 100);
		},
		/** The rounded percentage with a percent sign, for ProgressLabel. */
		get percentLabel() {
			return `${Math.round(this.percentage)}%`;
		},
		/** aria-valuenow: the clamped value, or null (attribute removed) when indeterminate. */
		get valueNow() {
			if (this.value === null) return null;
			return Math.min(Math.max(this.value, this.min), Math.max(this.min, this.max));
		},
		/** data-state: loading, complete or indeterminate. */
		get state() {
			if (this.value === null) return "indeterminate";
			return this.value >= this.max ? "complete" : "loading";
		},
		/** The indicator's style: moved left by the part that is not done (none when indeterminate). */
		indicatorStyle() {
			if (this.value === null) return { translate: "" };
			return { translate: `-${100 - this.percentage}% 0` };
		},
		/**
		* Sets the value. Pass a new (localized) aria-valuetext with it, or leave it out to have
		* assistive technology read the percentage. `null` makes the bar indeterminate.
		* @param {number | null} value
		* @param {string | null} [valueText]
		*/
		setProgress(value, valueText = null) {
			this.value = value === null ? null : toNumber(value, this.value);
			this.valueText = valueText;
		},
		/** Adds `step` (default 1), up to the maximum. An indeterminate bar starts from the minimum. */
		increment(step = 1) {
			const current = this.value === null ? this.min : this.value;
			this.setProgress(Math.min(current + step, this.max));
		},
		/** Subtracts `step` (default 1), down to the minimum. */
		decrement(step = 1) {
			const current = this.value === null ? this.min : this.value;
			this.setProgress(Math.max(current - step, this.min));
		},
		/** Makes the bar indeterminate (progress unknown). */
		setIndeterminate() {
			this.setProgress(null);
		}
	};
}
// src/js/lib/components/rzTabs.js
function rzTabs() {
	return {
		selectedTab: "",
		_triggers: [],
		_observer: null,
		/**
		* Initializes tab trigger registration and selects the default or first enabled tab.
		* @returns {void}
		*/
		init() {
			const defaultValue = this.$el.dataset.defaultValue;
			this._observer = new MutationObserver(() => {
				this.refreshTriggers();
				this._ensureSelectedTab();
			});
			this._observer.observe(this.$el, {
				childList: true,
				subtree: true
			});
			this.refreshTriggers();
			if (defaultValue && this._triggers.some((t) => t.dataset.value === defaultValue && !this._isDisabled(t))) this.selectedTab = defaultValue;
			else this.selectedTab = this._enabledTriggers()[0]?.dataset.value ?? "";
		},
		/**
		* Disconnects the mutation observer.
		* @returns {void}
		*/
		destroy() {
			if (this._observer) {
				this._observer.disconnect();
				this._observer = null;
			}
		},
		/**
		* Refreshes trigger registrations from current DOM state.
		* @returns {void}
		*/
		refreshTriggers() {
			this._triggers = Array.from(this.$el.querySelectorAll("[role=\"tab\"]"));
		},
		/**
		* Activates an enabled tab trigger.
		* @param {HTMLElement} trigger The tab trigger to activate.
		* @param {boolean} focusTrigger Whether to move focus to the trigger after activation.
		* @returns {void}
		*/
		activateTrigger(trigger, focusTrigger = false) {
			if (!trigger || this._isDisabled(trigger)) return;
			const value = trigger.dataset.value;
			if (!value) return;
			if (this.selectedTab !== value) {
				this.selectedTab = value;
				this.$dispatch("rz:tabs-change", { value: this.selectedTab });
			}
			if (focusTrigger) this.$nextTick(() => trigger.focus());
		},
		/**
		* Handles pointer activation on a tab trigger.
		* @param {Event} e The click event.
		* @returns {void}
		*/
		onTriggerClick(e) {
			this.activateTrigger(e.currentTarget, false);
		},
		/**
		* Returns whether a tab value is selected.
		* @param {string} value The tab value.
		* @returns {boolean} True when selected.
		*/
		isSelected(value) {
			return this.selectedTab === value;
		},
		/**
		* Returns Alpine trigger bindings for consumers that bind directly.
		* @returns {object} Trigger attributes.
		*/
		bindTrigger() {
			const value = this.$el.dataset.value;
			const active = this.isSelected(value);
			const disabled = this._isDisabled(this.$el);
			return {
				"aria-selected": String(active),
				"tabindex": active ? "0" : "-1",
				"data-state": active ? "active" : "inactive",
				...disabled && { "disabled": true }
			};
		},
		/**
		* Returns the native disabled attribute value for disabled tabs.
		* @returns {string|null} Disabled attribute value.
		*/
		_attrDisabled() {
			return this._isDisabled(this.$el) ? "true" : null;
		},
		/**
		* Returns the selected state for a tab trigger.
		* @returns {string} The aria-selected value.
		*/
		_attrAriaSelected() {
			return String(this.$el.dataset.value === this.selectedTab && !this._isDisabled(this.$el));
		},
		/**
		* Returns the hidden attribute value for a tab panel.
		* @returns {string|null} Hidden attribute value.
		*/
		_attrHidden() {
			return this.$el.dataset.value === this.selectedTab ? null : "true";
		},
		/**
		* Returns whether a tab panel is hidden from assistive technology.
		* @returns {string} The aria-hidden value.
		*/
		_attrAriaHidden() {
			return String(this.selectedTab !== this.$el.dataset.value);
		},
		/**
		* Returns the active or inactive state for a trigger or panel.
		* @returns {string} The data-state value.
		*/
		_attrDataState() {
			return this.selectedTab === this.$el.dataset.value && !this._isDisabled(this.$el) ? "active" : "inactive";
		},
		/**
		* Returns the roving tabindex value for a trigger or panel.
		* @returns {string} The tabindex value.
		*/
		_attrTabIndex() {
			return this.selectedTab === this.$el.dataset.value && !this._isDisabled(this.$el) ? "0" : "-1";
		},
		/**
		* Handles APG-style automatic tab activation and roving focus for arrow keys.
		* @param {KeyboardEvent} e The keyboard event.
		* @returns {void}
		*/
		onListKeydown(e) {
			if (![
				"ArrowLeft",
				"ArrowRight",
				"ArrowUp",
				"ArrowDown",
				"Home",
				"End"
			].includes(e.key)) return;
			const isVertical = e.currentTarget?.getAttribute("aria-orientation") === "vertical";
			if (!(e.key === "Home" || e.key === "End" || isVertical && ["ArrowUp", "ArrowDown"].includes(e.key) || !isVertical && ["ArrowLeft", "ArrowRight"].includes(e.key))) return;
			const availableTriggers = this._enabledTriggers();
			if (availableTriggers.length === 0) return;
			const currentTrigger = this._isDisabled(e.target) || e.target?.getAttribute?.("role") !== "tab" ? availableTriggers.find((t) => t.dataset.value === this.selectedTab) : e.target;
			let activeIndex = availableTriggers.indexOf(currentTrigger);
			if (activeIndex === -1) activeIndex = Math.max(availableTriggers.findIndex((t) => t.dataset.value === this.selectedTab), 0);
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
				case "End": newIndex = availableTriggers.length - 1;
			}
			e.preventDefault();
			this.activateTrigger(availableTriggers[newIndex], true);
		},
		/**
		* Returns enabled tab triggers.
		* @returns {HTMLElement[]} Enabled tab triggers.
		*/
		_enabledTriggers() {
			return this._triggers.filter((t) => !this._isDisabled(t));
		},
		/**
		* Returns whether an element is disabled for tab activation.
		* @param {HTMLElement} element The element to inspect.
		* @returns {boolean} True when disabled.
		*/
		_isDisabled(element) {
			return element?.getAttribute?.("aria-disabled") === "true" || element?.hasAttribute?.("disabled") === true || element?.disabled === true;
		},
		/**
		* Ensures selectedTab still points at an enabled tab after DOM changes.
		* @returns {void}
		*/
		_ensureSelectedTab() {
			if (this.selectedTab && this._triggers.some((t) => t.dataset.value === this.selectedTab && !this._isDisabled(t))) return;
			this.selectedTab = this._enabledTriggers()[0]?.dataset.value ?? "";
		}
	};
}
// src/js/lib/components/rzToggle.js
function rzToggle() {
	return {
		pressed: false,
		disabled: false,
		controlled: false,
		/**
		* Executes the `init` operation.
		* @returns {any} Returns the result of `init` when applicable.
		*/
		init() {
			this.disabled = this.$el.dataset.disabled === "true";
			this.initChangeEvent();
			const pressedValue = this.$el.dataset.pressed;
			this.controlled = pressedValue === "true" || pressedValue === "false";
			if (this.controlled) {
				this.pressed = pressedValue === "true";
				return;
			}
			this.pressed = this.$el.dataset.defaultPressed === "true";
		},
		/**
		* Dispatches `rz:toggle:change` ({ pressed, value }) when the pressed state changes, and
		* enables the hidden input (Name/Value) only while pressed (Summit SF-015, decision D-24).
		*/
		initChangeEvent() {
			this.$watch("pressed", (pressed) => {
				const input = this.$el.querySelector(":scope > input[data-toggle-input]");
				if (input) input.disabled = !pressed;
				this.$el.dispatchEvent(new CustomEvent("rz:toggle:change", {
					bubbles: true,
					detail: {
						pressed,
						value: this.$el.dataset.value ?? null
					}
				}));
			});
		},
		/**
		* Executes the `toggle` operation.
		* @returns {any} Returns the result of `toggle` when applicable.
		*/
		toggle() {
			if (this.disabled) return;
			if (this.controlled) return;
			this.pressed = !this.pressed;
		},
		/**
		* Executes the `state` operation.
		* @returns {any} Returns the result of `state` when applicable.
		*/
		state() {
			return this.pressed ? "on" : "off";
		},
		/**
		* Executes the `ariaPressed` operation.
		* @returns {any} Returns the result of `ariaPressed` when applicable.
		*/
		ariaPressed() {
			return this.pressed.toString();
		},
		/**
		* Executes the `dataDisabled` operation.
		* @returns {any} Returns the result of `dataDisabled` when applicable.
		*/
		dataDisabled() {
			return this.disabled ? "" : null;
		}
	};
}
export { accordionItem, rzAccordion, rzAlert, rzAspectRatio, rzBackToTop, rzClipboard, rzCollapsible, rzDarkModeToggle, rzFocusFirstInvalid, rzHeading, rzIndicator, rzInputGroupAddon, rzPrependInput, rzProgress, rzTabs, rzToggle };

//# sourceMappingURL=core-common-DSAva5rz.js.map