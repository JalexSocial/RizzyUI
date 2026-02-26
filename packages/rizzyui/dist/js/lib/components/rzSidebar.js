
export default function(Alpine) {
    Alpine.data('rzSidebar', () => ({
        open: true,
        openMobile: false,
        isMobile: false,
        collapsible: 'offcanvas',
        shortcut: 'b',
        cookieName: 'sidebar_state',
        mobileBreakpoint: 768,

        /**
         * Initializes the component, loading configuration from data attributes,
         * restoring persisted state from cookies, and setting up event listeners.
         */
        init() {
            this.collapsible = this.$el.dataset.collapsible || 'offcanvas';
            this.shortcut = this.$el.dataset.shortcut || 'b';
            this.cookieName = this.$el.dataset.cookieName || 'sidebar_state';
            this.mobileBreakpoint = parseInt(this.$el.dataset.mobileBreakpoint) || 768;

            const defaultOpen = this.$el.dataset.defaultOpen === 'true';
            const savedState = this.cookieName ? document.cookie.split('; ').find(row => row.startsWith(`${this.cookieName}=`))?.split('=')[1] : null;

            this.open = savedState !== null && savedState !== undefined ? savedState === 'true' : defaultOpen;

            this.checkIfMobile();

            window.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === this.shortcut.toLowerCase()) {
                    e.preventDefault();
                    this.toggle();
                }
            });

            this.$watch('open', (value) => {
                if (this.cookieName) {
                    // Set cookie to persist state for 7 days
                    document.cookie = `${this.cookieName}=${value}; path=/; max-age=604800`;
                }
            });

            this.$watch('isMobile', () => {
                this.openMobile = false;
            });
        },

        /**
         * Checks if the current viewport width is below the configured mobile breakpoint.
         */
        checkIfMobile() {
            this.isMobile = window.innerWidth < this.mobileBreakpoint;
        },

        /**
         * Toggles the sidebar's visibility depending on the current viewport mode.
         */
        toggle() {
            if (this.isMobile) {
                this.openMobile = !this.openMobile;
            } else {
                this.open = !this.open;
            }
        },

        /**
         * Explicitly sets the open state for the desktop sidebar.
         * @param {boolean} value 
         */
        setOpen(value) {
            this.open = value;
        },

        /**
         * Explicitly sets the open state for the mobile sidebar.
         * @param {boolean} value 
         */
        setOpenMobile(value) {
            this.openMobile = value;
        },

        /**
         * Closes the sidebar for both mobile and desktop states.
         */
        close() {
            if (this.isMobile) {
                this.openMobile = false;
            } 
        },

        /**
         * Returns whether the mobile sidebar is currently open.
         * @returns {boolean}
         */
        isMobileOpen() {
            return this.openMobile;
        },

        /**
         * Gets the desktop state string representation for Tailwind data attributes.
         * @returns {string} "expanded" or "collapsed"
         */
        get desktopState() {
            return this.open ? 'expanded' : 'collapsed';
        },

        /**
         * Gets the current overall state string representation.
         * @returns {string} "expanded" or "collapsed"
         */
        get state() {
            return this.open ? 'expanded' : 'collapsed';
        },

        /**
         * Gets the mobile state string representation for Tailwind data attributes.
         * @returns {string} "open" or "closed"
         */
        get mobileState() {
            return this.openMobile ? 'open' : 'closed';
        },

        /**
         * Retrieves the collapsible attribute value when the sidebar is collapsed.
         * Used to toggle the CSS width configurations dynamically.
         * @returns {string}
         */
        getCollapsibleAttribute() {
            return this.state === 'collapsed' ? this.collapsible : '';
        }
    }));
}