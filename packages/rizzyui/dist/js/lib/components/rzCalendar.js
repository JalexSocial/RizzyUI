export default function(Alpine, require) {
    Alpine.data('rzCalendar', () => ({
        calendar: null,
        initialized: false,

        /**
         * Executes the `init` operation.
         * @returns {any} Returns the result of `init` when applicable.
         */
        init() {
            const assets = JSON.parse(this.$el.dataset.assets || '[]');
            const configId = this.$el.dataset.configId;
            const nonce = this.$el.dataset.nonce;

            if (assets.length === 0) {
                console.warn('RzCalendar: No assets configured.');
                return;
            }

            // Wait for assets to load
            require(assets, {
                success: () => {
                    this.initCalendar(configId);
                },
                error: (e) => console.error("RzCalendar: Failed to load assets", e)
            }, nonce);
        },

        /**
         * Executes the `initCalendar` operation.
         * @param {any} configId Input value for this method.
         * @returns {any} Returns the result of `initCalendar` when applicable.
         */
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

            // Define VCP v3 compatible event handlers based on options.ts
            // These map VCP callbacks to RizzyUI standardized kebab-case DOM events
            const eventHandlers = {
                onClickDate: (self, e) => {
                    this.dispatchCalendarEvent('click-day', {
                        event: e,
                        dates: self.context.selectedDates
                    });
                },
                onClickWeekNumber: (self, number, year, dateEls, e) => {
                    this.dispatchCalendarEvent('click-week-number', {
                        event: e,
                        number: number,
                        year: year,
                        days: dateEls
                    });
                },
                onClickMonth: (self, e) => {
                    this.dispatchCalendarEvent('click-month', {
                        event: e,
                        month: self.context.selectedMonth
                    });
                },
                onClickYear: (self, e) => {
                    this.dispatchCalendarEvent('click-year', {
                        event: e,
                        year: self.context.selectedYear
                    });
                },
                onClickArrow: (self, e) => {
                    this.dispatchCalendarEvent('click-arrow', {
                        event: e,
                        year: self.context.selectedYear,
                        month: self.context.selectedMonth
                    });
                },
                onChangeTime: (self, e, isError) => {
                    this.dispatchCalendarEvent('change-time', {
                        event: e,
                        time: self.context.selectedTime,
                        hours: self.context.selectedHours,
                        minutes: self.context.selectedMinutes,
                        keeping: self.context.selectedKeeping,
                        isError: isError
                    });
                }
            };

            // Merge specialized logic
            // Note: VCP v3 expects styles and handlers at the root level of options
            const options = {
                ...rawConfig.options,
                styles: rawConfig.styles,
                ...eventHandlers
            };

            // Initialize VCP
            if (window.VanillaCalendarPro) {
                this.calendar = new VanillaCalendarPro.Calendar(this.$refs.calendarEl, options);
                this.calendar.init();
                this.initialized = true;

                // Dispatch init event
                this.dispatchCalendarEvent('init', { instance: this.calendar });
            } else {
                console.error("RzCalendar: VanillaCalendar global not found.");
            }
        },

        /**
         * Executes the `dispatchCalendarEvent` operation.
         * @param {any} eventName Input value for this method.
         * @param {any} detail Input value for this method.
         * @returns {any} Returns the result of `dispatchCalendarEvent` when applicable.
         */
        dispatchCalendarEvent(eventName, detail) {
            // Dispatch with prefix 'rz:calendar:'
            // Resulting events: 'rz:calendar:click-day', 'rz:calendar:change-time', etc.
            this.$dispatch(`rz:calendar:${eventName}`, detail);
        },

        /**
         * Executes the `destroy` operation.
         * @returns {any} Returns the result of `destroy` when applicable.
         */
        destroy() {
            if (this.calendar) {
                this.calendar.destroy();
                this.dispatchCalendarEvent('destroy', {});
            }
        }
    }));
}
