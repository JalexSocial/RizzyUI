
export default function (Alpine, require) {
    // Helper: read JSON from <script type="application/json" id="...">
    function parseJsonFromScriptId(id) {
        if (!id) return {};
        const el = document.getElementById(id);
        if (!el) {
            console.warn(`[rzCarousel] JSON script element #${id} not found.`);
            return {};
        }
        try {
            return JSON.parse(el.textContent || '{}');
        } catch (e) {
            console.error(`[rzCarousel] Failed to parse JSON from #${id}:`, e);
            return {};
        }
    }

    Alpine.data('rzCarousel', () => ({
        emblaApi: null,
        canScrollPrev: false,
        canScrollNext: false,
        selectedIndex: 0,
        scrollSnaps: [],

        /**
         * Executes the `init` operation.
         * @returns {any} Returns the result of `init` when applicable.
         */
        init() {
            const assetsToLoad = (() => {
                try { return JSON.parse(this.$el.dataset.assets || '[]'); }
                catch (e) { console.error('[rzCarousel] Bad assets JSON:', e); return []; }
            })();

            const nonce = this.$el.dataset.nonce || '';
            const config = parseJsonFromScriptId(this.$el.dataset.config);
            const options = config.Options || {};
            const pluginsConfig = config.Plugins || [];
            const self = this;

            if (assetsToLoad.length > 0 && typeof require === 'function') {
                require(
                    assetsToLoad,
                    {
                        /**
                         * Executes the `success` operation.
                         * @returns {any} Returns the result of `success` when applicable.
                         */
                        success() {
                            if (window.EmblaCarousel) {
                                self.initializeEmbla(options, pluginsConfig);
                            } else {
                                console.error('[rzCarousel] EmblaCarousel not found on window after loading assets.');
                            }
                        },
                        /**
                         * Executes the `error` operation.
                         * @param {any} err Input value for this method.
                         * @returns {any} Returns the result of `error` when applicable.
                         */
                        error(err) {
                            console.error('[rzCarousel] Failed to load EmblaCarousel assets.', err);
                        }
                    },
                    nonce
                );
            } else {
                if (window.EmblaCarousel) {
                    this.initializeEmbla(options, pluginsConfig);
                } else {
                    console.error('[rzCarousel] EmblaCarousel not found and no assets specified for loading.');
                }
            }
        },

        /**
         * Executes the `initializeEmbla` operation.
         * @param {any} options Input value for this method.
         * @param {any} pluginsConfig Input value for this method.
         * @returns {any} Returns the result of `initializeEmbla` when applicable.
         */
        initializeEmbla(options, pluginsConfig) {
            const viewport = this.$el.querySelector('[x-ref="viewport"]');
            if (!viewport) {
                console.error('[rzCarousel] Carousel viewport with x-ref="viewport" not found.');
                return;
            }

            const instantiatedPlugins = this.instantiatePlugins(pluginsConfig);

            this.emblaApi = window.EmblaCarousel(viewport, options, instantiatedPlugins);
            this.emblaApi.on('select', this.onSelect.bind(this));
            this.emblaApi.on('reInit', this.onSelect.bind(this));
            this.onSelect();
        },

        /**
         * Executes the `instantiatePlugins` operation.
         * @param {any} pluginsConfig Input value for this method.
         * @returns {any} Returns the result of `instantiatePlugins` when applicable.
         */
        instantiatePlugins(pluginsConfig) {
            if (!Array.isArray(pluginsConfig) || pluginsConfig.length === 0) {
                return [];
            }

            return pluginsConfig.map(pluginInfo => {
                const constructor = window[pluginInfo.Name];
                if (typeof constructor !== 'function') {
                    console.error(`[rzCarousel] Plugin constructor '${pluginInfo.Name}' not found on window object.`);
                    return null;
                }
                try {
                    return constructor(pluginInfo.Options || {});
                } catch (e) {
                    console.error(`[rzCarousel] Error instantiating plugin '${pluginInfo.Name}':`, e);
                    return null;
                }
            }).filter(Boolean); // Filter out any nulls from failed instantiations
        },

        /**
         * Executes the `destroy` operation.
         * @returns {any} Returns the result of `destroy` when applicable.
         */
        destroy() {
            if (this.emblaApi) this.emblaApi.destroy();
        },

        /**
         * Executes the `onSelect` operation.
         * @returns {any} Returns the result of `onSelect` when applicable.
         */
        onSelect() {
            if (!this.emblaApi) return;
            this.selectedIndex = this.emblaApi.selectedScrollSnap();
            this.canScrollPrev = this.emblaApi.canScrollPrev();
            this.canScrollNext = this.emblaApi.canScrollNext();
            this.scrollSnaps = this.emblaApi.scrollSnapList();
        },

        cannotScrollPrev() { return !this.canScrollPrev; },
        cannotScrollNext() { return !this.canScrollNext; },

        scrollPrev() { this.emblaApi?.scrollPrev(); },
        scrollNext() { this.emblaApi?.scrollNext(); },
        scrollTo(index) { this.emblaApi?.scrollTo(index); }
    }));
}
