export default function(Alpine) {
    Alpine.data('rzSheet', () => ({
        open: false,
        isVisible: false,

        init() {
            this.open = this.$el.dataset.defaultOpen === 'true';
            this.isVisible = this.open;
        },

        toggle() {
            this.open ? this.close() : this.show();
        },

        close() {
            this.open = false;
            // Wait for animation to finish before hiding
            setTimeout(() => {
                this.isVisible = false;
            }, 500); // Corresponds to data-[state=closed]:duration-500 if it were set, using a safe value
        },

        show() {
            this.isVisible = true;
            this.$nextTick(() => {
                this.open = true;
            });
        },

        state() {
            return this.open ? 'open' : 'closed';
        }
    }));
}