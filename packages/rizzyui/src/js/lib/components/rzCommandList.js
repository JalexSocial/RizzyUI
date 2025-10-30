
export default function(Alpine) {
    Alpine.data('rzCommandList', () => ({
        parent: null,
        _previousIndex: -1,

        init() {
            const parentEl = this.$el.closest('[x-data="rzCommand"]');
            if (!parentEl) {
                console.error('CommandList must be a child of RzCommand.');
                return;
            }
            this.parent = Alpine.$data(parentEl);

            this.$watch('parent.selectedIndex', (newIndex) => {
                // Deselect previous item
                if (this._previousIndex > -1) {
                    const prevItemEl = this.$el.querySelector(`[data-index="${this._previousIndex}"]`);
                    if (prevItemEl) {
                        prevItemEl.setAttribute('aria-selected', 'false');
                        prevItemEl.removeAttribute('data-selected');
                    }
                }

                // Select new item
                if (newIndex > -1) {
                    const newItemEl = this.$el.querySelector(`[data-index="${newIndex}"]`);
                    if (newItemEl) {
                        newItemEl.setAttribute('aria-selected', 'true');
                        newItemEl.setAttribute('data-selected', 'true');
                    }
                }
                
                this._previousIndex = newIndex;
            });
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
                    const host = document.createElement('div');
                    host.id = item.id;
                    host.setAttribute('role', 'option');
                    host.setAttribute('aria-selected', this.parent.selectedIndex === itemIndex);
                    if (item.disabled) {
                        host.setAttribute('aria-disabled', 'true');
                    }
                    host.dataset.commandItemId = item.id;
                    host.dataset.index = itemIndex;

                    if (this.parent.selectedIndex === itemIndex) {
                        host.setAttribute('data-selected', 'true');
                    }

                    const template = document.getElementById(item.templateId);
                    if (template && template.content) {
                        const clone = template.content.cloneNode(true);
                        host.appendChild(clone);
                        Alpine.initTree(host);
                    }

                    groupContainer.appendChild(host);
                });

                container.appendChild(groupContainer);
            });
            
            this._previousIndex = this.parent.selectedIndex;
        },

        handleItemClick(event) {
            const host = event.target.closest('[data-command-item-id]');
            if (!host) return;

            const index = parseInt(host.dataset.index, 10);
            if (!isNaN(index)) {
                this.$dispatch('rz:command:item-click', { index });
            }
        },

        handleItemMouseover(event) {
            const host = event.target.closest('[data-command-item-id]');
            if (!host) return;

            const index = parseInt(host.dataset.index, 10);
            if (!isNaN(index)) {
                const item = this.parent.filteredItems[index];
                if (item && !item.disabled) {
                    if (this.parent.selectedIndex !== index) {
                        this.parent.selectedIndex = index;
                    }
                }
            }
        }
    }));
}