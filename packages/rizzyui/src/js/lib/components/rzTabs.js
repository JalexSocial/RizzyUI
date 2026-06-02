export default function rzTabs() {
    return {
        selectedTab: '',
        _triggers: [],
        _observer: null,

        /**
         * Initializes tab trigger registration and selects the default or first enabled tab.
         * @returns {void}
         */
        init() {
            const defaultValue = this.$el.dataset.defaultValue;

            this._observer = new MutationObserver(() => {
                this.refreshTriggers();
                this._ensureSelectedTab();
            });
            this._observer.observe(this.$el, { childList: true, subtree: true });

            this.refreshTriggers();

            if (defaultValue && this._triggers.some(t => t.dataset.value === defaultValue && !this._isDisabled(t))) {
                this.selectedTab = defaultValue;
            } else {
                this.selectedTab = this._enabledTriggers()[0]?.dataset.value ?? '';
            }
        },

        /**
         * Disconnects the mutation observer.
         * @returns {void}
         */
        destroy() {
            if (this._observer) {
                this._observer.disconnect();
                this._observer = null;
            }
        },

        /**
         * Refreshes trigger registrations from current DOM state.
         * @returns {void}
         */
        refreshTriggers() {
            this._triggers = Array.from(this.$el.querySelectorAll('[role="tab"]'));
        },

        /**
         * Activates an enabled tab trigger.
         * @param {HTMLElement} trigger The tab trigger to activate.
         * @param {boolean} focusTrigger Whether to move focus to the trigger after activation.
         * @returns {void}
         */
        activateTrigger(trigger, focusTrigger = false) {
            if (!trigger || this._isDisabled(trigger)) {
                return;
            }

            const value = trigger.dataset.value;
            if (!value) {
                return;
            }

            if (this.selectedTab !== value) {
                this.selectedTab = value;
                this.$dispatch('rz:tabs-change', { value: this.selectedTab });
            }

            if (focusTrigger) {
                this.$nextTick(() => trigger.focus());
            }
        },

        /**
         * Handles pointer activation on a tab trigger.
         * @param {Event} e The click event.
         * @returns {void}
         */
        onTriggerClick(e) {
            this.activateTrigger(e.currentTarget, false);
        },

        /**
         * Returns whether a tab value is selected.
         * @param {string} value The tab value.
         * @returns {boolean} True when selected.
         */
        isSelected(value) {
            return this.selectedTab === value;
        },

        /**
         * Returns Alpine trigger bindings for consumers that bind directly.
         * @returns {object} Trigger attributes.
         */
        bindTrigger() {
            const value = this.$el.dataset.value;
            const active = this.isSelected(value);
            const disabled = this._isDisabled(this.$el);
            return {
                'aria-selected': String(active),
                'tabindex': active ? '0' : '-1',
                'data-state': active ? 'active' : 'inactive',
                ...(disabled && { 'disabled': true })
            };
        },

        /**
         * Returns the native disabled attribute value for disabled tabs.
         * @returns {string|null} Disabled attribute value.
         */
        _attrDisabled() {
            return this._isDisabled(this.$el) ? 'true' : null;
        },

        /**
         * Returns the selected state for a tab trigger.
         * @returns {string} The aria-selected value.
         */
        _attrAriaSelected() {
            return String(this.$el.dataset.value === this.selectedTab && !this._isDisabled(this.$el));
        },

        /**
         * Returns the hidden attribute value for a tab panel.
         * @returns {string|null} Hidden attribute value.
         */
        _attrHidden() {
            return this.$el.dataset.value === this.selectedTab ? null : 'true';
        },

        /**
         * Returns whether a tab panel is hidden from assistive technology.
         * @returns {string} The aria-hidden value.
         */
        _attrAriaHidden() {
            return String(this.selectedTab !== this.$el.dataset.value);
        },

        /**
         * Returns the active or inactive state for a trigger or panel.
         * @returns {string} The data-state value.
         */
        _attrDataState() {
            return this.selectedTab === this.$el.dataset.value && !this._isDisabled(this.$el) ? 'active' : 'inactive';
        },

        /**
         * Returns the roving tabindex value for a trigger or panel.
         * @returns {string} The tabindex value.
         */
        _attrTabIndex() {
            return this.selectedTab === this.$el.dataset.value && !this._isDisabled(this.$el) ? '0' : '-1';
        },

        /**
         * Handles APG-style automatic tab activation and roving focus for arrow keys.
         * @param {KeyboardEvent} e The keyboard event.
         * @returns {void}
         */
        onListKeydown(e) {
            const handledKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
            if (!handledKeys.includes(e.key)) {
                return;
            }

            const isVertical = e.currentTarget?.getAttribute('aria-orientation') === 'vertical';
            const handledForOrientation = e.key === 'Home'
                || e.key === 'End'
                || (isVertical && ['ArrowUp', 'ArrowDown'].includes(e.key))
                || (!isVertical && ['ArrowLeft', 'ArrowRight'].includes(e.key));

            if (!handledForOrientation) {
                return;
            }

            const availableTriggers = this._enabledTriggers();
            if (availableTriggers.length === 0) {
                return;
            }

            const currentTrigger = this._isDisabled(e.target) || e.target?.getAttribute?.('role') !== 'tab'
                ? availableTriggers.find(t => t.dataset.value === this.selectedTab)
                : e.target;
            let activeIndex = availableTriggers.indexOf(currentTrigger);

            if (activeIndex === -1) {
                activeIndex = Math.max(availableTriggers.findIndex(t => t.dataset.value === this.selectedTab), 0);
            }

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

            e.preventDefault();
            this.activateTrigger(availableTriggers[newIndex], true);
        },

        /**
         * Returns enabled tab triggers.
         * @returns {HTMLElement[]} Enabled tab triggers.
         */
        _enabledTriggers() {
            return this._triggers.filter(t => !this._isDisabled(t));
        },

        /**
         * Returns whether an element is disabled for tab activation.
         * @param {HTMLElement} element The element to inspect.
         * @returns {boolean} True when disabled.
         */
        _isDisabled(element) {
            return element?.getAttribute?.('aria-disabled') === 'true'
                || element?.hasAttribute?.('disabled') === true
                || element?.disabled === true;
        },

        /**
         * Ensures selectedTab still points at an enabled tab after DOM changes.
         * @returns {void}
         */
        _ensureSelectedTab() {
            if (this.selectedTab && this._triggers.some(t => t.dataset.value === this.selectedTab && !this._isDisabled(t))) {
                return;
            }

            this.selectedTab = this._enabledTriggers()[0]?.dataset.value ?? '';
        }
    };
}
