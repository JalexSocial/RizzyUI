
export default function(Alpine) {
    Alpine.data('rzTabs', () => ({
        selectedTab: '',
        _triggers: [],
        _observer: null,

        /**
         * Executes the `init` operation.
         * @returns {any} Returns the result of `init` when applicable.
         */
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

        /**
         * Executes the `destroy` operation.
         * @returns {any} Returns the result of `destroy` when applicable.
         */
        destroy() {
            if (this._observer) {
                this._observer.disconnect();
            }
        },

        /**
         * Executes the `refreshTriggers` operation.
         * @returns {any} Returns the result of `refreshTriggers` when applicable.
         */
        refreshTriggers() {
            this._triggers = Array.from(this.$el.querySelectorAll('[role="tab"]'));
        },

        /**
         * Executes the `onTriggerClick` operation.
         * @param {any} e Input value for this method.
         * @returns {any} Returns the result of `onTriggerClick` when applicable.
         */
        onTriggerClick(e) {
            const value = e.currentTarget?.dataset?.value;
            if (!value || e.currentTarget.getAttribute('aria-disabled') === 'true') {
                return;
            }
            this.selectedTab = value;
            this.$dispatch('rz:tabs-change', { value: this.selectedTab });
        },

        /**
         * Executes the `isSelected` operation.
         * @param {any} value Input value for this method.
         * @returns {any} Returns the result of `isSelected` when applicable.
         */
        isSelected(value) {
            return this.selectedTab === value;
        },

        /**
         * Executes the `bindTrigger` operation.
         * @returns {any} Returns the result of `bindTrigger` when applicable.
         */
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
        
        /**
         * Executes the `_attrDisabled` operation.
         * @returns {any} Returns the result of `_attrDisabled` when applicable.
         */
        _attrDisabled() {
            return this.$el.getAttribute('aria-disabled') === 'true' ? 'true' : null;
        },
        
        /**
         * Executes the `_attrAriaSelected` operation.
         * @returns {any} Returns the result of `_attrAriaSelected` when applicable.
         */
        _attrAriaSelected() {
            return String(this.$el.dataset.value === this.selectedTab);
        },

        /**
         * Executes the `_attrHidden` operation.
         * @returns {any} Returns the result of `_attrHidden` when applicable.
         */
        _attrHidden() {
            return this.$el.dataset.value === this.selectedTab ? null : 'true';
        },

        /**
         * Executes the `_attrAriaHidden` operation.
         * @returns {any} Returns the result of `_attrAriaHidden` when applicable.
         */
        _attrAriaHidden() {
            return String(this.selectedTab !== this.$el.dataset.value);
        },
        
        /**
         * Executes the `_attrDataState` operation.
         * @returns {any} Returns the result of `_attrDataState` when applicable.
         */
        _attrDataState() {
            return this.selectedTab === this.$el.dataset.value ? 'active' : 'inactive';
        },
        
        /**
         * Executes the `_attrTabIndex` operation.
         * @returns {any} Returns the result of `_attrTabIndex` when applicable.
         */
        _attrTabIndex() {
            return this.selectedTab === this.$el.dataset.value ? '0' : '-1';
        },

        /**
         * Executes the `onListKeydown` operation.
         * @param {any} e Input value for this method.
         * @returns {any} Returns the result of `onListKeydown` when applicable.
         */
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
