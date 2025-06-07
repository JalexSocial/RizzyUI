
// packages/rizzyui/src/js/lib/components/rzPopover.js
import { computePosition, offset, flip, shift } from '@floating-ui/dom';

export default function(Alpine) {
    Alpine.data('rzPopover', () => ({
        open: false,
        ariaExpanded: 'false',
        triggerEl: null,
        contentEl: null,

        init() {
            this.triggerEl = this.$refs.trigger.children[0] || this.$refs.trigger;
            this.contentEl = this.$refs.content;

            this.$watch('open', (value) => {
                this.ariaExpanded = value.toString();
                if (value) {
                    this.$nextTick(() => this.updatePosition());
                }
            });
        },

        updatePosition() {
            if (!this.triggerEl || !this.contentEl) return;

            const anchor = this.$el.dataset.anchor || 'bottom';
            const mainOffset = parseInt(this.$el.dataset.offset) || 0;
            const crossAxisOffset = parseInt(this.$el.dataset.crossAxisOffset) || 0;
            const alignmentAxisOffset = parseInt(this.$el.dataset.alignmentAxisOffset) || 0;
            const strategy = this.$el.dataset.strategy || 'absolute';
            const enableFlip = this.$el.dataset.enableFlip !== 'false';
            const enableShift = this.$el.dataset.enableShift !== 'false';
            const shiftPadding = parseInt(this.$el.dataset.shiftPadding) || 8;

            let middleware = [];

            middleware.push(offset({
                mainAxis: mainOffset,
                crossAxis: crossAxisOffset,
                alignmentAxis: alignmentAxisOffset
            }));

            if (enableFlip) {
                middleware.push(flip());
            }

            if (enableShift) {
                middleware.push(shift({ padding: shiftPadding }));
            }

            computePosition(this.triggerEl, this.contentEl, {
                placement: anchor,
                strategy: strategy,
                middleware: middleware,
            }).then(({ x, y }) => {
                Object.assign(this.contentEl.style, {
                    left: `${x}px`,
                    top: `${y}px`,
                });
            });
        },

        toggle() {
            this.open = !this.open;
        },

        handleOutsideClick() {
            if (!this.open) return;
            this.open = false;
        },

        handleWindowEscape() {
            if (this.open) {
                this.open = false;
                this.$nextTick(() => this.triggerEl?.focus());
            }
        }
    }));
}