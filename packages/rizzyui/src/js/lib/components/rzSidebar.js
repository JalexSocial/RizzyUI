
export default function(Alpine) {
    Alpine.data('rzSidebar', () => ({
        open: false,
        openMobile: false,
        isMobile: false,
        collapsible: 'offcanvas',
        shortcut: 'b',
        cookieName: 'sidebar_state',
        mobileBreakpoint: 768,

        init() {
            this.collapsible = this.$el.dataset.collapsible || 'offcanvas';
            this.shortcut = this.$el.dataset.shortcut || 'b';
            this.cookieName = this.$el.dataset.cookieName || 'sidebar_state';
            this.mobileBreakpoint = parseInt(this.$el.dataset.mobileBreakpoint) || 768;

            const savedState = this.cookieName ? document.cookie.split('; ').find(row => row.startsWith(`${this.cookieName}=`))?.split('=')[1] : null;
            const defaultOpen = this.$el.dataset.defaultOpen === 'true';
            
            this.open = savedState !== null ? savedState === 'true' : defaultOpen;

            this.checkIfMobile();
            window.addEventListener('resize', () => this.checkIfMobile());
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

        checkIfMobile() {
            this.isMobile = window.innerWidth < this.mobileBreakpoint;
        },

        toggle() {
            if (this.isMobile) {
                this.openMobile = !this.openMobile;
            } else {
                this.open = !this.open;
            }
        },

        toggleMobile() {
            this.openMobile = !this.openMobile;
        },

        close() {
            if (this.isMobile) {
                this.openMobile = false;
            }
        },

        isHidden() {
            return (this.isMobile && !this.openMobile) || (!this.isMobile && !this.open);
        },

        desktopState() {
            return this.open ? 'expanded' : 'collapsed';
        }
    }));
}