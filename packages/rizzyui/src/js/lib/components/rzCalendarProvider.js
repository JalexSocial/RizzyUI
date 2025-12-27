
export default function(Alpine) {
    Alpine.data('rzCalendarProvider', () => ({
        // --- Public State ---
        mode: 'single', 
        dates: [], // Canonical state: Flat array of ISO strings ['YYYY-MM-DD', ...], always sorted/unique
        
        // --- Internal ---
        calendarApi: null,
        _isUpdatingFromCalendar: false,
        _lastAppliedState: null,
        _handlers: [], // Store handlers for cleanup

        // --- Computed Helpers ---
        get date() { return this.dates[0] || ''; },
        set date(val) { this.setDate(val); },

        get startDate() { return this.dates[0] || ''; },
        get endDate() { return this.dates[this.dates.length - 1] || ''; },
        get isRangeComplete() { return this.mode === 'multiple-ranged' && this.dates.length >= 2; },

        // --- Lifecycle ---
        init() {
            this.mode = this.$el.dataset.mode || 'single';
            try { 
                const rawDates = JSON.parse(this.$el.dataset.initialDates || '[]'); 
                this.dates = this._normalize(rawDates);
            } catch (e) { 
                this.dates = []; 
            }

            // 1. Capture Calendar Instance
            // RzCalendar emits 'rz:calendar:init'
            const initHandler = (e) => {
                this.calendarApi = e.detail.instance;
                this.syncToCalendar();
            };
            this.$el.addEventListener('rz:calendar:init', initHandler);
            this._handlers.push({ type: 'rz:calendar:init', fn: initHandler });

            // 2. Listen for Destroy (Cleanup)
            const destroyHandler = () => {
                this.calendarApi = null;
                this._lastAppliedState = null;
            };
            this.$el.addEventListener('rz:calendar:destroy', destroyHandler);
            this._handlers.push({ type: 'rz:calendar:destroy', fn: destroyHandler });

            // 3. Listen for Selection
            // RzCalendar emits 'rz:calendar:click-day'
            const clickHandler = (e) => {
                this._isUpdatingFromCalendar = true;
                
                // Track completion state transition
                const wasComplete = this.isRangeComplete;

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

            // 4. Watch for External Changes (Inputs/Buttons/Presets)
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

        destroy() {
            // Cleanup event listeners to prevent leaks in SPA/HTMX scenarios
            this._handlers.forEach(h => this.$el.removeEventListener(h.type, h.fn));
            this._handlers = [];
        },

        // --- Synchronization Logic ---
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
            let selectedMonth, selectedYear;
            let canFocus = false;

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
        
        _extractIsoDates(value) {
            if (typeof value !== 'string') return [];
            const matches = value.match(/\d{4}-\d{2}-\d{2}/g);
            return matches ?? [];
        },

        _isValidIsoDate(s) {
            if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
            // Logical validation using UTC to avoid DST edge cases
            const [y, m, d] = s.split('-').map(Number);
            const dt = new Date(Date.UTC(y, m - 1, d));
            return dt.getUTCFullYear() === y && (dt.getUTCMonth() + 1) === m && dt.getUTCDate() === d;
        },

        _normalize(input) {
            const arr = Array.isArray(input) ? input : [];

            // 1. Flatten nested arrays, handle strings, and extract potential range strings
            const iso = arr
                .flat(Infinity)
                .flatMap(v => {
                    if (typeof v === 'string') return this._extractIsoDates(v);
                    return []; 
                })
                .filter(s => this._isValidIsoDate(s));

            // 2. Per-Mode Logic
            if (this.mode === 'single') {
                const sorted = [...new Set(iso)].sort();
                return sorted.slice(0, 1);
            }
            
            if (this.mode === 'multiple-ranged') {
                // In range mode, do not dedupe immediately; [A, A] is a valid 1-day range
                const sorted = iso.sort();
                
                if (sorted.length <= 1) return sorted; // Return [] or [start]
                return [sorted[0], sorted[sorted.length - 1]]; // Return [start, end]
            }

            // Multiple: Dedupe and sort
            return [...new Set(iso)].sort(); 
        },

        // Parse YYYY-MM-DD as local time (00:00:00)
        parseIsoLocal(s) {
            const [y, m, d] = s.split('-').map(Number);
            return new Date(y, m - 1, d);
        },

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
            if (this.dates.includes(dateStr)) {
                newDates = this.dates.filter(d => d !== dateStr);
            } else {
                newDates = [...this.dates, dateStr];
            }
            this.dates = this._normalize(newDates);
        }
    }));
}