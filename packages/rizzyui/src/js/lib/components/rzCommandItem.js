// packages/rizzyui/src/js/lib/components/rzCommandItem.js
export default function(Alpine) {
    Alpine.data('rzCommandItem', () => ({
        parent: null,
        itemData: {},

        /**
         * Computes a deterministic hash for fallback item ids.
         * @param {string} value The value to hash.
         * @returns {string} A hash string.
         */
        hashString(value) {
            let hash = 0;
            for (let i = 0; i < value.length; i++) {
                hash = ((hash << 5) - hash) + value.charCodeAt(i);
                hash |= 0;
            }

            return String(hash >>> 0);
        },

        /**
         * Resolves a stable identifier for the item.
         * @param {string} value The item value.
         * @param {string} name The item display name.
         * @returns {string} The stable identifier.
         */
        resolveItemId(value, name) {
            if (this.$el.id) {
                return this.$el.id;
            }

            if (value) {
                return value;
            }

            return `item-${this.hashString(name || this.$el.textContent.trim())}`;
        },

        /**
         * Initializes the item and registers it with the parent command instance.
         * @returns {void}
         */
        init() {
            const parentEl = this.$el.closest('[x-data="rzCommand"]');
            if (!parentEl) {
                console.error('CommandItem must be a child of RzCommand.');
                return;
            }
            this.parent = Alpine.$data(parentEl);

            const template = this.$el.querySelector('template');
            const templateContent = template?.content ? template.content.cloneNode(true) : null;
            const value = this.$el.dataset.value || this.$el.textContent.trim();
            const name = this.$el.dataset.name || this.$el.dataset.value || this.$el.textContent.trim();

            this.itemData = {
                id: this.resolveItemId(value, name),
                value,
                name,
                keywords: JSON.parse(this.$el.dataset.keywords || '[]'),
                group: this.$el.dataset.group || null,
                templateContent,
                disabled: this.$el.dataset.disabled === 'true',
                forceMount: this.$el.dataset.forceMount === 'true'
            };

            this.parent.registerItem(this.itemData);
        },

        /**
         * Unregisters the item from the parent command instance.
         * @returns {void}
         */
        destroy() {
            if (this.parent) {
                this.parent.unregisterItem(this.itemData.id);
            }
        }
    }));
}
