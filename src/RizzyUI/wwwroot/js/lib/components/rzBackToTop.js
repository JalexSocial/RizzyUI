export default function rzBackToTop() {
    return {
        visible: false,
        threshold: 300,
        _rafPending: false,
        _onScroll: null,

        init() {
            const parsedThreshold = Number(this.$el.dataset.threshold);
            this.threshold = Number.isFinite(parsedThreshold) ? parsedThreshold : 300;

            this._onScroll = () => {
                if (this._rafPending) return;

                this._rafPending = true;
                window.requestAnimationFrame(() => {
                    this.visible = window.scrollY > this.threshold;
                    this._rafPending = false;
                });
            };

            window.addEventListener('scroll', this._onScroll, { passive: true });
            this._onScroll();
        },

        scrollToTop() {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const behavior = prefersReducedMotion ? 'auto' : 'smooth';
            window.scrollTo({ top: 0, behavior });
        },

        destroy() {
            if (this._onScroll) {
                window.removeEventListener('scroll', this._onScroll);
            }
        }
    };
}
