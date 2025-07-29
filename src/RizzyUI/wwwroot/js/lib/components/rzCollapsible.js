
export default function(Alpine) {
    Alpine.data('rzCollapsible', () => ({
        isOpen: false,

        init() {
            this.isOpen = this.$el.dataset.defaultOpen === 'true';
        },

        toggle() {
            this.isOpen = !this.isOpen;
        }
    }));
}