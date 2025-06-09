
export default function(Alpine) {
    Alpine.data('rzNavigationMenu', () => ({
        activeItemId: null,
        open: false,
        closeTimeout: null,
        closeDelay: 150,
        
        init() {
            this.$nextTick(() => {
                this.viewport = this.$refs.viewport;
                this.indicator = this.$refs.indicator;
                if(this.indicator) {
                    this.indicator.setAttribute('data-state', 'hidden');
                }
            });
        },
        
        isContentVisible(itemId) {
            return this.activeItemId === itemId && this.open;
        },

        toggleMenu() {
            const triggerEl = this.$el.closest('[x-data]').querySelector(`[aria-controls='${this.activeItemId}-content']`);
            const itemId = triggerEl.id.replace('-trigger', '');

            if (this.activeItemId === itemId && this.open) {
                this.closeMenu();
            } else {
                this.openMenu(itemId);
            }
        },

        openMenu(itemId) {
            this.clearCloseTimeout();
            this.activeItemId = itemId;
            this.open = true;

            this.$nextTick(() => {
                const trigger = this.$refs[`trigger_${itemId}`];
                if (trigger) {
                    this.updateIndicator(trigger);
                    trigger.setAttribute('data-state', 'open');
                    trigger.setAttribute('aria-expanded', 'true');
                }
            });
        },
        
        closeMenu() {
            if (!this.open) return;
            const currentTrigger = this.$refs[`trigger_${this.activeItemId}`];
            if (currentTrigger) {
                currentTrigger.setAttribute('data-state', 'closed');
                currentTrigger.setAttribute('aria-expanded', 'false');
            }
            this.activeItemId = null;
            this.open = false;

            if (this.indicator) {
                this.indicator.setAttribute('data-state', 'hidden');
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
            if (this.activeItemId !== itemId) {
                this.openMenu(itemId);
            } else {
                 this.cancelClose();
            }
        },

        updateIndicator(triggerEl) {
            if (!this.indicator) return;

            this.indicator.style.width = `${triggerEl.offsetWidth}px`;
            this.indicator.style.left = `${triggerEl.offsetLeft}px`;
            
            this.indicator.setAttribute('data-state', 'visible');
        }
    }));
}