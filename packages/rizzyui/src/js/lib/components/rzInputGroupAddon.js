export default function(Alpine) {
    Alpine.data('rzInputGroupAddon', () => ({
        handleClick(event) {
            if (event.target.closest('button')) {
                return;
            }
            const parent = this.$el.parentElement;
            if (parent) {
                const input = parent.querySelector('input, textarea');
                input?.focus();
            }
        }
    }));
}