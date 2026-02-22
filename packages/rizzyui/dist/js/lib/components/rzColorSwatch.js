export default function(Alpine) {
    Alpine.data('rzColorSwatch', () => ({
        value: '',
        withoutTransparency: false,
        isDisabled: false,
        swatchStyle: '',

        init() {
            this.value = this.readValue(this.$el.dataset.value);
            this.withoutTransparency = this.$el.dataset.withoutTransparency === 'true';
            this.isDisabled = this.$el.dataset.disabled === 'true';
            this.refreshSwatch();
        },

        getValue() {
            return this.value;
        },

        setValue(value) {
            this.value = this.readValue(value);
            this.refreshSwatch();
        },

        readValue(value) {
            if (typeof value !== 'string') {
                return '';
            }

            return value.trim();
        },

        isCssColor(value) {
            try {
                return typeof CSS !== 'undefined' && typeof CSS.supports === 'function'
                    ? CSS.supports('color', value)
                    : true;
            } catch {
                return false;
            }
        },

        hasAlpha(value) {
            const normalized = value.trim().toLowerCase();

            if (normalized === 'transparent') {
                return true;
            }

            if (/^#(?:[0-9a-f]{4}|[0-9a-f]{8})$/i.test(normalized)) {
                return true;
            }

            if (/\b(?:rgba|hsla)\s*\(/i.test(normalized)) {
                return true;
            }

            if (/\b(?:rgb|hsl|lab|lch|oklab|oklch|color)\s*\([^)]*\/\s*[\d.]+%?\s*\)/i.test(normalized)) {
                return true;
            }

            return false;
        },

        refreshSwatch() {
            if (!this.value) {
                this.swatchStyle = 'background: linear-gradient(to bottom right, transparent calc(50% - 1px), hsl(var(--destructive)) calc(50% - 1px) calc(50% + 1px), transparent calc(50% + 1px)) no-repeat;';
                return;
            }

            if (!this.isCssColor(this.value)) {
                this.swatchStyle = 'background-color: transparent;';
                return;
            }

            if (!this.withoutTransparency && this.hasAlpha(this.value)) {
                this.swatchStyle = 'background: linear-gradient(' + this.value + ', ' + this.value + '), repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0% 50% / 10px 10px;';
                return;
            }

            this.swatchStyle = 'background-color: ' + this.value + ';';
        }
    }));
}
