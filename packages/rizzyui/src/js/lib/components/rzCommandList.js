export default function(Alpine) {
    Alpine.data('rzCommandList', () => ({
        parent: null,
        dataItemTemplate: null,
        rowCache: new Map(),

        /**
         * Initializes the command list and links it with the parent command instance.
         * @returns {void}
         */
        init() {
            const parentEl = this.$el.closest('[x-data="rzCommand"]');
            if (!parentEl) {
                console.error('CommandList must be a child of RzCommand.');
                return;
            }

            this.parent = Alpine.$data(parentEl);
            if (this.parent.dataItemTemplateId) {
                this.dataItemTemplate = document.getElementById(this.parent.dataItemTemplateId);
            }

            this.parent.setListInstance(this);
        },

        /**
         * Returns a cached row for an item, creating one from a template when needed.
         * @param {object} item The command item.
         * @returns {Element|null} The row element or null when unavailable.
         */
        ensureRow(item) {
            if (this.rowCache.has(item.id)) {
                return this.rowCache.get(item.id);
            }

            let itemEl = null;

            if (item.isDataItem) {
                if (!this.dataItemTemplate || !this.dataItemTemplate.content) {
                    return null;
                }

                const clone = this.dataItemTemplate.content.cloneNode(true);
                itemEl = clone.firstElementChild;

                if (itemEl) {
                    Alpine.addScopeToNode(itemEl, { item });
                    Alpine.initTree(itemEl);
                }
            } else if (item.templateContent) {
                const clone = item.templateContent.cloneNode(true);
                itemEl = clone.firstElementChild;
            }

            if (!itemEl) {
                return null;
            }

            this.rowCache.set(item.id, itemEl);
            return itemEl;
        },

        /**
         * Applies ARIA/data attributes to a rendered row.
         * @param {Element} itemEl The row element.
         * @param {object} item The command item.
         * @param {number} itemIndex The filtered index of the item.
         * @returns {void}
         */
        applyItemAttributes(itemEl, item, itemIndex) {
            itemEl.setAttribute('data-command-item-id', item.id);
            itemEl.setAttribute('data-value', item.value || '');

            if (item.keywords) {
                itemEl.setAttribute('data-keywords', JSON.stringify(item.keywords));
            }

            if (item.group) {
                itemEl.setAttribute('data-group', item.group);
            }

            if (item.disabled) {
                itemEl.setAttribute('data-disabled', 'true');
                itemEl.setAttribute('aria-disabled', 'true');
            } else {
                itemEl.removeAttribute('data-disabled');
                itemEl.removeAttribute('aria-disabled');
            }

            if (item.forceMount) {
                itemEl.setAttribute('data-force-mount', 'true');
            }

            itemEl.setAttribute('role', 'option');
            itemEl.setAttribute('aria-selected', this.parent.selectedIndex === itemIndex ? 'true' : 'false');

            if (this.parent.selectedIndex === itemIndex) {
                itemEl.setAttribute('data-selected', 'true');
            } else {
                itemEl.removeAttribute('data-selected');
            }
        },

        /**
         * Renders grouped command rows using cached row elements.
         * @returns {void}
         */
        renderList() {
            const items = this.parent.filteredItems || [];
            const groups = this.parent.groupTemplates || new Map();
            const container = this.$el;
            const fragment = document.createDocumentFragment();

            const groupedItems = new Map([['__ungrouped__', []]]);
            for (const item of items) {
                const groupName = item.group || '__ungrouped__';
                if (!groupedItems.has(groupName)) {
                    groupedItems.set(groupName, []);
                }
                groupedItems.get(groupName).push(item);
            }

            groupedItems.forEach((groupItems, groupName) => {
                if (groupItems.length === 0) {
                    return;
                }

                const groupContainer = document.createElement('div');
                groupContainer.setAttribute('role', 'group');
                groupContainer.setAttribute('data-dynamic-item', 'true');
                groupContainer.setAttribute('data-slot', 'command-group');

                if (groupName !== '__ungrouped__') {
                    const groupTemplate = groups.get(groupName);
                    if (groupTemplate?.templateContent) {
                        const headingClone = groupTemplate.templateContent.cloneNode(true);
                        if (groupTemplate.headingId) {
                            groupContainer.setAttribute('aria-labelledby', groupTemplate.headingId);
                        }
                        groupContainer.appendChild(headingClone);
                    }
                }

                groupItems.forEach((item, idx) => {
                    const itemIndex = this.parent.filteredIndexById.get(item.id) ?? idx;
                    const itemEl = this.ensureRow(item);
                    if (!itemEl) {
                        return;
                    }

                    this.applyItemAttributes(itemEl, item, itemIndex);
                    groupContainer.appendChild(itemEl);
                });

                fragment.appendChild(groupContainer);
            });

            container.querySelectorAll('[data-dynamic-item]').forEach(el => el.remove());
            container.appendChild(fragment);

            if (window.htmx) {
                window.htmx.process(container);
            }
        }
    }));
}
