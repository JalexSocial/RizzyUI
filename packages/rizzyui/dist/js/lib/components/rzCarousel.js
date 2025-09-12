export default function(Alpine, require) {
    Alpine.data('rzCarousel', () => ({
        emblaApi: null,
        canScrollPrev: false,
        canScrollNext: false,
        selectedIndex: 0,
        scrollSnaps: [],

        init() {
            const assetsToLoad = JSON.parse(this.$el.dataset.assets || '[]');
            const nonce = this.$el.dataset.nonce || '';
            const options = JSON.parse(this.$el.dataset.options || '{}');
            const self = this;

            if (assetsToLoad.length > 0 && typeof require === 'function') {
                require(assetsToLoad, {
                    success: function() {
                        if (window.EmblaCarousel) {
                            self.initializeEmbla(options);
                        } else {
                            console.error('EmblaCarousel not found on window object after loading assets.');
                        }
                    },
                    error: function(err) {
                        console.error('Failed to load EmblaCarousel assets.', err);
                    }
                }, nonce);
            } else {
                if (window.EmblaCarousel) {
                    this.initializeEmbla(options);
                } else {
                    console.error('EmblaCarousel not found and no assets specified for loading.');
                }
            }
        },

        initializeEmbla(options) {
            const viewport = this.$el.querySelector('[x-ref="viewport"]');
            if (!viewport) {
                console.error('Carousel viewport with x-ref="viewport" not found.');
                return;
            }

            this.emblaApi = window.EmblaCarousel(viewport, options);

            this.emblaApi.on('select', this.onSelect.bind(this));
            this.emblaApi.on('reInit', this.onSelect.bind(this));

            this.onSelect();
        },

        destroy() {
            if (this.emblaApi) {
                this.emblaApi.destroy();
            }
        },

        onSelect() {
            if (!this.emblaApi) return;
            this.selectedIndex = this.emblaApi.selectedScrollSnap();
            this.canScrollPrev = this.emblaApi.canScrollPrev();
            this.canScrollNext = this.emblaApi.canScrollNext();
            this.scrollSnaps = this.emblaApi.scrollSnapList();
        },

        cannotScrollPrev() {
            return !this.canScrollPrev;
        },

        cannotScrollNext() {
            return !this.canScrollNext;
        },

        scrollPrev() {
            this.emblaApi?.scrollPrev();
        },

        scrollNext() {
            this.emblaApi?.scrollNext();
        },

        scrollTo(index) {
            this.emblaApi?.scrollTo(index);
        }
    }));
}