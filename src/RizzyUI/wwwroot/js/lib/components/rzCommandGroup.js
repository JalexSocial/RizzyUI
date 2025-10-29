
// packages/rizzyui/src/js/lib/components/rzCommandGroup.js
export default function(Alpine) {
    Alpine.data('rzCommandGroup', () => ({
        parent: null,
        heading: '',
        templateId: '',

        init() {
            const parentEl = this.$el.closest('[x-data="rzCommand"]');
            if (!parentEl) {
                console.error('CommandGroup must be a child of RzCommand.');
                return;
            }
            this.parent = Alpine.$data(parentEl);
            
            this.heading = this.$el.dataset.heading;
            this.templateId = this.$el.dataset.templateId;

            if (this.heading && this.templateId) {
                this.parent.registerGroupTemplate(this.heading, this.templateId);
            }
        }
    }));
}