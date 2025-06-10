
import { computePosition, offset, flip, shift } from '@floating-ui/dom';

export default function(Alpine) {
    Alpine.data('rzNavigationMenu', () => ({
        activeItemId: null,
        open: false,
        closeTimeout: null,
        closeDelay: 150,
        
        init() {
            this.$nextTick(() => {
                this.list = this.$refs.list;
                this.viewport = this.$refs.viewport;
                this.indicator = this.$refs.indicator;
                if(this.indicator) {
                    this.indicator.setAttribute('data-state', 'hidden');
                }
            });
        },
        
        isContentVisible() {
            return this.activeItemId === this.$el.dataset.itemId && this.open;
        },

        toggleActive(event) {
            const triggerEl = event.currentTarget;
            const itemId = triggerEl.id.replace('-trigger', '');

            if (this.activeItemId === itemId && this.open) {
                this.closeMenu();
            } else {
                this.openMenu(itemId);
            }
        },

        openMenu(itemId) {
            this.clearCloseTimeout();

            // Close the previously active item before opening the new one
            if (this.activeItemId && this.activeItemId !== itemId) {
                const oldTrigger = this.$refs[`trigger_${this.activeItemId}`];
                if (oldTrigger) {
                    oldTrigger.setAttribute('data-state', 'closed');
                    oldTrigger.setAttribute('aria-expanded', 'false');
                }
            }
            
            this.activeItemId = itemId;
            this.open = true;

            this.$nextTick(() => {
                const trigger = this.$refs[`trigger_${itemId}`];
                if (trigger) {
                    this.updatePositions(trigger);
                    trigger.setAttribute('data-state', 'open');
                    trigger.setAttribute('aria-expanded', 'true');
                    this.viewport.setAttribute('data-state', 'open');
                }
            });
        },
        
        closeMenu() {
            if (!this.open) return;
            if (this.activeItemId) {
                const currentTrigger = this.$refs[`trigger_${this.activeItemId}`];
                if (currentTrigger) {
                    currentTrigger.setAttribute('data-state', 'closed');
                    currentTrigger.setAttribute('aria-expanded', 'false');
                }
            }

            this.activeItemId = null;
            this.open = false;

            if (this.indicator) {
                this.indicator.setAttribute('data-state', 'hidden');
            }
            if (this.viewport) {
                this.viewport.setAttribute('data-state', 'closed');
            }
        },

        scheduleClose() {
            this.clearCloseTimeout();
            this.closeTimeout = setTimeout(() => this.closeMenu(), this.closeDelay);
        },
        
        cancelClose() {
            this.clearCloseTimeout();
        },

        clearCloseTimeout() {
            if(this.closeTimeout) {
                clearTimeout(this.closeTimeout);
                this.closeTimeout = null;
            }
        },

        handleTriggerEnter(event) {
            const triggerEl = event.currentTarget;
            const itemId = triggerEl.id.replace('-trigger', '');
            
            this.clearCloseTimeout();
            
            if (this.activeItemId !== itemId) {
                this.openMenu(itemId);
            }
        },
        
        updatePositions(triggerEl) {
            if (!this.viewport || !this.list || !this.indicator) return;

            // Update Indicator
            this.indicator.style.width = `${triggerEl.offsetWidth}px`;
            this.indicator.style.left = `${triggerEl.offsetLeft}px`;
            this.indicator.setAttribute('data-state', 'visible');
            
            // Update Viewport
            const viewportOffset = parseInt(this.$el.dataset.viewportOffset) || 0;
            const contentEl = this.$refs[`content_${this.activeItemId}`];

            if (!contentEl) return;
            
            // Set viewport size based on its active content
            this.viewport.style.width = `${contentEl.offsetWidth}px`;
            this.viewport.style.height = `${contentEl.offsetHeight}px`;

            // Position viewport relative to the list container
            computePosition(this.list, this.viewport, {
                placement: 'bottom',
                middleware: [offset(viewportOffset), flip(), shift({padding: 8})],
            }).then(({y}) => {
                Object.assign(this.viewport.style, {
                    left: '50%',
                    top: `${y}px`,
                    transform: 'translateX(-50%)',
                });
            });
        },
    }));
}