// --------------------------------------------------------------------------------
// window.Alpine.js component: accordionItem
// This component controls each individual accordion section.
// It accesses 'selected' and 'allowMultiple' from the parent rzAccordion scope.
// --------------------------------------------------------------------------------
export default function accordionItem() {
    return {
        open: false,
        sectionId: "",
        expandedClass: "",
        /**
         * Executes the `init` operation.
         * @returns {any} Returns the result of `init` when applicable.
         */
        init() {
            this.open = this.$el.dataset.isOpen === "true";
            this.sectionId = this.$el.dataset.sectionId;
            this.expandedClass = this.$el.dataset.expandedClass;

            const self = this;
            if (typeof this.selected !== 'undefined' && typeof this.allowMultiple !== 'undefined') {
                this.$watch('selected', (value) => {
                    if (value !== self.sectionId && !self.allowMultiple) {
                        self.open = false;
                    }
                });
            } else {
                console.warn("accordionItem: Could not find 'selected' or 'allowMultiple' in parent scope for $watch.");
            }
        },
        /**
         * Executes the `destroy` operation.
         * @returns {any} Returns the result of `destroy` when applicable.
         */
        destroy() {
            // Cleanup if needed
        },
        toggle() {
            this.selected = this.sectionId;
            this.open = !this.open;
        },
        getExpandedCss() {
            return this.open ? this.expandedClass : "";
        },
        getAriaExpanded() {
            return this.open ? 'true' : 'false';
        },
        handleKeydown(event) {
            if (!event || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
                return;
            }

            const accordion = this.$el.closest('[data-slot="accordion"]');
            const triggers = Array.from(accordion?.querySelectorAll('[data-slot="accordion-trigger"]') ?? [])
                .filter((trigger) => !trigger.disabled && trigger.getAttribute('aria-disabled') !== 'true');

            if (triggers.length === 0) {
                return;
            }

            const currentIndex = triggers.indexOf(event.currentTarget);
            if (currentIndex === -1) {
                return;
            }

            event.preventDefault();
            let nextIndex = currentIndex;

            if (event.key === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % triggers.length;
            } else if (event.key === 'ArrowUp') {
                nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
            } else if (event.key === 'Home') {
                nextIndex = 0;
            } else if (event.key === 'End') {
                nextIndex = triggers.length - 1;
            }

            triggers[nextIndex]?.focus();
        }
    };
}
