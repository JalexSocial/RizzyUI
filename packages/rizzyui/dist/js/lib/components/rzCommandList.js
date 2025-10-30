
export default function(Alpine) {
    Alpine.data('rzCommandList', () => ({
        parent: null,

        init() {
            const parentEl = this.$el.closest('[x-data="rzCommand"]');
            if (!parentEl) {
                console.error('CommandList must be a child of RzCommand.');
                return;
            }
            this.parent = Alpine.$data(parentEl);
        },

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
                    const template = document.getElementById(item.templateId);
                    if (template && template.content) {
                        const clone = template.content.cloneNode(true);
                        const itemEl = clone.querySelector(`[data-command-item-id="${item.id}"]`);
                        
                        if (itemEl) {
                            itemEl.id = item.id;
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
                    }
                });

                container.appendChild(groupContainer);
            });
        }
    }));
}