import { t as rizzyRequire } from "./rizzyRequire-C5t2y41V.js";
//#region src/js/lib/components/rzCalendar.js
function rzCalendar() {
	return {
		calendar: null,
		initialized: false,
		init() {
			const assets = JSON.parse(this.$el.dataset.assets || "[]");
			const configId = this.$el.dataset.configId;
			const nonce = this.$el.dataset.nonce;
			if (assets.length === 0) {
				console.warn("RzCalendar: No assets configured.");
				return;
			}
			rizzyRequire(assets, {
				success: () => {
					this.initCalendar(configId);
				},
				error: (e) => console.error("RzCalendar: Failed to load assets", e)
			}, nonce);
		},
		initCalendar(configId) {
			const configElement = document.getElementById(configId);
			if (!configElement) {
				console.error(`RzCalendar: Config element #${configId} not found.`);
				return;
			}
			let rawConfig = {};
			try {
				rawConfig = JSON.parse(configElement.textContent);
			} catch (e) {
				console.error("RzCalendar: Failed to parse config JSON", e);
				return;
			}
			const eventHandlers = {
				onClickDate: (self, e) => {
					this.dispatchCalendarEvent("click-day", {
						event: e,
						dates: self.context.selectedDates
					});
				},
				onClickWeekNumber: (self, number, year, dateEls, e) => {
					this.dispatchCalendarEvent("click-week-number", {
						event: e,
						number,
						year,
						days: dateEls
					});
				},
				onClickMonth: (self, e) => {
					this.dispatchCalendarEvent("click-month", {
						event: e,
						month: self.context.selectedMonth
					});
				},
				onClickYear: (self, e) => {
					this.dispatchCalendarEvent("click-year", {
						event: e,
						year: self.context.selectedYear
					});
				},
				onClickArrow: (self, e) => {
					this.dispatchCalendarEvent("click-arrow", {
						event: e,
						year: self.context.selectedYear,
						month: self.context.selectedMonth
					});
				},
				onChangeTime: (self, e, isError) => {
					this.dispatchCalendarEvent("change-time", {
						event: e,
						time: self.context.selectedTime,
						hours: self.context.selectedHours,
						minutes: self.context.selectedMinutes,
						keeping: self.context.selectedKeeping,
						isError
					});
				}
			};
			const options = {
				...rawConfig.options,
				styles: rawConfig.styles,
				...eventHandlers
			};
			if (window.VanillaCalendarPro) {
				this.calendar = new VanillaCalendarPro.Calendar(this.$refs.calendarEl, options);
				this.calendar.init();
				this.initialized = true;
				this.dispatchCalendarEvent("init", { instance: this.calendar });
			} else console.error("RzCalendar: VanillaCalendar global not found.");
		},
		dispatchCalendarEvent(eventName, detail) {
			this.$dispatch(`rz:calendar:${eventName}`, detail);
		},
		destroy() {
			if (this.calendar) {
				this.calendar.destroy();
				this.dispatchCalendarEvent("destroy", {});
			}
		}
	};
}
//#endregion
//#region src/js/lib/components/rzCalendarProvider.js
function rzCalendarProvider() {
	return {
		mode: "single",
		dates: [],
		locale: "en-US",
		formatOptions: {},
		calendarApi: null,
		_isUpdatingFromCalendar: false,
		_lastAppliedState: null,
		_handlers: [],
		get date() {
			return this.dates[0] || "";
		},
		set date(val) {
			if (!val) {
				this.dates = [];
				return;
			}
			if (this._isValidIsoDate(val)) this.dates = this._normalize([val]);
		},
		get startDate() {
			return this.dates[0] || "";
		},
		get endDate() {
			return this.dates[this.dates.length - 1] || "";
		},
		get isRangeComplete() {
			return this.mode === "multiple-ranged" && this.dates.length >= 2;
		},
		get formattedDate() {
			if (!this.date) return "";
			return this._format(this.date);
		},
		get formattedRange() {
			if (!this.startDate) return "";
			const start = this._format(this.startDate);
			if (!this.endDate) return start;
			return `${start} - ${this._format(this.endDate)}`;
		},
		init() {
			this.mode = this.$el.dataset.mode || "single";
			this.locale = this.$el.dataset.locale || "en-US";
			try {
				this.formatOptions = JSON.parse(this.$el.dataset.formatOptions || "{}");
			} catch (e) {}
			try {
				const rawDates = JSON.parse(this.$el.dataset.initialDates || "[]");
				this.dates = this._normalize(rawDates);
			} catch (e) {
				this.dates = [];
			}
			const initHandler = (e) => {
				this.calendarApi = e.detail.instance;
				this.syncToCalendar();
			};
			this.$el.addEventListener("rz:calendar:init", initHandler);
			this._handlers.push({
				type: "rz:calendar:init",
				fn: initHandler
			});
			const destroyHandler = () => {
				this.calendarApi = null;
				this._lastAppliedState = null;
			};
			this.$el.addEventListener("rz:calendar:destroy", destroyHandler);
			this._handlers.push({
				type: "rz:calendar:destroy",
				fn: destroyHandler
			});
			const clickHandler = (e) => {
				this._isUpdatingFromCalendar = true;
				const wasComplete = this.isRangeComplete;
				this.dates = this._normalize(e.detail.dates || []);
				if (!wasComplete && this.isRangeComplete) this.$el.dispatchEvent(new CustomEvent("rz:calendar:range-complete", {
					detail: {
						start: this.dates[0],
						end: this.dates[this.dates.length - 1]
					},
					bubbles: true,
					composed: true
				}));
				this.$nextTick(() => this._isUpdatingFromCalendar = false);
			};
			this.$el.addEventListener("rz:calendar:click-day", clickHandler);
			this._handlers.push({
				type: "rz:calendar:click-day",
				fn: clickHandler
			});
			this.$watch("dates", () => {
				if (this._isUpdatingFromCalendar) return;
				const current = Array.isArray(this.dates) ? this.dates : [];
				const normalized = this._normalize(current);
				if (!Array.isArray(this.dates) || normalized.length !== this.dates.length || normalized.some((v, i) => v !== this.dates[i])) {
					this.dates = normalized;
					return;
				}
				this.syncToCalendar();
			});
		},
		destroy() {
			this._handlers.forEach((h) => this.$el.removeEventListener(h.type, h.fn));
			this._handlers = [];
		},
		syncToCalendar() {
			if (!this.calendarApi) return;
			let selectedDates = [...this.dates];
			if (this.mode === "multiple-ranged" && this.dates.length >= 2) selectedDates = [`${this.dates[0]}:${this.dates[this.dates.length - 1]}`];
			let selectedMonth, selectedYear, canFocus = false;
			if (this.dates.length > 0) {
				const target = this.parseIsoLocal(this.dates[0]);
				if (!isNaN(target.getTime())) {
					selectedMonth = target.getMonth();
					selectedYear = target.getFullYear();
					canFocus = true;
				}
			}
			const stateKey = JSON.stringify({
				mode: this.mode,
				dates: selectedDates,
				m: selectedMonth,
				y: selectedYear
			});
			if (this._lastAppliedState === stateKey) return;
			this._lastAppliedState = stateKey;
			const params = { selectedDates };
			if (canFocus) {
				params.selectedMonth = selectedMonth;
				params.selectedYear = selectedYear;
			}
			this.calendarApi.set(params, {
				dates: true,
				month: canFocus,
				year: canFocus,
				holidays: false,
				time: false
			});
		},
		_format(isoDateStr) {
			const date = this.parseIsoLocal(isoDateStr);
			if (isNaN(date.getTime())) return isoDateStr;
			return new Intl.DateTimeFormat(this.locale, this.formatOptions).format(date);
		},
		_extractIsoDates(value) {
			if (typeof value !== "string") return [];
			return value.match(/\d{4}-\d{2}-\d{2}/g) ?? [];
		},
		_isValidIsoDate(s) {
			if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
			const [y, m, d] = s.split("-").map(Number);
			const dt = new Date(Date.UTC(y, m - 1, d));
			return dt.getUTCFullYear() === y && dt.getUTCMonth() + 1 === m && dt.getUTCDate() === d;
		},
		_normalize(input) {
			const iso = (Array.isArray(input) ? input : []).flat(Infinity).flatMap((v) => {
				if (typeof v === "string") return this._extractIsoDates(v);
				return [];
			}).filter((s) => this._isValidIsoDate(s));
			if (this.mode === "single") return [...new Set(iso)].sort().slice(0, 1);
			if (this.mode === "multiple-ranged") {
				const sorted = iso.sort();
				if (sorted.length <= 1) return sorted;
				return [sorted[0], sorted[sorted.length - 1]];
			}
			return [...new Set(iso)].sort();
		},
		parseIsoLocal(s) {
			const [y, m, d] = s.split("-").map(Number);
			return new Date(y, m - 1, d);
		},
		toLocalISO(dateObj) {
			return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
		},
		setToday() {
			this.dates = this._normalize([this.toLocalISO(/* @__PURE__ */ new Date())]);
		},
		addDays(n) {
			if (this.dates.length === 0) return;
			const current = this.parseIsoLocal(this.dates[0]);
			if (isNaN(current.getTime())) return;
			current.setDate(current.getDate() + n);
			this.dates = this._normalize([this.toLocalISO(current)]);
		},
		setDate(dateStr) {
			this.dates = this._normalize(dateStr ? [dateStr] : []);
		},
		clear() {
			this.dates = [];
		},
		toggleDate(dateStr) {
			let newDates;
			if (this.dates.includes(dateStr)) newDates = this.dates.filter((d) => d !== dateStr);
			else newDates = [...this.dates, dateStr];
			this.dates = this._normalize(newDates);
		}
	};
}
//#endregion
//#region src/js/lib/components/rzDateEdit.js
function rzDateEdit() {
	return {
		options: {},
		placeholder: "",
		prependText: "",
		init() {
			const cfgString = this.$el.dataset.config;
			const inputElem = document.getElementById(this.$el.dataset.uid + "-input");
			if (cfgString) {
				const parsed = JSON.parse(cfgString);
				if (parsed) {
					this.options = parsed.options || {};
					this.placeholder = parsed.placeholder || "";
					this.prependText = parsed.prependText || "";
				}
			}
			const assets = JSON.parse(this.$el.dataset.assets);
			const nonce = this.$el.dataset.nonce;
			rizzyRequire(assets, {
				success: function() {
					if (window.flatpickr && inputElem) window.flatpickr(inputElem, this.options);
				},
				error: function() {
					console.error("Failed to load Flatpickr assets.");
				}
			}, nonce);
		}
	};
}
//#endregion
export { rzCalendar, rzCalendarProvider, rzDateEdit };

//# sourceMappingURL=calendar-runtime-Cm3N2jpl.js.map