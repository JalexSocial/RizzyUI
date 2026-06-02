const sidebarInstances = new WeakMap();

function isEditableTarget(target) {
    if (!target || target.nodeType !== 1) {
        return false;
    }

    const tagName = target.tagName?.toLowerCase();
    return target.isContentEditable === true
        || tagName === 'input'
        || tagName === 'textarea'
        || tagName === 'select';
}

function emitSidebarEvent(root, name, detail) {
    root?.dispatchEvent?.(new CustomEvent(name, { detail, bubbles: true }));
}

export default function rzSidebar() {
    return {
        open: true,
        openMobile: false,
        isMobile: false,
        collapsible: 'offcanvas',
        shortcut: 'b',
        cookieName: 'sidebar_state',
        mobileBreakpoint: 768,
        _keydownHandler: null,
        _resizeHandler: null,
        _lastOpenMobile: false,

        /**
         * Initializes the component, loading configuration from data attributes,
         * restoring persisted state from cookies, and setting up event listeners.
         */
        init() {
            sidebarInstances.get(this.$el)?.destroy?.();
            sidebarInstances.set(this.$el, this);

            this.collapsible = this.$el.dataset.collapsible || 'offcanvas';
            this.shortcut = this.$el.dataset.shortcut || 'b';
            this.cookieName = this.$el.dataset.cookieName || 'sidebar_state';
            this.mobileBreakpoint = parseInt(this.$el.dataset.mobileBreakpoint, 10) || 768;

            const defaultOpen = this.$el.dataset.defaultOpen === 'true';
            const savedState = this.cookieName ? document.cookie.split('; ').find(row => row.startsWith(`${this.cookieName}=`))?.split('=')[1] : null;

            this.open = savedState !== null && savedState !== undefined ? savedState === 'true' : defaultOpen;
            this._lastOpenMobile = this.openMobile;

            this.checkIfMobile();
            this.bindGlobalListeners();

            this.$watch('open', (value) => {
                if (this.cookieName) {
                    document.cookie = `${this.cookieName}=${value}; path=/; max-age=604800`;
                }

                emitSidebarEvent(this.$el, 'rz:sidebar:state-change', this.stateDetail());
            });

            this.$watch('openMobile', (value) => {
                if (this._lastOpenMobile === value) {
                    return;
                }

                this._lastOpenMobile = value;
                emitSidebarEvent(this.$el, value ? 'rz:sidebar:mobile-open' : 'rz:sidebar:mobile-close', this.stateDetail());
                emitSidebarEvent(this.$el, 'rz:sidebar:state-change', this.stateDetail());
            });

            this.$watch('isMobile', () => {
                this.openMobile = false;
                emitSidebarEvent(this.$el, 'rz:sidebar:breakpoint-change', this.stateDetail());
            });
        },

        /**
         * Removes window-level event listeners registered during initialization.
         */
        destroy() {
            if (this._keydownHandler) {
                window.removeEventListener('keydown', this._keydownHandler);
                this._keydownHandler = null;
            }

            if (this._resizeHandler) {
                window.removeEventListener('resize', this._resizeHandler);
                this._resizeHandler = null;
            }

            if (sidebarInstances.get(this.$el) === this) {
                sidebarInstances.delete(this.$el);
            }
        },

        /**
         * Registers global listeners used by the sidebar runtime.
         */
        bindGlobalListeners() {
            this.destroy();
            sidebarInstances.set(this.$el, this);

            this._keydownHandler = (event) => {
                if (event.defaultPrevented || isEditableTarget(event.target) || !this.shortcut) {
                    return;
                }

                if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === this.shortcut.toLowerCase()) {
                    event.preventDefault();
                    this.toggle();
                }
            };

            this._resizeHandler = () => {
                this.checkIfMobile();
            };

            window.addEventListener('keydown', this._keydownHandler);
            window.addEventListener('resize', this._resizeHandler);
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
         * Gets the trigger expanded state for the current viewport mode.
         * @returns {string} "true" or "false"
         */
        get triggerExpanded() {
            return (this.isMobile ? this.openMobile : this.open) ? 'true' : 'false';
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
        },

        /**
         * Creates a serializable state payload for custom events.
         * @returns {{open: boolean, openMobile: boolean, isMobile: boolean, desktopState: string, mobileState: string, collapsible: string}}
         */
        stateDetail() {
            return {
                open: this.open,
                openMobile: this.openMobile,
                isMobile: this.isMobile,
                desktopState: this.desktopState,
                mobileState: this.mobileState,
                collapsible: this.collapsible
            };
        }
    };
}
