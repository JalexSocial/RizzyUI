import { computePosition, offset, flip, shift } from '@floating-ui/dom';

export default function(Alpine) {
    Alpine.data('rzPopover', () => ({
        open: false,
        ariaExpanded: 'false',
        triggerEl: null,
        contentEl: null,
        selfId: null,

        init() {
            if (!this.$el.id) this.$el.id = crypto.randomUUID();
            this.selfId = this.$el.id;
            this.triggerEl = this.$refs.trigger;
            // REMOVED: this.contentEl = this.$refs.content; // Unreliable due to x-teleport

            this.$watch('open', (value) => {
                this.ariaExpanded = value.toString();
                if (value) {
                    this.$nextTick(() => {
                        // ADDED: Find contentEl by ID when opening
                        this.contentEl = document.getElementById(`${this.selfId}-content`);
                        if (!this.contentEl) return;
                        this.updatePosition();
                    });
                } else {
                    this.contentEl = null; // Clear reference on close
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