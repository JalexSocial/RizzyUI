
// packages/rizzyui/src/js/lib/components/rzCommandItem.js
export default function(Alpine) {
    Alpine.data('rzCommandItem', () => ({
        parent: null,
        itemData: {},

        /**
         * Executes the `init` operation.
         * @returns {any} Returns the result of `init` when applicable.
         */
        init() {
            const parentEl = this.$el.closest('[x-data="rzCommand"]');
            if (!parentEl) {
                console.error('CommandItem must be a child of RzCommand.');
                return;
            }
            this.parent = Alpine.$data(parentEl);

            this.itemData = {
                id: this.$el.id,
                value: this.$el.dataset.value || this.$el.textContent.trim(),
                name: this.$el.dataset.name || this.$el.dataset.value || this.$el.textContent.trim(),
                keywords: JSON.parse(this.$el.dataset.keywords || '[]'),
                group: this.$el.dataset.group || null,
                templateId: this.$el.id + '-template',
                disabled: this.$el.dataset.disabled === 'true',
                forceMount: this.$el.dataset.forceMount === 'true'
            };

            this.parent.registerItem(this.itemData);
        },

        /**
         * Executes the `destroy` operation.
         * @returns {any} Returns the result of `destroy` when applicable.
         */
        destroy() {
            if (this.parent) {
                this.parent.unregisterItem(this.itemData.id);
            }
        }
    }));
}
