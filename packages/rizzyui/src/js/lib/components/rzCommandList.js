
export default function(Alpine) {
    Alpine.data('rzCommandList', () => ({
        parent: null,
        dataItemTemplate: null,

        /**
         * Executes the `init` operation.
         * @returns {any} Returns the result of `init` when applicable.
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
        },

        /**
         * Executes the `renderList` operation.
         * @param {any} event Input value for this method.
         * @returns {any} Returns the result of `renderList` when applicable.
         */
        renderList(event) {
            if (event.detail.commandId !== this.parent.$el.id) return;

            const items = event.detail.items || [];
            const groups = event.detail.groups || new Map();
            const container = this.$el;

            container.querySelectorAll('[data-dynamic-item]').forEach(el => el.remove());

            const groupedItems = new Map([['__ungrouped__', []]]);
            items.forEach(item => {
                const groupName = item.group || '__ungrouped__';
                if (!groupedItems.has(groupName)) {
                    groupedItems.set(groupName, []);
                }
                groupedItems.get(groupName).push(item);
            });

            groupedItems.forEach((groupItems, groupName) => {
                if (groupItems.length === 0) return;

                const groupContainer = document.createElement('div');
                groupContainer.setAttribute('role', 'group');
                groupContainer.setAttribute('data-dynamic-item', 'true');
                groupContainer.setAttribute('data-slot', 'command-group');

                if (groupName !== '__ungrouped__') {
                    const headingTemplateId = groups.get(groupName);
                    if (headingTemplateId) {
                        const headingTemplate = document.getElementById(headingTemplateId);
                        if (headingTemplate && headingTemplate.content) {
                            const headingClone = headingTemplate.content.cloneNode(true);
                            const headingEl = headingClone.firstElementChild;
                            if(headingEl) {
                                groupContainer.setAttribute('aria-labelledby', headingEl.id);
                                groupContainer.appendChild(headingClone);
                            }
                        }
                    }
                }

                groupItems.forEach(item => {
                    const itemIndex = this.parent.filteredItems.indexOf(item);
                    let itemEl;

                    if (item.isDataItem) {
                        if (!this.dataItemTemplate) {
                            // This check is now also performed in rzCommand.js, but we keep it here as a safeguard.
                            return;
                        }
                        const clone = this.dataItemTemplate.content.cloneNode(true);
                        itemEl = clone.firstElementChild;
                        // Add a reactive scope for this item, making `item.property` available in the template
                        Alpine.addScopeToNode(itemEl, { item: item });
                    } else {
                        const template = document.getElementById(item.templateId);
                        if (template && template.content) {
                            const clone = template.content.cloneNode(true);
                            itemEl = clone.querySelector(`[data-command-item-id="${item.id}"]`);
                        }
                    }
                    
                    if (itemEl) {
                        // Dynamically set attributes from the item data
                        itemEl.setAttribute('data-command-item-id', item.id);
                        itemEl.setAttribute('data-value', item.value);
                        if (item.keywords) itemEl.setAttribute('data-keywords', JSON.stringify(item.keywords));
                        if (item.group) itemEl.setAttribute('data-group', item.group);
                        if (item.disabled) itemEl.setAttribute('data-disabled', 'true');
                        if (item.forceMount) itemEl.setAttribute('data-force-mount', 'true');

                        // Set accessibility and state attributes
                        itemEl.setAttribute('role', 'option');
                        itemEl.setAttribute('aria-selected', this.parent.selectedIndex === itemIndex);
                        if (item.disabled) {
                            itemEl.setAttribute('aria-disabled', 'true');
                        }

                        if (this.parent.selectedIndex === itemIndex) {
                            itemEl.setAttribute('data-selected', 'true');
                        }
                        
                        groupContainer.appendChild(itemEl);
                        Alpine.initTree(itemEl);
                    }
                });

                container.appendChild(groupContainer);
            });
        }
    }));
}
