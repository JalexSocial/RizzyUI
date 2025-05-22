
// --------------------------------------------------------------------------------
// Alpine.js component: rzSidebarLinkItem
// Manages individual sidebar link items, including collapsible behavior.
// --------------------------------------------------------------------------------
export default function(Alpine) {
    Alpine.data('rzSidebarLinkItem', () => {
        return {
            isExpanded: false,
            chevronExpandedClass: "",
            chevronCollapsedClass: "",
            init() {
                this.isExpanded = this.$el.dataset.expanded === "true"; // Ensure comparison with string "true"
                this.chevronExpandedClass = this.$el.dataset.chevronExpandedClass;
                this.chevronCollapsedClass = this.$el.dataset.chevronCollapsedClass;
            },
            isCollapsed() {
                return !this.isExpanded;
            },
            toggleExpanded() {
                this.isExpanded = !this.isExpanded;
            },
            hideSidebar() {
                // Check if the parent 'showSidebar' property exists before trying to set it
                // Assuming the parent component (or one ancestor up) has the rzSidebar data
                const sidebarScope = this.$el.closest('[x-data^="rzSidebar"]');
                if (sidebarScope) {
                    let data = Alpine.$data(sidebarScope);
                    data.showSidebar = false;
                } else {
                    console.warn("Parent sidebar context not found or 'showSidebar' is not defined.");
                }
            },
            getExpandedClass() {
                return this.isExpanded ? this.chevronExpandedClass : this.chevronCollapsedClass;
            },
            // Get the value for the aria-expanded attribute
            getAriaExpanded() {
                return this.isExpanded ? 'true' : 'false';
            }
        };
    });
}