import { t as rizzyRequire } from "./rizzyRequire-C5t2y41V.js";
//#region src/js/lib/components/rzColorPicker.js
function rzColorPicker() {
	return {
		colorValue: "",
		swatchStyle: "background-color: transparent;",
		config: {},
		inputId: "",
		init() {
			this.inputId = this.$el.dataset.inputId;
			this.colorValue = this.$el.dataset.initialValue || "";
			this.config = this.readConfig();
			this.refreshSwatch();
			const assets = JSON.parse(this.$el.dataset.assets || "[]");
			const nonce = this.$el.dataset.nonce;
			rizzyRequire(assets, nonce).then(() => this.initializeColoris()).catch((e) => this.handleAssetError(e));
		},
		readConfig() {
			const raw = this.$el.dataset.config;
			if (!raw) return {};
			try {
				return JSON.parse(raw);
			} catch {
				return {};
			}
		},
		initializeColoris() {
			const input = this.$refs.input;
			if (!input || !window.Coloris) return;
			const self = this;
			this.config = {
				el: input,
				wrap: false,
				themeMode: "auto",
				onChange: (color, inputEl) => {
					inputEl.dispatchEvent(new CustomEvent("rz:colorpicker:onchange", {
						bubbles: true,
						composed: true,
						detail: {
							rzColorPicker: self,
							updateConfiguration: self.updateConfiguration.bind(self),
							el: inputEl
						}
					}));
				},
				...this.config
			};
			window.Coloris(this.config);
			this.colorValue = input.value || this.colorValue;
			this.refreshSwatch();
			input.addEventListener("input", () => this.handleInput());
		},
		openPicker() {
			const input = this.$refs.input;
			if (!input) return;
			input.focus();
			input.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		},
		updateConfiguration(config) {
			this.config = {
				...this.config,
				...config
			};
			if (!window.Coloris || !this.$refs.input) return;
			window.Coloris.setInstance(this.$refs.input, this.config);
		},
		handleInput() {
			const input = this.$refs.input;
			this.colorValue = input ? input.value : "";
			this.refreshSwatch();
		},
		refreshSwatch() {
			this.swatchStyle = "background-color: " + (this.colorValue && this.colorValue.trim().length > 0 ? this.colorValue : "transparent") + ";";
		},
		handleAssetError(error) {
			console.error("Failed to load Coloris assets.", error);
		}
	};
}
//#endregion
//#region src/js/lib/components/rzColorPickerProvider.js
function rzColorPickerProvider() {
	return {
		colorPicker: {
			value: "",
			open: null,
			setValue: null,
			getValue: null,
			updateConfiguration: null
		},
		config: {},
		_isSyncingFromInput: false,
		_isSyncingToInput: false,
		_inputListenerAttached: false,
		init() {
			this.colorPicker.open = this.openPicker.bind(this);
			this.colorPicker.setValue = this.setValue.bind(this);
			this.colorPicker.getValue = () => this.colorPicker.value;
			this.colorPicker.updateConfiguration = this.updateConfiguration.bind(this);
			this.colorPicker.value = this.readValue(this.$el.dataset.initialValue || "");
			this.config = this.readConfig();
			this.$watch("colorPicker.value", (next) => {
				const normalized = this.readValue(next);
				if (normalized !== next) {
					this.colorPicker.value = normalized;
					return;
				}
				this.syncInputFromState();
			});
			const assets = JSON.parse(this.$el.dataset.assets || "[]");
			const nonce = this.$el.dataset.nonce;
			rizzyRequire(assets, nonce).then(() => this.initializeColoris()).catch((e) => this.handleAssetError(e));
		},
		readValue(value) {
			return typeof value === "string" ? value.trim() : "";
		},
		readConfig() {
			const raw = this.$el.dataset.config;
			if (!raw) return {};
			try {
				return JSON.parse(raw);
			} catch {
				return {};
			}
		},
		initializeColoris() {
			const input = this.$refs.input;
			if (!input || !window.Coloris) return;
			this.config = {
				el: input,
				wrap: false,
				themeMode: "auto",
				onChange: (color, inputEl) => {
					if (inputEl !== this.$refs.input) return;
					this.syncStateFromInput(inputEl);
					inputEl.dispatchEvent(new CustomEvent("rz:colorpicker:onchange", {
						bubbles: true,
						composed: true,
						detail: {
							colorPicker: this.colorPicker,
							updateConfiguration: this.updateConfiguration.bind(this),
							el: inputEl,
							providerEl: this.$el
						}
					}));
				},
				...this.config
			};
			window.Coloris(this.config);
			this.syncStateFromInput(input);
			if (!this._inputListenerAttached) {
				input.addEventListener("input", () => {
					this.syncStateFromInput(input);
				});
				this._inputListenerAttached = true;
			}
			this.syncInputFromState();
		},
		openPicker(event) {
			const input = this.$refs.input;
			if (!input) return;
			this.positionAnchorInput(input, event);
			this.syncInputFromState();
			input.focus();
			input.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		},
		positionAnchorInput(input, event) {
			const trigger = event?.currentTarget;
			if (!trigger || typeof trigger.getBoundingClientRect !== "function") return;
			const rect = trigger.getBoundingClientRect();
			input.style.left = `${Math.round(rect.left)}px`;
			input.style.top = `${Math.round(rect.bottom)}px`;
		},
		setValue(value) {
			this.colorPicker.value = value;
		},
		updateConfiguration(config) {
			this.config = {
				...this.config,
				...config
			};
			const input = this.$refs.input;
			if (!window.Coloris || !input) return;
			window.Coloris.setInstance(input, this.config);
		},
		syncStateFromInput(inputEl) {
			if (!inputEl || this._isSyncingToInput) return;
			this._isSyncingFromInput = true;
			this.colorPicker.value = this.readValue(inputEl.value || "");
			queueMicrotask(() => {
				this._isSyncingFromInput = false;
			});
		},
		syncInputFromState() {
			const input = this.$refs.input;
			if (!input || this._isSyncingFromInput) return;
			const next = this.readValue(this.colorPicker.value);
			if (input.value === next) return;
			this._isSyncingToInput = true;
			input.value = next;
			input.dispatchEvent(new Event("input", { bubbles: true }));
			queueMicrotask(() => {
				this._isSyncingToInput = false;
			});
		},
		handleAssetError(error) {
			console.error("Failed to load Coloris assets.", error);
		}
	};
}
//#endregion
//#region src/js/lib/components/rzColorSwatch.js
function rzColorSwatch() {
	return {
		value: "",
		withoutTransparency: false,
		isDisabled: false,
		swatchStyle: "",
		init() {
			this.value = this.readValue(this.$el.dataset.value);
			this.withoutTransparency = this.readBool(this.$el.dataset.withoutTransparency);
			this.isDisabled = this.readBool(this.$el.dataset.disabled);
			this.$watch("value", (next) => {
				const normalized = this.readValue(next);
				if (normalized !== next) {
					this.value = normalized;
					return;
				}
				this.refreshSwatch();
			});
			this.$watch("withoutTransparency", () => {
				this.refreshSwatch();
			});
			this.refreshSwatch();
		},
		getValue() {
			return this.value;
		},
		setValue(value) {
			this.value = value;
		},
		setWithoutTransparency(value) {
			this.withoutTransparency = !!value;
		},
		readBool(value) {
			return value === "true";
		},
		readValue(value) {
			if (typeof value !== "string") return "";
			return value.trim();
		},
		isCssColor(value) {
			try {
				if (typeof CSS !== "undefined" && typeof CSS.supports === "function") return CSS.supports("color", value);
				return true;
			} catch {
				return false;
			}
		},
		hasAlpha(value) {
			const normalized = value.trim().toLowerCase();
			if (normalized === "transparent") return true;
			if (/^#(?:[0-9a-f]{4}|[0-9a-f]{8})$/i.test(normalized)) return true;
			if (/\b(?:rgba|hsla)\s*\(/i.test(normalized)) return true;
			if (/\b(?:rgb|hsl|lab|lch|oklab|oklch|color)\s*\([^)]*\/\s*[\d.]+%?\s*\)/i.test(normalized)) return true;
			return false;
		},
		getEmptyStyle() {
			return [
				"background:",
				"linear-gradient(",
				"to bottom right,",
				"transparent calc(50% - 1px),",
				"hsl(var(--destructive)) calc(50% - 1px) calc(50% + 1px),",
				"transparent calc(50% + 1px)",
				") no-repeat;"
			].join(" ");
		},
		getInvalidStyle() {
			return "background-color: transparent;";
		},
		getSolidColorStyle(color) {
			return `background-color: ${color};`;
		},
		getAlphaPreviewStyle(color) {
			return [
				`background: linear-gradient(${color}, ${color}),`,
				"repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%)",
				"0% 50% / 10px 10px;"
			].join(" ");
		},
		refreshSwatch() {
			const color = this.value;
			if (!color) {
				this.swatchStyle = this.getEmptyStyle();
				return;
			}
			if (!this.isCssColor(color)) {
				this.swatchStyle = this.getInvalidStyle();
				return;
			}
			if (!this.withoutTransparency && this.hasAlpha(color)) {
				this.swatchStyle = this.getAlphaPreviewStyle(color);
				return;
			}
			this.swatchStyle = this.getSolidColorStyle(color);
		}
	};
}
//#endregion
export { rzColorPicker, rzColorPickerProvider, rzColorSwatch };

//# sourceMappingURL=color-runtime-BQbdJmIl.js.map