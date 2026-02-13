
export default function(Alpine) {
    Alpine.data('rzCalendarProvider', () => ({
        // --- Public State ---
        mode: 'single', 
        dates: [], // Canonical state: Flat array of ISO strings ['YYYY-MM-DD', ...], always sorted/unique
        
        // --- Configuration ---
        locale: 'en-US',
        formatOptions: {},

        // --- Public API ---
        /** 
         * The underlying VanillaCalendarPro instance.
         * Available after the 'rz:calendar:init' event fires.
         * Use this to call VCP methods directly (e.g. showMonth, showYear).
         */
        calendarApi: null,

        // --- Internal ---
        _isUpdatingFromCalendar: false,
        _lastAppliedState: null,
        _handlers: [],

        // --- Computed Helpers ---
        get date() { return this.dates[0] || ''; },
        set date(val) { 
            // Defensive setter: Only update state if value is empty or a valid ISO string.
            // This prevents "fighting" the user input while typing partial dates.
            if (!val) {
                this.dates = [];
                return;
            }
            if (this._isValidIsoDate(val)) {
                this.dates = this._normalize([val]);
            }
        },

        get startDate() { return this.dates[0] || ''; },
        get endDate() { return this.dates[this.dates.length - 1] || ''; },
        get isRangeComplete() { return this.mode === 'multiple-ranged' && this.dates.length >= 2; },

        // --- Formatting Helpers ---
        get formattedDate() {
            if (!this.date) return '';
            return this._format(this.date);
        },

        get formattedRange() {
            if (!this.startDate) return '';
            const start = this._format(this.startDate);
            if (!this.endDate) return start;
            return `${start} - ${this._format(this.endDate)}`;
        },

        // --- Lifecycle ---
        init() {
            this.mode = this.$el.dataset.mode || 'single';
            this.locale = this.$el.dataset.locale || 'en-US';
            try { this.formatOptions = JSON.parse(this.$el.dataset.formatOptions || '{}'); } catch(e) {}
            try { 
                const rawDates = JSON.parse(this.$el.dataset.initialDates || '[]'); 
                this.dates = this._normalize(rawDates);
            } catch (e) { 
                this.dates = []; 
            }

            const initHandler = (e) => {
                this.calendarApi = e.detail.instance;
                this.syncToCalendar();
            };
            this.$el.addEventListener('rz:calendar:init', initHandler);
            this._handlers.push({ type: 'rz:calendar:init', fn: initHandler });

            const destroyHandler = () => {
                this.calendarApi = null;
                this._lastAppliedState = null;
            };
            this.$el.addEventListener('rz:calendar:destroy', destroyHandler);
            this._handlers.push({ type: 'rz:calendar:destroy', fn: destroyHandler });

            const clickHandler = (e) => {
                this._isUpdatingFromCalendar = true;
                const wasComplete = this.isRangeComplete;
                
                // Adopt state from calendar
                // Normalize immediately to prevent state churn
                this.dates = this._normalize(e.detail.dates || []);

                // Dispatch event only if we transitioned to complete state or are actively refining
                // Dispatched from $el to ensure consistent bubbling from provider root
                if (!wasComplete && this.isRangeComplete) {
                    this.$el.dispatchEvent(new CustomEvent('rz:calendar:range-complete', {
                        detail: { start: this.dates[0], end: this.dates[this.dates.length - 1] },
                        bubbles: true,
                        composed: true
                    }));
                }
                
                this.$nextTick(() => this._isUpdatingFromCalendar = false);
            };
            this.$el.addEventListener('rz:calendar:click-day', clickHandler);
            this._handlers.push({ type: 'rz:calendar:click-day', fn: clickHandler });

            // Watch for External Changes (Inputs/Buttons/Presets)
            this.$watch('dates', () => {
                if (this._isUpdatingFromCalendar) return;
                
                // Guard against null/undefined/garbage assignment by consumer
                const current = Array.isArray(this.dates) ? this.dates : [];
                const normalized = this._normalize(current);
                
                // Check if normalization changed anything (length or content)
                const isDirty = !Array.isArray(this.dates) ||
                                normalized.length !== this.dates.length || 
                                normalized.some((v, i) => v !== this.dates[i]);

                if (isDirty) {
                    this.dates = normalized; // Re-assign triggers watcher again, but hits _normalize consistency
                    return;
                }
                this.syncToCalendar();
            });
        },

        /**
         * Executes the `destroy` operation.
         * @returns {any} Returns the result of `destroy` when applicable.
         */
        destroy() {
            this._handlers.forEach(h => this.$el.removeEventListener(h.type, h.fn));
            this._handlers = [];
        },

        /**
         * Executes the `syncToCalendar` operation.
         * @returns {any} Returns the result of `syncToCalendar` when applicable.
         */
        syncToCalendar() {
            if (!this.calendarApi) return;
            let selectedDates = [...this.dates];

            // Translation: VCP expects 'Start:End' string for range SET operations
            if (this.mode === 'multiple-ranged' && this.dates.length >= 2) {
                const start = this.dates[0];
                const end = this.dates[this.dates.length - 1];
                selectedDates = [`${start}:${end}`];
            }

            // Calculate View Focus (only if valid dates exist)
            let selectedMonth, selectedYear, canFocus = false;
            if (this.dates.length > 0) {
                const target = this.parseIsoLocal(this.dates[0]);
                // Guard against invalid dates to prevent NaN errors in VCP
                if (!isNaN(target.getTime())) {
                    selectedMonth = target.getMonth();
                    selectedYear = target.getFullYear();
                    canFocus = true;
                }
            }

            // Idempotence Guard: prevents redundant VCP updates
            const stateKey = JSON.stringify({ mode: this.mode, dates: selectedDates, m: selectedMonth, y: selectedYear });
            if (this._lastAppliedState === stateKey) return;
            this._lastAppliedState = stateKey;

            // Construct Parameters
            const params = { selectedDates };
            if (canFocus) {
                params.selectedMonth = selectedMonth;
                params.selectedYear = selectedYear;
            }

            // Apply via Official API
            this.calendarApi.set(
                params, 
                { 
                    dates: true, 
                    month: canFocus, 
                    year: canFocus, 
                    holidays: false, 
                    time: false 
                }
            );
        },

        // --- Utilities ---
        
        _format(isoDateStr) {
            const date = this.parseIsoLocal(isoDateStr);
            if (isNaN(date.getTime())) return isoDateStr;
            return new Intl.DateTimeFormat(this.locale, this.formatOptions).format(date);
        },

        /**
         * Executes the `_extractIsoDates` operation.
         * @param {any} value Input value for this method.
         * @returns {any} Returns the result of `_extractIsoDates` when applicable.
         */
        _extractIsoDates(value) {
            if (typeof value !== 'string') return [];
            const matches = value.match(/\d{4}-\d{2}-\d{2}/g);
            return matches ?? [];
        },

        /**
         * Executes the `_isValidIsoDate` operation.
         * @param {any} s Input value for this method.
         * @returns {any} Returns the result of `_isValidIsoDate` when applicable.
         */
        _isValidIsoDate(s) {
            if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
            // Logical validation using UTC to avoid DST edge cases
            const [y, m, d] = s.split('-').map(Number);
            const dt = new Date(Date.UTC(y, m - 1, d));
            return dt.getUTCFullYear() === y && (dt.getUTCMonth() + 1) === m && dt.getUTCDate() === d;
        },

        /**
         * Executes the `_normalize` operation.
         * @param {any} input Input value for this method.
         * @returns {any} Returns the result of `_normalize` when applicable.
         */
        _normalize(input) {
            const arr = Array.isArray(input) ? input : [];
            const iso = arr
                .flat(Infinity)
                .flatMap(v => {
                    if (typeof v === 'string') return this._extractIsoDates(v);
                    return []; 
                })
                .filter(s => this._isValidIsoDate(s));

            if (this.mode === 'single') {
                const sorted = [...new Set(iso)].sort();
                return sorted.slice(0, 1);
            }
            if (this.mode === 'multiple-ranged') {
                const sorted = iso.sort();
                if (sorted.length <= 1) return sorted;
                // Clamp to [min, max]
                return [sorted[0], sorted[sorted.length - 1]];
            }
            return [...new Set(iso)].sort(); 
        },

        /**
         * Executes the `parseIsoLocal` operation.
         * @param {any} s Input value for this method.
         * @returns {any} Returns the result of `parseIsoLocal` when applicable.
         */
        parseIsoLocal(s) {
            const [y, m, d] = s.split('-').map(Number);
            return new Date(y, m - 1, d);
        },

        /**
         * Executes the `toLocalISO` operation.
         * @param {any} dateObj Input value for this method.
         * @returns {any} Returns the result of `toLocalISO` when applicable.
         */
        toLocalISO(dateObj) {
            const y = dateObj.getFullYear();
            const m = String(dateObj.getMonth() + 1).padStart(2, '0');
            const d = String(dateObj.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        },

        // --- Public API ---

        setToday() {
            this.dates = this._normalize([this.toLocalISO(new Date())]);
        },

        /**
         * Executes the `addDays` operation.
         * @param {any} n Input value for this method.
         * @returns {any} Returns the result of `addDays` when applicable.
         */
        addDays(n) {
            if (this.dates.length === 0) return;
            const current = this.parseIsoLocal(this.dates[0]);
            if (isNaN(current.getTime())) return;
            current.setDate(current.getDate() + n);
            this.dates = this._normalize([this.toLocalISO(current)]);
        },

        /**
         * Executes the `setDate` operation.
         * @param {any} dateStr Input value for this method.
         * @returns {any} Returns the result of `setDate` when applicable.
         */
        setDate(dateStr) {
            this.dates = this._normalize(dateStr ? [dateStr] : []);
        },

        /**
         * Executes the `clear` operation.
         * @returns {any} Returns the result of `clear` when applicable.
         */
        clear() {
            this.dates = [];
        },
        
        /**
         * Executes the `toggleDate` operation.
         * @param {any} dateStr Input value for this method.
         * @returns {any} Returns the result of `toggleDate` when applicable.
         */
        toggleDate(dateStr) {
            let newDates;
            if (this.dates.includes(dateStr)) {
                newDates = this.dates.filter(d => d !== dateStr);
            } else {
                newDates = [...this.dates, dateStr];
            }
            this.dates = this._normalize(newDates);
        }
    }));
}
