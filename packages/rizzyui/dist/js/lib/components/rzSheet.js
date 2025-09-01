// packages/rizzyui/src/js/lib/components/rzSheet.js
export default function(Alpine) {
    Alpine.data('rzSheet', () => ({
        open: false,

        init() {
            this.open = this.$el.dataset.defaultOpen === 'true';
        },

        toggle() {
            this.open = !this.open;
        },

        close() {
            this.open = false;
        },

        show() {
            this.open = true;
        },

        state() {
            return this.open ? 'open' : 'closed';
        }
    }));
}