
export default function(Alpine) {
    Alpine.data('rzSidebar', () => ({
        open: false,
        openMobile: false,
        isMobile: false,
        collapsible: 'offcanvas',
        shortcut: 'b',
        cookieName: 'sidebar_state',
        mobileBreakpoint: 768,

        /**
         * Executes the `init` operation.
         * @returns {any} Returns the result of `init` when applicable.
         */
        init() {
            this.collapsible = this.$el.dataset.collapsible || 'offcanvas';
            this.shortcut = this.$el.dataset.shortcut || 'b';
            this.cookieName = this.$el.dataset.cookieName || 'sidebar_state';
            this.mobileBreakpoint = parseInt(this.$el.dataset.mobileBreakpoint) || 768;

            const savedState = this.cookieName ? document.cookie.split('; ').find(row => row.startsWith(`${this.cookieName}=`))?.split('=')[1] : null;
            const defaultOpen = this.$el.dataset.defaultOpen === 'true';

            this.open = savedState !== null ? savedState === 'true' : defaultOpen;

            this.checkIfMobile();

            window.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === this.shortcut.toLowerCase()) {
                    e.preventDefault();
                    this.toggle();
                }
            });

            this.$watch('open', (value) => {
                if (this.cookieName) {
                    document.cookie = `${this.cookieName}=${value}; path=/; max-age=31536000`; // Expires in 1 year
                }
            });
        },
        
        /**
         * Executes the `checkIfMobile` operation.
         * @returns {any} Returns the result of `checkIfMobile` when applicable.
         */
        checkIfMobile() {
            this.isMobile = window.innerWidth < this.mobileBreakpoint;
        },

        /**
         * Executes the `toggle` operation.
         * @returns {any} Returns the result of `toggle` when applicable.
         */
        toggle() {
            if (this.isMobile) {
                this.openMobile = !this.openMobile;
            } else {
                this.open = !this.open;
            }
        },

        /**
         * Executes the `close` operation.
         * @returns {any} Returns the result of `close` when applicable.
         */
        close() {
            if (this.isMobile) {
                this.openMobile = false;
            }
        },

        /**
         * Executes the `isMobileOpen` operation.
         * @returns {any} Returns the result of `isMobileOpen` when applicable.
         */
        isMobileOpen() {
            return this.openMobile;
        },

        /**
         * Executes the `desktopState` operation.
         * @returns {any} Returns the result of `desktopState` when applicable.
         */
        desktopState() {
            return this.open ? 'expanded' : 'collapsed';
        },

        /**
         * Executes the `mobileState` operation.
         * @returns {any} Returns the result of `mobileState` when applicable.
         */
        mobileState() {
            return this.openMobile ? 'open' : 'closed';
        },

        /**
         * Executes the `getCollapsibleAttribute` operation.
         * @returns {any} Returns the result of `getCollapsibleAttribute` when applicable.
         */
        getCollapsibleAttribute() {
            return this.desktopState() === 'collapsed' ? this.collapsible : '';
        }
    }));
}
