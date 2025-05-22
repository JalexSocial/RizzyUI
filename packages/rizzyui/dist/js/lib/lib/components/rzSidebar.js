
// --------------------------------------------------------------------------------
// Alpine.js component: rzSidebar
// Controls the visibility and animation of a collapsible sidebar.
// --------------------------------------------------------------------------------
export default function(Alpine) {
    Alpine.data('rzSidebar', () => {
        return {
            showSidebar: false,
            isSidebarHidden() {
                return !this.showSidebar;
            },
            toggleSidebar() {
                this.showSidebar = !this.showSidebar;
            },
            hideSidebar() {
                this.showSidebar = false;
            },
            // Return translation classes based on sidebar state for smooth slide-in/out
            getSidebarTranslation() {
                return this.showSidebar ? 'translate-x-0' : '-translate-x-60';
            }
        };
    });
}