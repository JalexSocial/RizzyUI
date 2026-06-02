import { registerDismissableLayer } from '../../runtime/a11y/dismissableLayer.js';
import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';

export default function rzPopover() {
    return {
        open: false,
        ariaExpanded: 'false',
        dataState: 'closed',
        contentStyle: '',
        triggerEl: null,
        contentEl: null,
        _cleanupAutoUpdate: null,
        _unregisterLayer: null,

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
            this.unregisterLayer();
        },

        toggle() {
            this.open = !this.open;
            if (!this.open) {
                this.$nextTick(() => this.restoreTriggerFocus());
            }
        },

        async openPopover() {
            this.triggerEl = this.resolveTriggerElement();
            this.contentStyle = this.getInitialContentStyle();

            await this.$nextTick();
            this.contentEl = this.resolveContentElement();
            if (!this.triggerEl || !this.contentEl) {
                return;
            }

            this.registerLayer();
            await this.updatePosition();
            this.startAutoUpdate();

            if (this.shouldFocusFirstElementOnOpen()) {
                this.focusFirstInteractiveElement();
            }
        },

        closePopover() {
            this.teardownAutoUpdate();
            this.unregisterLayer();
            this.contentEl = null;
        },

        registerLayer() {
            this.unregisterLayer();
            if (!this.contentEl) {
                return;
            }

            this._unregisterLayer = registerDismissableLayer({
                id: this.$el.id || undefined,
                root: this.contentEl,
                onDismiss: () => {
                    this.open = false;
                    this.$nextTick(() => this.restoreTriggerFocus());
                }
            });
        },

        unregisterLayer() {
            if (this._unregisterLayer) {
                this._unregisterLayer();
                this._unregisterLayer = null;
            }
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
            return contentId ? document.getElementById(contentId) : null;
        },

        shouldFocusFirstElementOnOpen() {
            return this.$el.dataset.focusFirstElementOnOpen === 'true';
        },

        focusFirstInteractiveElement() {
            if (!this.contentEl) {
                return;
            }

            const selector = [
                'button:not([disabled])',
                '[href]',
                'input:not([disabled]):not([type="hidden"])',
                'select:not([disabled])',
                'textarea:not([disabled])',
                '[tabindex]:not([tabindex="-1"])'
            ].join(',');

            const target = this.contentEl.querySelector(selector);
            if (target && typeof target.focus === 'function') {
                target.focus();
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

        restoreTriggerFocus() {
            if (this.triggerEl?.isConnected) {
                this.triggerEl.focus();
            }
        }
    };
}
