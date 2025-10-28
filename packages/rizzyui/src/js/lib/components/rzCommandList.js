
// packages/rizzyui/src/js/lib/components/rzCommandList.js
export default function(Alpine) {
    Alpine.data('rzCommandList', () => ({
        parent: null,

        init() {
            const parentEl = this.$el.closest('[x-data="rzCommand"]');
            if (!parentEl) {
                console.error('RzCommandList must be a child of RzCommand.');
                return;
            }
            this.parent = Alpine.$data(parentEl);
        },

        renderList(event) {
            const items = event.detail.items || [];
            const container = this.$el;
            container.innerHTML = ''; // Clear previous items

            let currentGroup = null;
            let groupContainer = null;

            items.forEach((item, index) => {
                const itemGroup = item.group || '__ungrouped__';

                if (itemGroup !== currentGroup) {
                    currentGroup = itemGroup;
                    groupContainer = document.createElement('div');
                    groupContainer.setAttribute('role', 'group');
                    
                    if (currentGroup !== '__ungrouped__') {
                        const headingId = `group-heading-${currentGroup.replace(/\s+/g, '-')}`;
                        groupContainer.setAttribute('aria-labelledby', headingId);
                        
                        const headingEl = document.createElement('div');
                        headingEl.className = this.parent.groupHeadingClass;
                        headingEl.id = headingId;
                        headingEl.textContent = currentGroup;
                        groupContainer.appendChild(headingEl);
                    }
                    container.appendChild(groupContainer);
                }

                const host = document.createElement('div');
                host.id = item.id;
                host.setAttribute('role', 'option');
                host.setAttribute('aria-selected', this.parent.selectedIndex === index);
                if (item.disabled) {
                    host.setAttribute('aria-disabled', 'true');
                }
                host.dataset.commandItemId = item.id;
                host.dataset.index = index;

                if (this.parent.selectedIndex === index) {
                    host.classList.add(...this.parent.activeItemClass.split(' '));
                }

                const template = document.getElementById(item.templateId);
                if (template && template.content) {
                    const clone = template.content.cloneNode(true);
                    host.appendChild(clone);
                    // Alpine.initTree is crucial for interactivity inside items
                    Alpine.initTree(host);
                }
                
                (groupContainer || container).appendChild(host);
            });
        },

        handleItemClick(event) {
            const host = event.target.closest('[data-command-item-id]');
            if (!host) return;

            const index = parseInt(host.dataset.index, 10);
            if (!isNaN(index)) {
                this.$dispatch('rz:command:item-click', { index });
            }
        }
    }));
}