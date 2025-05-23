
// --------------------------------------------------------------------------------
// Alpine.js component: rzTabs
// Implements tabbed navigation with keyboard support and marker repositioning.
// --------------------------------------------------------------------------------
export default function(Alpine) {
    Alpine.data('rzTabs', () => {
        return {
            buttonRef: null,
            tabSelected: '',
            tabButton: null,
            init() {
                this.buttonRef = document.getElementById(this.$el.dataset.buttonref);
                this.tabSelected = this.$el.dataset.tabselected;
                this.tabButton = this.buttonRef.querySelector('[data-name=\'' + this.tabSelected + '\']');
                this.tabRepositionMarker(this.tabButton);
            },
            tabButtonClicked(tabButton) {
                if (tabButton instanceof Event)
                    tabButton = tabButton.target;
                this.tabSelected = tabButton.dataset.name;
                this.tabRepositionMarker(tabButton);
                tabButton.focus();
            },
            tabRepositionMarker(tabButton) {
                this.tabButton = tabButton;
                this.$refs.tabMarker.style.width = tabButton.offsetWidth + 'px';
                this.$refs.tabMarker.style.height = tabButton.offsetHeight + 'px';
                this.$refs.tabMarker.style.left = tabButton.offsetLeft + 'px';
                setTimeout(() => {
                    this.$refs.tabMarker.style.opacity = 1;
                }, 150);
            },
            // Get the CSS classes for the tab content panel based on selection
            getTabContentCss() {
                return this.tabSelected === this.$el.dataset.name ? '' : 'hidden';
            },
            tabContentActive(tabContent) {
                tabContent = tabContent ?? this.$el;
                return this.tabSelected === tabContent.dataset.name;
            },
            tabButtonActive(tabButton) {
                tabButton = tabButton ?? this.$el;
                return this.tabSelected === tabButton.dataset.name;
            },            
            // Get the value for the aria-selected attribute
            getTabButtonAriaSelected() {
                return this.tabSelected === this.$el.dataset.name ? 'true' : 'false';
            },
            // Get the CSS classes for the tab button text color based on selection
            getSelectedTabTextColorCss() {
                const color = this.$el.dataset.selectedtextcolor ?? '';
                return this.tabSelected === this.$el.dataset.name ? color : '';
            },
            handleResize() {
                this.tabRepositionMarker(this.tabButton);
            },
            handleKeyDown(event) {
                const key = event.key;
                const tabButtons = Array.from(this.buttonRef.querySelectorAll('[role=\'tab\']'));
                const currentIndex = tabButtons.findIndex(button => this.tabSelected === button.dataset.name);
                let newIndex = currentIndex;

                if (key === 'ArrowRight') {
                    newIndex = (currentIndex + 1) % tabButtons.length;
                    event.preventDefault();
                } else if (key === 'ArrowLeft') {
                    newIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
                    event.preventDefault();
                } else if (key === 'Home') {
                    newIndex = 0;
                    event.preventDefault();
                } else if (key === 'End') {
                    newIndex = tabButtons.length - 1;
                    event.preventDefault();
                }

                if (newIndex !== currentIndex) {
                    this.tabButtonClicked(tabButtons[newIndex]);
                }
            }
        };
    });
}