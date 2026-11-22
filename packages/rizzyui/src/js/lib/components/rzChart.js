import { require } from '../../runtime/rizzyRequire.js';

export default function rzChart() {
    // SF-062: Chart.js does not work through Alpine's reactive proxy (update() and destroy() on a
    // proxied instance throw or leave the real chart registered), so the instance, the unresolved
    // configuration and the theme listener live in this closure, outside the component's data.
    let chart = null;
    let configSource = null;
    let onThemeChange = null;

    return {

        init() {
            const assetsToLoad = JSON.parse(this.$el.dataset.assets || '[]');
            const nonce = this.$el.dataset.nonce || '';
            const configScriptId = this.$el.dataset.configId;

            if (assetsToLoad.length > 0 && typeof require === 'function') {
                require(assetsToLoad, {
                    success: () => this.tryInitializeChart(configScriptId),
                    error: (error) => console.error('[rzChart] Failed to load Chart.js assets.', error)
                }, nonce);
                return;
            }

            this.tryInitializeChart(configScriptId);
        },

        tryInitializeChart(configScriptId) {
            if (!window.Chart) {
                console.error('[rzChart] Chart.js was not found on window.');
                return;
            }

            const configEl = document.getElementById(configScriptId);
            if (!configEl) {
                console.error(`[rzChart] Could not find configuration script with ID: ${configScriptId}`);
                return;
            }

            configSource = configEl.textContent || '{}';
            const config = this.buildConfig();
            if (!config) {
                return;
            }

            const canvas = this.$refs.canvas;
            if (!canvas) {
                console.error('[rzChart] Canvas reference was not found.');
                return;
            }

            chart = new window.Chart(canvas, config);

            // SF-005: CSS variable colors are resolved when the configuration is built, so a theme
            // change resolves them again from the unresolved source.
            onThemeChange = () => this.applyTheme();
            window.addEventListener('rz:theme-change', onThemeChange);
        },

        /** The Chart.js instance (not proxied), or null before the chart is created. */
        getChart() {
            return chart;
        },

        /** Parses the configuration source and resolves colors, callbacks, type and defaults. */
        buildConfig() {
            let config;
            try {
                config = JSON.parse(configSource || '{}');
            } catch (error) {
                console.error('[rzChart] Failed to parse JSON configuration.', error);
                return null;
            }

            // SF-059: Chart.js applies a chart type's defaults (a doughnut's legend, tooltips and
            // interaction) from the config's type, so default it to the first dataset's type.
            if (!config.type) {
                const firstType = config.data?.datasets?.find((dataset) => dataset?.type)?.type;
                if (firstType) {
                    config.type = firstType;
                }
            }

            this.resolveColorValues(config);
            this.resolveCallbacks(config);

            if (config.options) {
                config.options.responsive = config.options.responsive ?? true;
                config.options.maintainAspectRatio = config.options.maintainAspectRatio ?? false;
            }

            return config;
        },

        /** Re-resolves theme colors and redraws without animation. */
        applyTheme() {
            if (!chart) {
                return;
            }

            const config = this.buildConfig();
            if (!config) {
                return;
            }

            if (config.options) {
                chart.options = config.options;
            }

            const datasets = config.data?.datasets ?? [];
            chart.data.datasets.forEach((dataset, index) => {
                const fresh = datasets[index];
                if (!fresh) return;
                for (const key of Object.keys(fresh)) {
                    if (key.toLowerCase().includes('color')) {
                        dataset[key] = fresh[key];
                    }
                }
            });

            chart.update('none');
        },


        resolveColorValues(config) {
            const walk = (value) => {
                if (Array.isArray(value)) {
                    return value.map((item) => walk(item));
                }

                if (!value || typeof value !== 'object') {
                    return value;
                }

                for (const key of Object.keys(value)) {
                    const currentValue = value[key];

                    if (typeof key === 'string' && key.toLowerCase().includes('color')) {
                        if (Array.isArray(currentValue)) {
                            value[key] = currentValue.map((entry) => this._resolveColor(entry));
                            continue;
                        }

                        if (currentValue && typeof currentValue === 'object') {
                            walk(currentValue);
                            continue;
                        }

                        value[key] = this._resolveColor(currentValue);
                        continue;
                    }

                    if (currentValue && typeof currentValue === 'object') {
                        walk(currentValue);
                    }
                }

                return value;
            };

            walk(config);
        },

        _resolveColor(color, el = document.documentElement) {
            if (typeof color !== 'string') {
                return color;
            }

            const value = color.trim();

            if (!value.startsWith('var(')) {
                return value;
            }

            const inner = value.slice(4, -1).trim();
            const [varName, fallback] = inner.split(',').map((part) => part.trim());

            if (!varName) {
                return value;
            }

            const resolved = getComputedStyle(el).getPropertyValue(varName).trim();

            return resolved || fallback || value;
        },

        resolveCallbacks(config) {
            if (!config || !config.options) {
                return;
            }

            const resolveStringFn = (fnName) => {
                if (typeof fnName !== 'string') {
                    return fnName;
                }

                const parts = fnName.replace('window.', '').split('.');
                let context = window;

                for (const part of parts) {
                    if (context[part] === undefined) {
                        return fnName;
                    }
                    context = context[part];
                }

                return typeof context === 'function' ? context : fnName;
            };

            if (config.options.plugins?.tooltip?.callbacks) {
                const callbacks = config.options.plugins.tooltip.callbacks;
                for (const key of Object.keys(callbacks)) {
                    callbacks[key] = resolveStringFn(callbacks[key]);
                }
            }

            if (config.options.scales) {
                for (const scaleKey of Object.keys(config.options.scales)) {
                    const scale = config.options.scales[scaleKey];
                    if (scale.ticks && scale.ticks.callback) {
                        scale.ticks.callback = resolveStringFn(scale.ticks.callback);
                    }
                }
            }
        },

        destroy() {
            if (onThemeChange) {
                window.removeEventListener('rz:theme-change', onThemeChange);
                onThemeChange = null;
            }

            if (chart) {
                chart.destroy();
                chart = null;
            }
        }
    };
}
