// packages/rizzyui/src/js/lib/components/rzCommandGroup.js
export default function(Alpine) {
    Alpine.data('rzCommandGroup', () => ({
        parent: null,
        heading: '',
        headingId: '',

        /**
         * Initializes the group and registers its heading template with the parent command.
         * @returns {void}
         */
        init() {
            const parentEl = this.$el.closest('[x-data="rzCommand"]');
            if (!parentEl) {
                console.error('CommandGroup must be a child of RzCommand.');
                return;
            }
            this.parent = Alpine.$data(parentEl);

            this.heading = this.$el.dataset.heading;

            const template = this.$el.querySelector('template');
            const headingId = template?.dataset.headingId || '';
            const templateContent = template?.content ? template.content.cloneNode(true) : null;

            if (this.heading && templateContent) {
                this.parent.registerGroupTemplate(this.heading, templateContent, headingId);
            }
        }
    }));
}
