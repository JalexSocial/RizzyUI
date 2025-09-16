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

    // Helper: resolve options from data-options (inline JSON or script id)
    function resolveOptions(dataset) {
        const raw = dataset.options || '';
        if (!raw) return {};

        // If the value looks like JSON, parse it directly (back-compat)
        const trimmed = raw.trim();
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
            try {
                return JSON.parse(trimmed);
            } catch (e) {
                console.error('[rzCarousel] Failed to parse inline options JSON:', e);
                return {};
            }
        }

        // Otherwise treat it as an element id for a JSON <script>
        return parseJsonFromScriptId(raw);
    }

    Alpine.data('rzCarousel', () => ({
        emblaApi: null,
        canScrollPrev: false,
        canScrollNext: false,
        selectedIndex: 0,
        scrollSnaps: [],

        init() {
            const assetsToLoad = (() => {
                try { return JSON.parse(this.$el.dataset.assets || '[]'); }
                catch (e) { console.error('[rzCarousel] Bad assets JSON:', e); return []; }
            })();

            const nonce = this.$el.dataset.nonce || '';
            const options = resolveOptions(this.$el.dataset);
            const self = this;

            if (assetsToLoad.length > 0 && typeof require === 'function') {
                require(
                    assetsToLoad,
                    {
                        success() {
                            if (window.EmblaCarousel) {
                                self.initializeEmbla(options);
                            } else {
                                console.error('[rzCarousel] EmblaCarousel not found on window after loading assets.');
                            }
                        },
                        error(err) {
                            console.error('[rzCarousel] Failed to load EmblaCarousel assets.', err);
                        }
                    },
                    nonce
                );
            } else {
                if (window.EmblaCarousel) {
                    this.initializeEmbla(options);
                } else {
                    console.error('[rzCarousel] EmblaCarousel not found and no assets specified for loading.');
                }
            }
        },

        initializeEmbla(options) {
            const viewport = this.$el.querySelector('[x-ref="viewport"]');
            if (!viewport) {
                console.error('[rzCarousel] Carousel viewport with x-ref="viewport" not found.');
                return;
            }

            this.emblaApi = window.EmblaCarousel(viewport, options);
            this.emblaApi.on('select', this.onSelect.bind(this));
            this.emblaApi.on('reInit', this.onSelect.bind(this));
            this.onSelect();
        },

        destroy() {
            if (this.emblaApi) this.emblaApi.destroy();
        },

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
