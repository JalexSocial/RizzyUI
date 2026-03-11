function rzModal() {
  return {
    modalOpen: false,
    // Main state variable
    eventTriggerName: "",
    closeEventName: "rz:modal-close",
    // Default value, corresponds to Constants.Events.ModalClose
    closeOnEscape: true,
    closeOnClickOutside: true,
    modalId: "",
    bodyId: "",
    footerId: "",
    nonce: "",
    _escapeListener: null,
    _openListener: null,
    _closeEventListener: null,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.modalId = this.$el.dataset.modalId || "";
      this.bodyId = this.$el.dataset.bodyId || "";
      this.footerId = this.$el.dataset.footerId || "";
      this.nonce = this.$el.dataset.nonce || "";
      this.eventTriggerName = this.$el.dataset.eventTriggerName || "";
      this.closeEventName = this.$el.dataset.closeEventName || this.closeEventName;
      this.closeOnEscape = this.$el.dataset.closeOnEscape !== "false";
      this.closeOnClickOutside = this.$el.dataset.closeOnClickOutside !== "false";
      this.$el.dispatchEvent(new CustomEvent("rz:modal-initialized", {
        detail: { modalId: this.modalId, bodyId: this.bodyId, footerId: this.footerId },
        bubbles: true
      }));
      if (this.eventTriggerName) {
        this._openListener = (e) => {
          this.openModal(e);
        };
        window.addEventListener(this.eventTriggerName, this._openListener);
      }
      this._closeEventListener = (event) => {
        if (this.modalOpen) {
          this.closeModalInternally("event");
        }
      };
      window.addEventListener(this.closeEventName, this._closeEventListener);
      this._escapeListener = (e) => {
        if (this.modalOpen && this.closeOnEscape && e.key === "Escape") {
          this.closeModalInternally("escape");
        }
      };
      window.addEventListener("keydown", this._escapeListener);
      this.$watch("modalOpen", (value) => {
        const currentWidth = document.body.offsetWidth;
        document.body.classList.toggle("overflow-hidden", value);
        const scrollBarWidth = document.body.offsetWidth - currentWidth;
        document.body.style.setProperty("--page-scrollbar-width", `${scrollBarWidth}px`);
        if (value) {
          this.$nextTick(() => {
            const dialogElement = this.$el.querySelector('[role="dialog"], [role="alertdialog"], [data-modal-panel="true"]');
            const focusable = dialogElement?.querySelector(`button, [href], input:not([type='hidden']), select, textarea, [tabindex]:not([tabindex="-1"])`);
            focusable?.focus();
            this.$el.dispatchEvent(new CustomEvent("rz:modal-after-open", {
              detail: { modalId: this.modalId },
              bubbles: true
            }));
          });
        } else {
          this.$nextTick(() => {
            this.$el.dispatchEvent(new CustomEvent("rz:modal-after-close", {
              detail: { modalId: this.modalId },
              bubbles: true
            }));
          });
        }
      });
    },
    /**
     * Executes the `notModalOpen` operation.
     * @returns {any} Returns the result of `notModalOpen` when applicable.
     */
    notModalOpen() {
      return !this.modalOpen;
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      if (this._openListener && this.eventTriggerName) {
        window.removeEventListener(this.eventTriggerName, this._openListener);
      }
      if (this._closeEventListener) {
        window.removeEventListener(this.closeEventName, this._closeEventListener);
      }
      if (this._escapeListener) {
        window.removeEventListener("keydown", this._escapeListener);
      }
      document.body.classList.remove("overflow-hidden");
      document.body.style.setProperty("--page-scrollbar-width", `0px`);
    },
    /**
     * Executes the `openModal` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `openModal` when applicable.
     */
    openModal(event = null) {
      const beforeOpenEvent = new CustomEvent("rz:modal-before-open", {
        detail: { modalId: this.modalId, originalEvent: event },
        bubbles: true,
        cancelable: true
      });
      this.$el.dispatchEvent(beforeOpenEvent);
      if (!beforeOpenEvent.defaultPrevented) {
        this.modalOpen = true;
      }
    },
    // Internal close function called by button, escape, backdrop, event
    closeModalInternally(reason = "unknown") {
      const beforeCloseEvent = new CustomEvent("rz:modal-before-close", {
        detail: { modalId: this.modalId, reason },
        bubbles: true,
        cancelable: true
      });
      this.$el.dispatchEvent(beforeCloseEvent);
      if (!beforeCloseEvent.defaultPrevented) {
        document.activeElement?.blur && document.activeElement.blur();
        this.modalOpen = false;
        document.body.classList.remove("overflow-hidden");
        document.body.style.setProperty("--page-scrollbar-width", `0px`);
      }
    },
    // Called only by the explicit close button in the template
    closeModal() {
      this.closeModalInternally("button");
    },
    // Method called by x-on:click.outside on the dialog element
    handleClickOutside() {
      if (this.closeOnClickOutside) {
        this.closeModalInternally("backdrop");
      }
    }
  };
}
function rzSheet() {
  return {
    open: false,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      this.open = this.$el.dataset.defaultOpen === "true";
    },
    /**
     * Executes the `toggle` operation.
     * @returns {any} Returns the result of `toggle` when applicable.
     */
    toggle() {
      this.open = !this.open;
    },
    /**
     * Executes the `close` operation.
     * @returns {any} Returns the result of `close` when applicable.
     */
    close() {
      this.open = false;
    },
    /**
     * Executes the `show` operation.
     * @returns {any} Returns the result of `show` when applicable.
     */
    show() {
      this.open = true;
    },
    /**
     * Executes the `state` operation.
     * @returns {any} Returns the result of `state` when applicable.
     */
    state() {
      return this.open ? "open" : "closed";
    }
  };
}
function rzSidebar() {
  return {
    open: true,
    openMobile: false,
    isMobile: false,
    collapsible: "offcanvas",
    shortcut: "b",
    cookieName: "sidebar_state",
    mobileBreakpoint: 768,
    /**
     * Initializes the component, loading configuration from data attributes,
     * restoring persisted state from cookies, and setting up event listeners.
     */
    init() {
      this.collapsible = this.$el.dataset.collapsible || "offcanvas";
      this.shortcut = this.$el.dataset.shortcut || "b";
      this.cookieName = this.$el.dataset.cookieName || "sidebar_state";
      this.mobileBreakpoint = parseInt(this.$el.dataset.mobileBreakpoint) || 768;
      const defaultOpen = this.$el.dataset.defaultOpen === "true";
      const savedState = this.cookieName ? document.cookie.split("; ").find((row) => row.startsWith(`${this.cookieName}=`))?.split("=")[1] : null;
      this.open = savedState !== null && savedState !== void 0 ? savedState === "true" : defaultOpen;
      this.checkIfMobile();
      window.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === this.shortcut.toLowerCase()) {
          e.preventDefault();
          this.toggle();
        }
      });
      this.$watch("open", (value) => {
        if (this.cookieName) {
          document.cookie = `${this.cookieName}=${value}; path=/; max-age=604800`;
        }
      });
      this.$watch("isMobile", () => {
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
      return this.open ? "expanded" : "collapsed";
    },
    /**
     * Gets the current overall state string representation.
     * @returns {string} "expanded" or "collapsed"
     */
    get state() {
      return this.open ? "expanded" : "collapsed";
    },
    /**
     * Gets the mobile state string representation for Tailwind data attributes.
     * @returns {string} "open" or "closed"
     */
    get mobileState() {
      return this.openMobile ? "open" : "closed";
    },
    /**
     * Retrieves the collapsible attribute value when the sidebar is collapsed.
     * Used to toggle the CSS width configurations dynamically.
     * @returns {string}
     */
    getCollapsibleAttribute() {
      return this.state === "collapsed" ? this.collapsible : "";
    }
  };
}
export {
  rzModal,
  rzSheet,
  rzSidebar
};
//# sourceMappingURL=dialogs-panels-runtime-BPjnRdD7.js.map
