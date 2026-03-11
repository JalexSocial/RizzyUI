import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';

export default function rzPopover() {
    return {
        open: false,
        ariaExpanded: 'false',
        dataState: 'closed',
        contentStyle: '',
        triggerEl: null,
        contentEl: null,
        _documentClickHandler: null,
        _windowKeydownHandler: null,
        _cleanupAutoUpdate: null,

        init() {
            this.triggerEl = this.resolveTriggerElement();

            this.$watch('open', (value) => {
                this.ariaExpanded = value.toString();
                this.dataState = value ? 'open' : 'closed';

                if (value) {
                    this.openPopover();
                    return;
                }

                this.closePopover();
            });
        },

        destroy() {
            this.teardownAutoUpdate();
            this.detachGlobalListeners();
        },

        toggle() {
            this.open = !this.open;
        },

        async openPopover() {
            this.triggerEl = this.resolveTriggerElement();
            this.attachGlobalListeners();
            this.contentStyle = this.getInitialContentStyle();

            await this.$nextTick();
            this.contentEl = this.resolveContentElement();
            if (!this.triggerEl || !this.contentEl) {
                return;
            }

            await this.updatePosition();
            this.startAutoUpdate();
        },

        closePopover() {
            this.teardownAutoUpdate();
            this.detachGlobalListeners();
            this.contentEl = null;
        },

        resolveTriggerElement() {
            const directChildTrigger = Array.from(this.$el.children)
                .find((child) => child?.hasAttribute?.('data-trigger'));

            if (directChildTrigger) {
                return directChildTrigger;
            }

            return this.$el.querySelector('[data-trigger]');
        },

        resolveContentElement() {
            const contentId = this.$el.dataset.contentId;
            if (!contentId) {
                return null;
            }

            return document.getElementById(contentId);
        },

        attachGlobalListeners() {
            if (!this._documentClickHandler) {
                this._documentClickHandler = (event) => this.handleDocumentClick(event);
                document.addEventListener('pointerdown', this._documentClickHandler);
            }

            if (!this._windowKeydownHandler) {
                this._windowKeydownHandler = (event) => this.handleWindowKeydown(event);
                window.addEventListener('keydown', this._windowKeydownHandler);
            }
        },

        detachGlobalListeners() {
            if (this._documentClickHandler) {
                document.removeEventListener('pointerdown', this._documentClickHandler);
                this._documentClickHandler = null;
            }

            if (this._windowKeydownHandler) {
                window.removeEventListener('keydown', this._windowKeydownHandler);
                this._windowKeydownHandler = null;
            }
        },

        startAutoUpdate() {
            this.teardownAutoUpdate();
            if (!this.triggerEl || !this.contentEl) {
                return;
            }

            this._cleanupAutoUpdate = autoUpdate(this.triggerEl, this.contentEl, () => {
                void this.updatePosition();
            });
        },

        teardownAutoUpdate() {
            if (this._cleanupAutoUpdate) {
                this._cleanupAutoUpdate();
                this._cleanupAutoUpdate = null;
            }
        },

        parseNumber(value, fallback = null) {
            if (value === undefined || value === null || value === '') {
                return fallback;
            }

            const parsed = Number(value);
            return Number.isNaN(parsed) ? fallback : parsed;
        },

        getInitialContentStyle() {
            const strategy = this.$el.dataset.strategy || 'absolute';
            return `position: ${strategy}; left: 0px; top: 0px; visibility: hidden;`;
        },

        async updatePosition() {
            if (!this.triggerEl || !this.contentEl || !this.open) {
                return;
            }

            const anchor = this.$el.dataset.anchor || 'bottom';
            const mainOffset = this.parseNumber(this.$el.dataset.offset, 0);
            const crossAxisOffset = this.parseNumber(this.$el.dataset.crossAxisOffset, 0);
            const alignmentAxisOffset = this.parseNumber(this.$el.dataset.alignmentAxisOffset, null);
            const strategy = this.$el.dataset.strategy || 'absolute';
            const enableFlip = this.$el.dataset.enableFlip !== 'false';
            const enableShift = this.$el.dataset.enableShift !== 'false';
            const shiftPadding = this.parseNumber(this.$el.dataset.shiftPadding, 8);

            const middleware = [
                offset({
                    mainAxis: mainOffset,
                    crossAxis: crossAxisOffset,
                    alignmentAxis: alignmentAxisOffset
                })
            ];

            if (enableFlip) {
                middleware.push(flip());
            }

            if (enableShift) {
                middleware.push(shift({ padding: shiftPadding }));
            }

            const { x, y } = await computePosition(this.triggerEl, this.contentEl, {
                placement: anchor,
                strategy,
                middleware,
            });

            this.contentStyle = `position: ${strategy}; left: ${x}px; top: ${y}px; visibility: visible;`;
        },

        handleDocumentClick(event) {
            if (!this.open) {
                return;
            }

            const target = event.target;
            const clickedInsideTrigger = this.triggerEl?.contains?.(target) ?? false;
            const clickedInsideContent = this.contentEl?.contains?.(target) ?? false;

            if (clickedInsideTrigger || clickedInsideContent) {
                return;
            }

            this.open = false;
            this.$nextTick(() => this.restoreTriggerFocus());
        },

        handleWindowKeydown(event) {
            if (event.key !== 'Escape' || !this.open) {
                return;
            }

            this.open = false;
            this.$nextTick(() => this.restoreTriggerFocus());
        },

        restoreTriggerFocus() {
            if (this.triggerEl?.isConnected) {
                this.triggerEl.focus();
            }
        }
    };
}
