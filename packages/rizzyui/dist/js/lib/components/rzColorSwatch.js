// rzColorSwatch.js
//
// Alpine component: rzColorSwatch
//
// Visual-only color swatch primitive for RizzyUI.
// It accepts a color string, validates it, and computes a background style
// (including checkerboard transparency preview for alpha colors).
//
// ──────────────────────────────────────────────────────────────────────────────
// WHY
// ──────────────────────────────────────────────────────────────────────────────
// This component is intentionally focused on presentation:
// - It stores a single `value` (the color string)
// - It derives `swatchStyle` from that value
// - It exposes get/set methods for imperative interop
//
// It is designed to work well in composable Alpine setups:
//
// - Standalone via data-value
// - Bound via x-model (when the Razor/root markup adds `x-modelable="value"`)
// - Updated by a parent/provider component
//
// ──────────────────────────────────────────────────────────────────────────────
// EXPECTED DATA ATTRIBUTES
// ──────────────────────────────────────────────────────────────────────────────
// data-value="..."                 Initial color string
// data-without-transparency="..."  "true" | "false"
// data-disabled="..."              "true" | "false"
//
// Example root markup (Razor output):
// <div x-data="rzColorSwatch"
//      x-modelable="value"
//      data-value="#22c55e"
//      data-without-transparency="false"
//      data-disabled="false">
//   ...
// </div>
//
// Notes:
// - `x-modelable="value"` is added in markup, not in this JS file.
// - The swatch watches `value` and recomputes visual output automatically.
//
// ──────────────────────────────────────────────────────────────────────────────

export default function registerRzColorSwatch(Alpine) {
    Alpine.data('rzColorSwatch', () => ({
        // ──────────────────────────────────────────────────────────────────────
        // STATE
        // ──────────────────────────────────────────────────────────────────────
        value: '',
        withoutTransparency: false,
        isDisabled: false,

        // Derived inline style string used by the swatch element.
        swatchStyle: '',

        // ──────────────────────────────────────────────────────────────────────
        // LIFECYCLE
        // ──────────────────────────────────────────────────────────────────────
        init() {
            // Initialize from data-* attributes
            this.value = this.readValue(this.$el.dataset.value);
            this.withoutTransparency = this.readBool(this.$el.dataset.withoutTransparency);
            this.isDisabled = this.readBool(this.$el.dataset.disabled);

            // React to value changes from any source:
            // - setValue(...)
            // - direct assignment
            // - Alpine x-model / x-modelable bindings
            //
            // We normalize first. If normalization changes the value, we write it
            // back once and let the watcher rerun with the stabilized value.
            // This avoids infinite loops while still keeping all updates normalized.
            this.$watch('value', (next) => {
                const normalized = this.readValue(next);

                if (normalized !== next) {
                    this.value = normalized;
                    return;
                }

                this.refreshSwatch();
            });

            // If transparency mode changes dynamically, recalc the swatch.
            this.$watch('withoutTransparency', () => {
                this.refreshSwatch();
            });

            // Initial paint
            this.refreshSwatch();
        },

        // ──────────────────────────────────────────────────────────────────────
        // PUBLIC API (imperative interop)
        // ──────────────────────────────────────────────────────────────────────
        getValue() {
            return this.value;
        },

        setValue(value) {
            // Do not call refresh here; watcher owns normalization + visual updates.
            this.value = value;
        },

        // Optional helper if parent code needs to toggle checkerboard behavior.
        setWithoutTransparency(value) {
            this.withoutTransparency = !!value;
        },

        // ──────────────────────────────────────────────────────────────────────
        // NORMALIZATION / PARSING
        // ──────────────────────────────────────────────────────────────────────
        readBool(value) {
            return value === 'true';
        },

        readValue(value) {
            if (typeof value !== 'string') return '';
            return value.trim();
        },

        // ──────────────────────────────────────────────────────────────────────
        // COLOR INSPECTION
        // ──────────────────────────────────────────────────────────────────────
        isCssColor(value) {
            try {
                // Browser-native validation if available
                if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
                    return CSS.supports('color', value);
                }

                // If CSS.supports is unavailable, fail open (legacy fallback)
                return true;
            } catch {
                return false;
            }
        },

        hasAlpha(value) {
            const normalized = value.trim().toLowerCase();

            // Named transparent keyword
            if (normalized === 'transparent') return true;

            // #RGBA or #RRGGBBAA
            if (/^#(?:[0-9a-f]{4}|[0-9a-f]{8})$/i.test(normalized)) return true;

            // rgba(...) / hsla(...)
            if (/\b(?:rgba|hsla)\s*\(/i.test(normalized)) return true;

            // CSS Color 4 syntax with slash alpha:
            // rgb(... / .5), hsl(... / 50%), lab(... / .2), oklch(... / .8), etc.
            if (/\b(?:rgb|hsl|lab|lch|oklab|oklch|color)\s*\([^)]*\/\s*[\d.]+%?\s*\)/i.test(normalized)) {
                return true;
            }

            return false;
        },

        // ──────────────────────────────────────────────────────────────────────
        // STYLE COMPUTATION
        // ──────────────────────────────────────────────────────────────────────
        getEmptyStyle() {
            // "No color" visual: transparent bg with a diagonal destructive slash
            return [
                'background:',
                'linear-gradient(',
                'to bottom right,',
                'transparent calc(50% - 1px),',
                'hsl(var(--destructive)) calc(50% - 1px) calc(50% + 1px),',
                'transparent calc(50% + 1px)',
                ') no-repeat;'
            ].join(' ');
        },

        getInvalidStyle() {
            // Invalid CSS color string: render as transparent.
            // (You could optionally add a warning pattern later.)
            return 'background-color: transparent;';
        },

        getSolidColorStyle(color) {
            return `background-color: ${color};`;
        },

        getAlphaPreviewStyle(color) {
            // Layer 1: actual color
            // Layer 2: checkerboard transparency pattern
            return [
                `background: linear-gradient(${color}, ${color}),`,
                'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%)',
                '0% 50% / 10px 10px;'
            ].join(' ');
        },

        refreshSwatch() {
            const color = this.value;

            if (!color) {
                this.swatchStyle = this.getEmptyStyle();
                return;
            }

            if (!this.isCssColor(color)) {
                this.swatchStyle = this.getInvalidStyle();
                return;
            }

            if (!this.withoutTransparency && this.hasAlpha(color)) {
                this.swatchStyle = this.getAlphaPreviewStyle(color);
                return;
            }

            this.swatchStyle = this.getSolidColorStyle(color);
        }
    }));
}