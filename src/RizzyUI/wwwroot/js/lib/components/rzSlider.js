import { require } from '../../runtime/rizzyRequire.js';

export default function rzSlider() {
    return {
        min: 0,
        max: 100,
        step: 1,
        orientation: 'horizontal',
        disabled: false,
        inverted: false,
        minStepsBetweenThumbs: 0,
        values: [],
        activeThumbIndex: null,
        dragging: false,
        trackEl: null,
        thumbEls: [],
        inputEls: [],

        init() {
            const dataset = this.$el.dataset;
            const assets = this.parseJson(dataset.assets, []);
            const nonce = dataset.nonce;

            this.min = this.parseNumber(dataset.min, 0);
            this.max = this.parseNumber(dataset.max, 100);
            this.step = Math.max(this.parseNumber(dataset.step, 1), Number.EPSILON);
            this.orientation = dataset.orientation || 'horizontal';
            this.disabled = this.parseBoolean(dataset.disabled, false);
            this.inverted = this.parseBoolean(dataset.inverted, false);
            this.minStepsBetweenThumbs = Math.max(this.parseNumber(dataset.minStepsBetweenThumbs, 0), 0);
            this.values = this.parseJson(dataset.values, []).map((value) => this.parseNumber(value, this.min));

            this.trackEl = this.$refs.track;
            this.thumbEls = this.$el.querySelectorAll('[data-thumb-index]');
            this.inputEls = this.$el.querySelectorAll('[data-slider-input]');

            this.values = this.applyConstraints(this.values, -1, null);
            this.syncDom();
            this.syncHiddenInputs();

            if (assets.length > 0) {
                require(assets, nonce);
            }
        },

        handlePointerDown(event) {
            if (this.disabled) {
                return;
            }

            const thumbIndex = this.parseThumbIndex(event.currentTarget);
            if (thumbIndex < 0) {
                return;
            }

            this.activeThumbIndex = thumbIndex;
            this.dragging = true;
            event.currentTarget.focus();
            event.preventDefault();
        },

        handlePointerMove(event) {
            if (this.disabled || !this.dragging || this.activeThumbIndex === null) {
                return;
            }

            const value = this.getPointerValue(event);
            this.values[this.activeThumbIndex] = value;
            this.values = this.applyConstraints(this.values, this.activeThumbIndex, value);
            this.syncDom();
            this.syncHiddenInputs();
        },

        handlePointerUp() {
            this.dragging = false;
            this.activeThumbIndex = null;
        },

        handleTrackPointerDown(event) {
            if (this.disabled) {
                return;
            }

            const value = this.getPointerValue(event);
            const thumbIndex = this.getNearestThumbIndex(value);
            if (thumbIndex < 0) {
                return;
            }

            this.activeThumbIndex = thumbIndex;
            this.values[thumbIndex] = value;
            this.values = this.applyConstraints(this.values, thumbIndex, value);
            this.syncDom();
            this.syncHiddenInputs();
            this.focusThumb(thumbIndex);
            event.preventDefault();
        },

        handleThumbKeyDown(event) {
            if (this.disabled) {
                return;
            }

            const thumbIndex = this.parseThumbIndex(event.currentTarget);
            if (thumbIndex < 0) {
                return;
            }

            const largeStep = this.step * 10;
            const current = this.values[thumbIndex] ?? this.min;
            let nextValue = current;

            if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
                nextValue = current + this.step;
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
                nextValue = current - this.step;
            } else if (event.key === 'PageUp') {
                nextValue = current + largeStep;
            } else if (event.key === 'PageDown') {
                nextValue = current - largeStep;
            } else if (event.key === 'Home') {
                nextValue = this.min;
            } else if (event.key === 'End') {
                nextValue = this.max;
            } else {
                return;
            }

            this.values[thumbIndex] = nextValue;
            this.values = this.applyConstraints(this.values, thumbIndex, nextValue);
            this.syncDom();
            this.syncHiddenInputs();
            event.preventDefault();
        },

        syncDom() {
            const normalized = this.values.map((value) => this.valueToPercent(value));
            const minPercent = Math.min(...normalized);
            const maxPercent = Math.max(...normalized);

            if (this.trackEl) {
                this.trackEl.dataset.orientation = this.orientation;
            }

            const rangeEl = this.$refs.range;
            if (rangeEl) {
                rangeEl.dataset.orientation = this.orientation;
                if (this.orientation === 'vertical') {
                    rangeEl.style.bottom = `${minPercent}%`;
                    rangeEl.style.height = `${Math.max(maxPercent - minPercent, 0)}%`;
                    rangeEl.style.left = '0';
                    rangeEl.style.right = '0';
                    rangeEl.style.width = '100%';
                } else {
                    rangeEl.style.left = `${minPercent}%`;
                    rangeEl.style.width = `${Math.max(maxPercent - minPercent, 0)}%`;
                    rangeEl.style.top = '0';
                    rangeEl.style.bottom = '0';
                    rangeEl.style.height = '100%';
                }
            }

            this.thumbEls.forEach((thumbEl) => {
                const index = this.parseThumbIndex(thumbEl);
                const value = this.values[index] ?? this.min;
                const percent = this.valueToPercent(value);
                thumbEl.dataset.orientation = this.orientation;
                thumbEl.setAttribute('aria-valuenow', `${value}`);
                thumbEl.style.position = 'absolute';

                if (this.orientation === 'vertical') {
                    thumbEl.style.left = '50%';
                    thumbEl.style.bottom = `${percent}%`;
                    thumbEl.style.transform = 'translate(-50%, 50%)';
                } else {
                    thumbEl.style.top = '50%';
                    thumbEl.style.left = `${percent}%`;
                    thumbEl.style.transform = 'translate(-50%, -50%)';
                }
            });
        },

        syncHiddenInputs() {
            this.inputEls.forEach((inputEl) => {
                const index = this.parseNumber(inputEl.dataset.inputIndex, 0);
                const value = this.values[index] ?? this.min;
                inputEl.value = `${value}`;
            });
        },

        applyConstraints(values, changedIndex, requestedValue) {
            const count = values.length;
            if (count === 0) {
                return [this.min];
            }

            let constrained = values.map((value) => this.snapValue(value));
            constrained = constrained.map((value) => this.clampValue(value));

            if (changedIndex >= 0 && changedIndex < count) {
                constrained[changedIndex] = this.snapValue(requestedValue ?? constrained[changedIndex]);
                constrained[changedIndex] = this.clampValue(constrained[changedIndex]);
            } else {
                constrained = [...constrained].sort((a, b) => a - b);
            }

            const gap = this.minStepsBetweenThumbs;
            for (let index = 1; index < count; index += 1) {
                const minimum = constrained[index - 1] + gap;
                if (constrained[index] < minimum) {
                    constrained[index] = this.clampValue(this.snapValue(minimum));
                }
            }

            for (let index = count - 2; index >= 0; index -= 1) {
                const maximum = constrained[index + 1] - gap;
                if (constrained[index] > maximum) {
                    constrained[index] = this.clampValue(this.snapValue(maximum));
                }
            }

            return constrained;
        },

        snapValue(value) {
            const snapped = this.min + Math.round((value - this.min) / this.step) * this.step;
            return Number(snapped.toFixed(6));
        },

        getNearestThumbIndex(value) {
            if (this.values.length === 0) {
                return -1;
            }

            let nearestIndex = 0;
            let nearestDistance = Number.MAX_VALUE;

            this.values.forEach((current, index) => {
                const distance = Math.abs(current - value);
                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestIndex = index;
                }
            });

            return nearestIndex;
        },

        getPointerValue(event) {
            if (!this.trackEl) {
                return this.min;
            }

            const rect = this.trackEl.getBoundingClientRect();
            const denominator = this.orientation === 'vertical' ? rect.height : rect.width;
            if (denominator <= 0) {
                return this.min;
            }

            let ratio;
            if (this.orientation === 'vertical') {
                ratio = (rect.bottom - event.clientY) / denominator;
            } else {
                ratio = (event.clientX - rect.left) / denominator;
            }

            ratio = Math.min(Math.max(ratio, 0), 1);
            if (this.inverted) {
                ratio = 1 - ratio;
            }

            const value = this.min + ratio * (this.max - this.min);
            return this.snapValue(this.clampValue(value));
        },

        valueToPercent(value) {
            const range = this.max - this.min;
            if (range <= 0) {
                return 0;
            }

            const normalized = (value - this.min) / range;
            const ratio = this.inverted ? 1 - normalized : normalized;
            return Math.min(Math.max(ratio * 100, 0), 100);
        },

        clampValue(value) {
            return Math.min(Math.max(value, this.min), this.max);
        },

        focusThumb(index) {
            const thumb = this.$el.querySelector(`[data-thumb-index="${index}"]`);
            if (thumb) {
                thumb.focus();
            }
        },

        parseThumbIndex(element) {
            if (!element) {
                return -1;
            }

            return this.parseNumber(element.dataset.thumbIndex, -1);
        },

        parseBoolean(value, fallback) {
            if (value === 'true') {
                return true;
            }

            if (value === 'false') {
                return false;
            }

            return fallback;
        },

        parseNumber(value, fallback) {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : fallback;
        },

        parseJson(value, fallback) {
            try {
                return JSON.parse(value || 'null') ?? fallback;
            } catch {
                return fallback;
            }
        }
    };
}
