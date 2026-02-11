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

        getBooleanDataset(name, fallbackValue) {
            const value = this.$el.dataset[name];
            if (typeof value === 'undefined') return fallbackValue;
            return value === 'true';
        },

        getNumberDataset(name, fallbackValue) {
            const value = Number(this.$el.dataset[name]);
            return Number.isFinite(value) ? value : fallbackValue;
        },

        getNullableNumberDataset(name, fallbackValue) {
            const raw = this.$el.dataset[name];
            if (typeof raw === 'undefined' || raw === null || raw === '') return fallbackValue;
            const value = Number(raw);
            return Number.isFinite(value) ? value : fallbackValue;
        },

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

        startAutoUpdate() {
            if (!this.enableAutoUpdate || !this.triggerEl || !this.contentEl) return;
            this.stopAutoUpdate();
            this.cleanupAutoUpdate = autoUpdate(this.triggerEl, this.contentEl, () => {
                this.updatePosition();
            });
        },

        stopAutoUpdate() {
            if (typeof this.cleanupAutoUpdate === 'function') {
                this.cleanupAutoUpdate();
                this.cleanupAutoUpdate = null;
            }
        },

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

        handleTriggerPointerEnter() {
            this.queueOpen();
        },

        handleTriggerPointerLeave() {
            this.queueClose();
        },

        handleTriggerFocus() {
            this.queueOpen();
        },

        handleTriggerBlur() {
            this.queueClose();
        },

        handleContentPointerEnter() {
            if (this.disableHoverableContent) return;
            if (this.closeDelayTimer) {
                window.clearTimeout(this.closeDelayTimer);
                this.closeDelayTimer = null;
            }
        },

        handleContentPointerLeave() {
            if (this.disableHoverableContent) return;
            this.queueClose();
        },

        handleTriggerKeydown(event) {
            if (event.key === 'Escape') {
                this.handleWindowEscape();
            }
        },

        handleWindowEscape() {
            this.clearTimers();
            this.open = false;
            this.$nextTick(() => this.triggerEl?.focus());
        },

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
