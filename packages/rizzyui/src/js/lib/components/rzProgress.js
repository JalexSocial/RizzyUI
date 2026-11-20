// --------------------------------------------------------------------------------
// Alpine.js component: rzProgress
//
// State for RzProgress: the value, its range, and the derived percentage. The markup binds to it:
// the track's aria-valuenow / aria-valuetext / data-state, and the indicator's position
// (ProgressIndicator: x-bind:style="indicatorStyle"). No layout is measured: the indicator is a
// full-width bar moved left (CSS `translate`) by the part that is not done, so resizing needs no
// script. The inline `translate` overrides the indicator's `-translate-x-full` class, which keeps
// the bar empty until the runtime starts.
//
// Client API (for example through Rizzy.$data(el)): setProgress(value, valueText?),
// increment(step = 1), decrement(step = 1), setIndeterminate(), and the read-only percentage.
// --------------------------------------------------------------------------------

function toNumber(raw, fallback) {
    if (raw === null || raw === undefined || raw === '') return fallback;
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
}

export default function rzProgress() {
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
            this.valueText = element.getAttribute('aria-valuetext');
        },

        /** Whether the progress is unknown (no value). */
        get indeterminate() {
            return this.value === null;
        },

        /** The value as a percentage of the range, clamped to 0–100; 0 when indeterminate. */
        get percentage() {
            if (this.value === null || this.max <= this.min) return 0;
            const percent = ((this.value - this.min) / (this.max - this.min)) * 100;
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
            if (this.value === null) return 'indeterminate';
            return this.value >= this.max ? 'complete' : 'loading';
        },

        /** The indicator's style: moved left by the part that is not done (none when indeterminate). */
        indicatorStyle() {
            if (this.value === null) return { translate: '' };
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
        },
    };
}
