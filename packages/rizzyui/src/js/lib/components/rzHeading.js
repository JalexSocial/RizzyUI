
// --------------------------------------------------------------------------------
// Alpine.js component: rzHeading
// Observes heading elements to automatically update the current heading in the quick-reference.
// --------------------------------------------------------------------------------
export default function(Alpine) {
    Alpine.data('rzHeading', () => {
        return {
            observer: null,
            headingId: '',
            /**
             * Executes the `init` operation.
             * @returns {any} Returns the result of `init` when applicable.
             */
            init() {
                this.headingId = this.$el.dataset.alpineRoot;
                
                const self = this;
                // Ensure setCurrentHeading exists in the parent scope (rzQuickReferenceContainer)
                if (typeof this.setCurrentHeading === 'function') {
                    const callback = (entries, observer) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                self.setCurrentHeading(self.headingId);
                            }
                        });
                    };
                    const options = { threshold: 0.5 };
                    this.observer = new IntersectionObserver(callback, options);
                    // Begin observing the heading element
                    this.observer.observe(this.$el);
                } else {
                    console.warn("rzHeading: Could not find 'setCurrentHeading' function in parent scope.");
                }
            },
            /**
             * Executes the `destroy` operation.
             * @returns {any} Returns the result of `destroy` when applicable.
             */
            destroy() {
                if (this.observer != null)
                    this.observer.disconnect();
            }
        };
    });
}
