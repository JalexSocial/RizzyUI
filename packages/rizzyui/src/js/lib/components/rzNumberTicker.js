export default function rzNumberTicker() {
    return {
        targetValue: 0,
        startValue: 0,
        currentValue: 0,
        destinationValue: 0,
        direction: 'up',
        delayMs: 0,
        decimalPlaces: 0,
        culture: '',
        useGrouping: true,
        triggerOnView: true,
        animateOnce: true,
        disableAnimation: false,
        hasAnimated: false,
        observer: null,
        rafId: null,
        delayTimer: null,
        animationStartTimestamp: 0,
        animationStartValue: 0,
        animationDurationMs: 1200,

        init() {
            this.configure();

            if (this.disableAnimation || this.targetValue === this.startValue || !this.canSafelyAnimate()) {
                this.setDisplay(this.destinationValue);
                return;
            }

            if (this.triggerOnView) {
                this.observe();
                return;
            }

            this.startAnimation();
        },

        configure() {
            const dataset = this.$el.dataset;
            this.targetValue = this.parseNumber(dataset.value, 0);
            this.startValue = this.parseNumber(dataset.startValue, 0);
            this.direction = (dataset.direction || 'up').toLowerCase() === 'down' ? 'down' : 'up';
            this.delayMs = Math.max(0, this.parseNumber(dataset.delay, 0) * 1000);
            this.decimalPlaces = Math.max(0, this.parseInteger(dataset.decimalPlaces, 0));
            this.culture = (dataset.culture || '').trim();
            this.useGrouping = this.parseBoolean(dataset.useGrouping, true);
            this.triggerOnView = this.parseBoolean(dataset.triggerOnView, true);
            this.animateOnce = this.parseBoolean(dataset.animateOnce, true);
            this.disableAnimation = this.parseBoolean(dataset.disableAnimation, false);

            this.currentValue = this.direction === 'down' ? this.targetValue : this.startValue;
            this.destinationValue = this.direction === 'down' ? this.startValue : this.targetValue;

            const distance = Math.abs(this.destinationValue - this.currentValue);
            this.animationDurationMs = this.resolveDuration(distance);
        },

        observe() {
            if (typeof IntersectionObserver !== 'function') {
                this.startAnimation();
                return;
            }

            this.observer = new IntersectionObserver((entries) => {
                this.handleIntersect(entries);
            }, { threshold: 0.1 });

            this.observer.observe(this.$el);
        },

        handleIntersect(entries) {
            for (const entry of entries) {
                if (!entry.isIntersecting) {
                    continue;
                }

                if (this.animateOnce && this.hasAnimated) {
                    return;
                }

                this.startAnimation();

                if (this.animateOnce && this.observer) {
                    this.observer.disconnect();
                    this.observer = null;
                }

                return;
            }
        },

        startAnimation() {
            this.cleanupAnimation();

            this.currentValue = this.direction === 'down' ? this.targetValue : this.startValue;
            this.animationStartValue = this.currentValue;
            this.animationStartTimestamp = 0;
            this.setDisplay(this.currentValue);

            this.delayTimer = window.setTimeout(() => {
                this.delayTimer = null;
                this.rafId = window.requestAnimationFrame((timestamp) => this.tick(timestamp));
            }, this.delayMs);
        },

        tick(timestamp) {
            if (this.animationStartTimestamp === 0) {
                this.animationStartTimestamp = timestamp;
            }

            const elapsed = Math.max(0, timestamp - this.animationStartTimestamp);
            const progress = Math.min(1, elapsed / this.animationDurationMs);
            const easedProgress = this.easeOutCubic(progress);

            const nextValue = this.interpolate(this.animationStartValue, this.destinationValue, easedProgress);
            this.currentValue = this.clampToDirection(nextValue);
            this.setDisplay(this.currentValue);

            if (progress >= 1) {
                this.complete();
                return;
            }

            this.rafId = window.requestAnimationFrame((nextTimestamp) => this.tick(nextTimestamp));
        },

        formatNumber(value) {
            const rounded = Number(value.toFixed(this.decimalPlaces));

            const format = (locale) => new Intl.NumberFormat(locale, {
                minimumFractionDigits: this.decimalPlaces,
                maximumFractionDigits: this.decimalPlaces,
                useGrouping: this.useGrouping,
            }).format(rounded);

            try {
                if (this.culture) {
                    return format(this.culture);
                }
            } catch (_) {
            }

            try {
                if (navigator.language) {
                    return format(navigator.language);
                }
            } catch (_) {
            }

            return format('en-US');
        },

        setDisplay(value) {
            if (this.$refs.value) {
                this.$refs.value.textContent = this.formatNumber(value);
            }
        },

        complete() {
            this.currentValue = this.destinationValue;
            this.hasAnimated = true;
            this.setDisplay(this.destinationValue);
            this.cleanupAnimation();
        },

        cleanupAnimation() {
            if (this.delayTimer !== null) {
                window.clearTimeout(this.delayTimer);
                this.delayTimer = null;
            }

            if (this.rafId !== null) {
                window.cancelAnimationFrame(this.rafId);
                this.rafId = null;
            }
        },

        cleanup() {
            this.cleanupAnimation();

            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
        },

        canSafelyAnimate() {
            const inSafeRange = (value) => Number.isFinite(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER;
            return inSafeRange(this.startValue) && inSafeRange(this.targetValue);
        },

        resolveDuration(distance) {
            if (distance < 10) {
                return 700;
            }

            if (distance < 100) {
                return 900;
            }

            if (distance < 1_000) {
                return 1200;
            }

            return 1500;
        },

        interpolate(from, to, progress) {
            return from + ((to - from) * progress);
        },

        clampToDirection(value) {
            if (this.direction === 'down') {
                return Math.max(this.destinationValue, value);
            }

            return Math.min(this.destinationValue, value);
        },

        easeOutCubic(progress) {
            return 1 - Math.pow(1 - progress, 3);
        },

        parseNumber(value, fallback) {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : fallback;
        },

        parseInteger(value, fallback) {
            const parsed = Number.parseInt(value, 10);
            return Number.isFinite(parsed) ? parsed : fallback;
        },

        parseBoolean(value, fallback) {
            if (typeof value !== 'string') {
                return fallback;
            }

            if (value.toLowerCase() === 'true') {
                return true;
            }

            if (value.toLowerCase() === 'false') {
                return false;
            }

            return fallback;
        },
    };
}
