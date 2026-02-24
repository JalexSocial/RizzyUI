export default function registerRzChart(Alpine, require) {
    Alpine.data('rzChart', () => ({
        chartInstance: null,
        themeChangeHandler: null,

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

            let rawConfig = {};
            try {
                rawConfig = JSON.parse(configEl.textContent || '{}');
            } catch (error) {
                console.error('[rzChart] Failed to parse JSON configuration.', error);
                return;
            }

            this.resolveColorValues(rawConfig);
            this.resolveCallbacks(rawConfig);

            if (rawConfig.options) {
                rawConfig.options.responsive = rawConfig.options.responsive ?? true;
                rawConfig.options.maintainAspectRatio = rawConfig.options.maintainAspectRatio ?? false;
            }

            const canvas = this.$refs.canvas;
            if (!canvas) {
                console.error('[rzChart] Canvas reference was not found.');
                return;
            }

            this.chartInstance = new window.Chart(canvas, rawConfig);

            this.themeChangeHandler = () => {
                if (this.chartInstance) {
                    this.chartInstance.update();
                }
            };

            window.addEventListener('rz:theme-change', this.themeChangeHandler);
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
            if (this.themeChangeHandler) {
                window.removeEventListener('rz:theme-change', this.themeChangeHandler);
                this.themeChangeHandler = null;
            }

            if (this.chartInstance) {
                this.chartInstance.destroy();
                this.chartInstance = null;
            }
        }
    }));
}
