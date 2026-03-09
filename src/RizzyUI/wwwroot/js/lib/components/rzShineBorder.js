export default function (Alpine) {
    Alpine.data('rzShineBorder', () => ({
        computedStyle: '',

        init() {
            const dataset = this.$el.dataset;
            const borderWidth = Math.max(this.parseNumber(dataset.borderWidth, 1), 0);
            const duration = this.parseNumber(dataset.duration, 14) > 0
                ? this.parseNumber(dataset.duration, 14)
                : 14;
            const shineColor = typeof dataset.shineColor === 'string' ? dataset.shineColor.trim() : '';
            const shineColors = this.parseJson(dataset.shineColors, [])
                .filter((value) => typeof value === 'string')
                .map((value) => value.trim())
                .filter((value) => value.length > 0);

            const fallbackColors = [
                'var(--color-border)',
                'color-mix(in oklab, var(--color-border) 75%, transparent)',
            ];

            const gradientColors = shineColors.length > 0
                ? shineColors.join(',')
                : (shineColor.length > 0 ? shineColor : fallbackColors.join(','));

            this.computedStyle = [
                `--border-width:${borderWidth}px`,
                `--duration:${duration}s`,
                `background-image:radial-gradient(transparent,transparent,${gradientColors},transparent,transparent)`,
                'background-size:300% 300%',
                'mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)',
                '-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)',
                '-webkit-mask-composite:xor',
                'mask-composite:exclude',
                'padding:var(--border-width)',
            ].join(';');
        },

        parseNumber(value, fallback) {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : fallback;
        },

        parseJson(value, fallback) {
            if (typeof value !== 'string' || value.length === 0) {
                return fallback;
            }

            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : fallback;
            } catch {
                return fallback;
            }
        },
    }));
}
