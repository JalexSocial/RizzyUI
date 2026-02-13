import { autoUpdate, computePosition, offset, flip, shift, arrow } from '@floating-ui/dom';

export default function(Alpine) {
    Alpine.data('rzTooltip', () => ({
        open: false,
        ariaExpanded: 'false',
        state: 'closed',
        side: 'top',
        triggerEl: null,
        contentEl: null,
        arrowEl: null,
        openDelayTimer: null,
        closeDelayTimer: null,
        skipDelayTimer: null,
        openDelayDuration: 700,
        skipDelayDuration: 300,
        closeDelayDuration: 0,
        skipDelayActive: false,
        disableHoverableContent: false,
        anchor: 'top',
        strategy: 'absolute',
        mainOffset: 4,
        crossAxisOffset: 0,
        alignmentAxisOffset: null,
        shiftPadding: 8,
        enableFlip: true,
        enableShift: true,
        enableAutoUpdate: true,
        isControlledOpenState: false,
        cleanupAutoUpdate: null,

        /**
         * Executes the `init` operation.
         * @returns {any} Returns the result of `init` when applicable.
         */
        init() {
            this.readDatasetOptions();

            this.open = this.getBooleanDataset('open', this.getBooleanDataset('defaultOpen', false));
            this.ariaExpanded = this.open.toString();
            this.state = this.open ? 'open' : 'closed';

            this.triggerEl = this.$refs.trigger || this.$el.querySelector('[data-slot="tooltip-trigger"]');
            this.contentEl = this.$refs.content || this.$el.querySelector('[data-slot="tooltip-content"]');
            this.arrowEl = this.$el.querySelector('[data-slot="tooltip-arrow"]');

            this.bindInteractionEvents();

            this.$watch('open', (value) => {
                const controlledOpen = this.getBooleanDataset('open', value);
                const nextOpen = this.isControlledOpenState ? controlledOpen : value;

                this.open = nextOpen;
                this.ariaExpanded = nextOpen.toString();
                this.state = nextOpen ? 'open' : 'closed';

                if (this.triggerEl) {
                    this.triggerEl.dataset.state = this.state;
                }

                if (this.contentEl) {
                    this.contentEl.dataset.state = this.state;
                }

                if (nextOpen) {
                    this.$nextTick(() => {
                        this.updatePosition();
                        this.startAutoUpdate();
                    });
                    return;
                }

                this.stopAutoUpdate();
                this.startSkipDelayWindow();
            });

            if (this.open) {
                this.$nextTick(() => {
                    this.updatePosition();
                    this.startAutoUpdate();
                });
            }
        },

        /**
         * Executes the `readDatasetOptions` operation.
         * @returns {any} Returns the result of `readDatasetOptions` when applicable.
         */
        readDatasetOptions() {
            this.anchor = this.$el.dataset.anchor || this.anchor;
            this.strategy = this.$el.dataset.strategy || this.strategy;
            this.mainOffset = this.getNumberDataset('offset', this.mainOffset);
            this.crossAxisOffset = this.getNumberDataset('crossAxisOffset', this.crossAxisOffset);
            this.alignmentAxisOffset = this.getNullableNumberDataset('alignmentAxisOffset', this.alignmentAxisOffset);
            this.shiftPadding = this.getNumberDataset('shiftPadding', this.shiftPadding);
            this.openDelayDuration = this.getNumberDataset('delayDuration', this.openDelayDuration);
            this.skipDelayDuration = this.getNumberDataset('skipDelayDuration', this.skipDelayDuration);
            this.closeDelayDuration = this.getNumberDataset('closeDelayDuration', this.closeDelayDuration);
            this.disableHoverableContent = this.getBooleanDataset('disableHoverableContent', this.disableHoverableContent);
            this.enableFlip = this.getBooleanDataset('enableFlip', this.enableFlip);
            this.enableShift = this.getBooleanDataset('enableShift', this.enableShift);
            this.enableAutoUpdate = this.getBooleanDataset('autoUpdate', this.enableAutoUpdate);
            this.isControlledOpenState = this.getBooleanDataset('openControlled', this.isControlledOpenState);
        },

        /**
         * Executes the `getBooleanDataset` operation.
         * @param {any} name Input value for this method.
         * @param {any} fallbackValue Input value for this method.
         * @returns {any} Returns the result of `getBooleanDataset` when applicable.
         */
        getBooleanDataset(name, fallbackValue) {
            const value = this.$el.dataset[name];
            if (typeof value === 'undefined') return fallbackValue;
            return value === 'true';
        },

        /**
         * Executes the `getNumberDataset` operation.
         * @param {any} name Input value for this method.
         * @param {any} fallbackValue Input value for this method.
         * @returns {any} Returns the result of `getNumberDataset` when applicable.
         */
        getNumberDataset(name, fallbackValue) {
            const value = Number(this.$el.dataset[name]);
            return Number.isFinite(value) ? value : fallbackValue;
        },

        /**
         * Executes the `getNullableNumberDataset` operation.
         * @param {any} name Input value for this method.
         * @param {any} fallbackValue Input value for this method.
         * @returns {any} Returns the result of `getNullableNumberDataset` when applicable.
         */
        getNullableNumberDataset(name, fallbackValue) {
            const raw = this.$el.dataset[name];
            if (typeof raw === 'undefined' || raw === null || raw === '') return fallbackValue;
            const value = Number(raw);
            return Number.isFinite(value) ? value : fallbackValue;
        },

        /**
         * Executes the `bindInteractionEvents` operation.
         * @returns {any} Returns the result of `bindInteractionEvents` when applicable.
         */
        bindInteractionEvents() {
            if (!this.triggerEl) return;

            this.triggerEl.addEventListener('pointerenter', this.handleTriggerPointerEnter.bind(this));
            this.triggerEl.addEventListener('pointerleave', this.handleTriggerPointerLeave.bind(this));
            this.triggerEl.addEventListener('focus', this.handleTriggerFocus.bind(this));
            this.triggerEl.addEventListener('blur', this.handleTriggerBlur.bind(this));
            this.triggerEl.addEventListener('keydown', this.handleTriggerKeydown.bind(this));

            if (this.contentEl) {
                this.contentEl.addEventListener('pointerenter', this.handleContentPointerEnter.bind(this));
                this.contentEl.addEventListener('pointerleave', this.handleContentPointerLeave.bind(this));
            }
        },

        /**
         * Executes the `startAutoUpdate` operation.
         * @returns {any} Returns the result of `startAutoUpdate` when applicable.
         */
        startAutoUpdate() {
            if (!this.enableAutoUpdate || !this.triggerEl || !this.contentEl) return;
            this.stopAutoUpdate();
            this.cleanupAutoUpdate = autoUpdate(this.triggerEl, this.contentEl, () => {
                this.updatePosition();
            });
        },

        /**
         * Executes the `stopAutoUpdate` operation.
         * @returns {any} Returns the result of `stopAutoUpdate` when applicable.
         */
        stopAutoUpdate() {
            if (typeof this.cleanupAutoUpdate === 'function') {
                this.cleanupAutoUpdate();
                this.cleanupAutoUpdate = null;
            }
        },

        /**
         * Executes the `clearTimers` operation.
         * @returns {any} Returns the result of `clearTimers` when applicable.
         */
        clearTimers() {
            if (this.openDelayTimer) {
                window.clearTimeout(this.openDelayTimer);
                this.openDelayTimer = null;
            }

            if (this.closeDelayTimer) {
                window.clearTimeout(this.closeDelayTimer);
                this.closeDelayTimer = null;
            }

            if (this.skipDelayTimer) {
                window.clearTimeout(this.skipDelayTimer);
                this.skipDelayTimer = null;
            }
        },

        /**
         * Executes the `startSkipDelayWindow` operation.
         * @returns {any} Returns the result of `startSkipDelayWindow` when applicable.
         */
        startSkipDelayWindow() {
            if (this.skipDelayDuration <= 0) {
                this.skipDelayActive = false;
                return;
            }

            if (this.skipDelayTimer) {
                window.clearTimeout(this.skipDelayTimer);
            }

            this.skipDelayActive = true;
            this.skipDelayTimer = window.setTimeout(() => {
                this.skipDelayActive = false;
                this.skipDelayTimer = null;
            }, this.skipDelayDuration);
        },

        /**
         * Executes the `queueOpen` operation.
         * @returns {any} Returns the result of `queueOpen` when applicable.
         */
        queueOpen() {
            if (this.open) return;

            if (this.closeDelayTimer) {
                window.clearTimeout(this.closeDelayTimer);
                this.closeDelayTimer = null;
            }

            const delay = this.skipDelayActive ? 0 : this.openDelayDuration;
            if (delay <= 0) {
                this.open = true;
                return;
            }

            if (this.openDelayTimer) {
                window.clearTimeout(this.openDelayTimer);
            }

            this.openDelayTimer = window.setTimeout(() => {
                this.open = true;
                this.openDelayTimer = null;
            }, delay);
        },

        /**
         * Executes the `queueClose` operation.
         * @returns {any} Returns the result of `queueClose` when applicable.
         */
        queueClose() {
            if (!this.open && !this.openDelayTimer) return;

            if (this.openDelayTimer) {
                window.clearTimeout(this.openDelayTimer);
                this.openDelayTimer = null;
            }

            if (this.closeDelayDuration <= 0) {
                this.open = false;
                return;
            }

            if (this.closeDelayTimer) {
                window.clearTimeout(this.closeDelayTimer);
            }

            this.closeDelayTimer = window.setTimeout(() => {
                this.open = false;
                this.closeDelayTimer = null;
            }, this.closeDelayDuration);
        },

        /**
         * Executes the `handleTriggerPointerEnter` operation.
         * @returns {any} Returns the result of `handleTriggerPointerEnter` when applicable.
         */
        handleTriggerPointerEnter() {
            this.queueOpen();
        },

        /**
         * Executes the `handleTriggerPointerLeave` operation.
         * @returns {any} Returns the result of `handleTriggerPointerLeave` when applicable.
         */
        handleTriggerPointerLeave() {
            this.queueClose();
        },

        /**
         * Executes the `handleTriggerFocus` operation.
         * @returns {any} Returns the result of `handleTriggerFocus` when applicable.
         */
        handleTriggerFocus() {
            this.queueOpen();
        },

        /**
         * Executes the `handleTriggerBlur` operation.
         * @returns {any} Returns the result of `handleTriggerBlur` when applicable.
         */
        handleTriggerBlur() {
            this.queueClose();
        },

        /**
         * Executes the `handleContentPointerEnter` operation.
         * @returns {any} Returns the result of `handleContentPointerEnter` when applicable.
         */
        handleContentPointerEnter() {
            if (this.disableHoverableContent) return;
            if (this.closeDelayTimer) {
                window.clearTimeout(this.closeDelayTimer);
                this.closeDelayTimer = null;
            }
        },

        /**
         * Executes the `handleContentPointerLeave` operation.
         * @returns {any} Returns the result of `handleContentPointerLeave` when applicable.
         */
        handleContentPointerLeave() {
            if (this.disableHoverableContent) return;
            this.queueClose();
        },

        /**
         * Executes the `handleTriggerKeydown` operation.
         * @param {any} event Input value for this method.
         * @returns {any} Returns the result of `handleTriggerKeydown` when applicable.
         */
        handleTriggerKeydown(event) {
            if (event.key === 'Escape') {
                this.handleWindowEscape();
            }
        },

        /**
         * Executes the `handleWindowEscape` operation.
         * @returns {any} Returns the result of `handleWindowEscape` when applicable.
         */
        handleWindowEscape() {
            this.clearTimers();
            this.open = false;
            this.$nextTick(() => this.triggerEl?.focus());
        },

        /**
         * Executes the `updatePosition` operation.
         * @returns {any} Returns the result of `updatePosition` when applicable.
         */
        updatePosition() {
            if (!this.triggerEl || !this.contentEl) return;

            const middleware = [
                offset({
                    mainAxis: this.mainOffset,
                    crossAxis: this.crossAxisOffset,
                    alignmentAxis: this.alignmentAxisOffset,
                }),
            ];

            if (this.enableFlip) {
                middleware.push(flip());
            }

            if (this.enableShift) {
                middleware.push(shift({ padding: this.shiftPadding }));
            }

            if (this.arrowEl) {
                middleware.push(arrow({ element: this.arrowEl }));
            }

            computePosition(this.triggerEl, this.contentEl, {
                placement: this.anchor,
                strategy: this.strategy,
                middleware,
            }).then(({ x, y, placement, middlewareData }) => {
                this.side = placement.split('-')[0];
                this.contentEl.dataset.side = this.side;
                this.contentEl.style.position = this.strategy;
                this.contentEl.style.left = `${x}px`;
                this.contentEl.style.top = `${y}px`;

                if (!this.arrowEl || !middlewareData.arrow) return;

                const arrowX = middlewareData.arrow.x;
                const arrowY = middlewareData.arrow.y;
                const staticSideByPlacement = {
                    top: 'bottom',
                    right: 'left',
                    bottom: 'top',
                    left: 'right',
                };
                const staticSide = staticSideByPlacement[this.side] || 'bottom';

                this.arrowEl.style.left = arrowX != null ? `${arrowX}px` : '';
                this.arrowEl.style.top = arrowY != null ? `${arrowY}px` : '';
                this.arrowEl.style.right = '';
                this.arrowEl.style.bottom = '';
                this.arrowEl.style[staticSide] = '-5px';
            });
        },
    }));
}
