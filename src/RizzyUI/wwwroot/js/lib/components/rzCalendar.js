export default function(Alpine, require) {
    Alpine.data('rzCalendar', () => ({
        calendar: null,
        initialized: false,

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

            // Define all supported VCP actions and map them to custom events
            const actionHandlers = {
                clickDay: (e, self) => this.dispatchCalendarEvent('clickDay', { event: e, dates: self.selectedDates }),
                clickWeekNumber: (e, number, days, year) => this.dispatchCalendarEvent('clickWeekNumber', { event: e, number, days, year }),
                clickMonth: (e, month) => this.dispatchCalendarEvent('clickMonth', { event: e, month }),
                clickYear: (e, year) => this.dispatchCalendarEvent('clickYear', { event: e, year }),
                clickArrow: (e, year, month) => this.dispatchCalendarEvent('clickArrow', { event: e, year, month }),
                changeTime: (e, time, hours, minutes, keeping) => this.dispatchCalendarEvent('changeTime', { event: e, time, hours, minutes, keeping }),
                changeView: (view) => this.dispatchCalendarEvent('changeView', { view }),
                getDays: (day, date, HTMLElement, HTMLButtonElement, self) => {
                    // getDays is called during rendering, we can treat it as a hook but be careful about spamming events
                }
            };

            // Merge specialized logic
            const options = {
                ...rawConfig.options,
                styles: rawConfig.styles, // Correct property name for VCP
                actions: actionHandlers
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

        dispatchCalendarEvent(eventName, detail) {
            // Dispatch with prefix 'rz:calendar:'
            this.$dispatch(`rz:calendar:${eventName}`, detail);
        },

        destroy() {
            if (this.calendar) {
                this.calendar.destroy();
                this.dispatchCalendarEvent('destroy', {});
            }
        }
    }));
}