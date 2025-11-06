
export default function(Alpine) {
    Alpine.data('rzTabs', () => ({
        selectedTab: '',
        _triggers: [],
        _observer: null,

        init() {
            const defaultValue = this.$el.dataset.defaultValue;
            
            this._observer = new MutationObserver(() => this.refreshTriggers());
            this._observer.observe(this.$el, { childList: true, subtree: true });
            
            this.refreshTriggers();

            if (defaultValue && this._triggers.some(t => t.dataset.value === defaultValue)) {
                this.selectedTab = defaultValue;
            } else if (this._triggers.length > 0) {
                this.selectedTab = this._triggers[0].dataset.value;
            }
        },

        destroy() {
            if (this._observer) {
                this._observer.disconnect();
            }
        },

        refreshTriggers() {
            this._triggers = Array.from(this.$el.querySelectorAll('[role="tab"]'));
        },

        onTriggerClick(e) {
            const value = e.currentTarget?.dataset?.value;
            if (!value || e.currentTarget.getAttribute('aria-disabled') === 'true') {
                return;
            }
            this.selectedTab = value;
            this.$dispatch('rz:tabs-change', { value: this.selectedTab });
        },

        isSelected(value) {
            return this.selectedTab === value;
        },

        bindTrigger() {
            const current = this.selectedTab;
            const value = this.$el.dataset.value;
            const active = this.isSelected(value);
            const disabled = this.$el.getAttribute('aria-disabled') === 'true';
            return {
                'aria-selected': String(active),
                'tabindex': active ? '0' : '-1',
                'data-state': active ? 'active' : 'inactive',
                ...(disabled && { 'disabled': true })
            };
        },
        
        _attrDisabled() {
            return this.$el.getAttribute('aria-disabled') === 'true' ? 'true' : null;
        },
        
        _attrAriaSelected() {
            return String(this.$el.dataset.value === this.selectedTab);
        },

        _attrHidden() {
            return this.$el.dataset.value === this.selectedTab ? null : 'true';
        },
        
        _attrAriaHidden() {
            return String(this.selectedTab !== el.dataset.value);
        },
        
        _attrDataState() {
            return this.selectedTab === this.$el.dataset.value ? 'active' : 'inactive';
        },
        
        _attrTabIndex() {
            return this.selectedTab === this.$el.dataset.value ? '0' : '-1';
        },

        onListKeydown(e) {
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
                e.preventDefault();
                
                const availableTriggers = this._triggers.filter(t => t.getAttribute('aria-disabled') !== 'true');
                if (availableTriggers.length === 0) return;

                const activeIndex = availableTriggers.findIndex(t => t.dataset.value === this.selectedTab);
                if (activeIndex === -1) return;

                const isVertical = e.currentTarget?.getAttribute('aria-orientation') === 'vertical';
                const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';
                const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
                let newIndex = activeIndex;

                switch (e.key) {
                    case prevKey:
                        newIndex = activeIndex - 1 < 0 ? availableTriggers.length - 1 : activeIndex - 1;
                        break;
                    case nextKey:
                        newIndex = (activeIndex + 1) % availableTriggers.length;
                        break;
                    case 'Home':
                        newIndex = 0;
                        break;
                    case 'End':
                        newIndex = availableTriggers.length - 1;
                        break;
                }

                if (newIndex >= 0 && newIndex < availableTriggers.length) {
                    const newTrigger = availableTriggers[newIndex];
                    this.selectedTab = newTrigger.dataset.value;
                    this.$nextTick(() => newTrigger.focus());
                }
            }
        }
    }));
}