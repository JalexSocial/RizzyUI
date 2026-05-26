//#region src/js/lib/components/rzModal.js
function rzModal() {
	return {
		modalOpen: false,
		eventTriggerName: "",
		closeEventName: "rz:modal-close",
		closeOnEscape: true,
		closeOnClickOutside: true,
		modalId: "",
		bodyId: "",
		footerId: "",
		nonce: "",
		_escapeListener: null,
		_openListener: null,
		_closeEventListener: null,
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
				detail: {
					modalId: this.modalId,
					bodyId: this.bodyId,
					footerId: this.footerId
				},
				bubbles: true
			}));
			if (this.eventTriggerName) {
				this._openListener = (e) => {
					this.openModal(e);
				};
				window.addEventListener(this.eventTriggerName, this._openListener);
			}
			this._closeEventListener = (event) => {
				if (this.modalOpen) this.closeModalInternally("event");
			};
			window.addEventListener(this.closeEventName, this._closeEventListener);
			this._escapeListener = (e) => {
				if (this.modalOpen && this.closeOnEscape && e.key === "Escape") this.closeModalInternally("escape");
			};
			window.addEventListener("keydown", this._escapeListener);
			this.$watch("modalOpen", (value) => {
				const currentWidth = document.body.offsetWidth;
				document.body.classList.toggle("overflow-hidden", value);
				const scrollBarWidth = document.body.offsetWidth - currentWidth;
				document.body.style.setProperty("--page-scrollbar-width", `${scrollBarWidth}px`);
				if (value) this.$nextTick(() => {
					(this.$el.querySelector("[role=\"dialog\"], [role=\"alertdialog\"], [data-modal-panel=\"true\"]")?.querySelector("button, [href], input:not([type='hidden']), select, textarea, [tabindex]:not([tabindex=\"-1\"])"))?.focus();
					this.$el.dispatchEvent(new CustomEvent("rz:modal-after-open", {
						detail: { modalId: this.modalId },
						bubbles: true
					}));
				});
				else this.$nextTick(() => {
					this.$el.dispatchEvent(new CustomEvent("rz:modal-after-close", {
						detail: { modalId: this.modalId },
						bubbles: true
					}));
				});
			});
		},
		notModalOpen() {
			return !this.modalOpen;
		},
		destroy() {
			if (this._openListener && this.eventTriggerName) window.removeEventListener(this.eventTriggerName, this._openListener);
			if (this._closeEventListener) window.removeEventListener(this.closeEventName, this._closeEventListener);
			if (this._escapeListener) window.removeEventListener("keydown", this._escapeListener);
			document.body.classList.remove("overflow-hidden");
			document.body.style.setProperty("--page-scrollbar-width", `0px`);
		},
		openModal(event = null) {
			const beforeOpenEvent = new CustomEvent("rz:modal-before-open", {
				detail: {
					modalId: this.modalId,
					originalEvent: event
				},
				bubbles: true,
				cancelable: true
			});
			this.$el.dispatchEvent(beforeOpenEvent);
			if (!beforeOpenEvent.defaultPrevented) this.modalOpen = true;
		},
		closeModalInternally(reason = "unknown") {
			const beforeCloseEvent = new CustomEvent("rz:modal-before-close", {
				detail: {
					modalId: this.modalId,
					reason
				},
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
		closeModal() {
			this.closeModalInternally("button");
		},
		handleClickOutside() {
			if (this.closeOnClickOutside) this.closeModalInternally("backdrop");
		}
	};
}
//#endregion
//#region src/js/lib/components/rzSheet.js
function rzSheet() {
	return {
		open: false,
		init() {
			this.open = this.$el.dataset.defaultOpen === "true";
		},
		toggle() {
			this.open = !this.open;
		},
		close() {
			this.open = false;
		},
		show() {
			this.open = true;
		},
		state() {
			return this.open ? "open" : "closed";
		}
	};
}
//#endregion
//#region src/js/lib/components/rzSidebar.js
function rzSidebar() {
	return {
		open: true,
		openMobile: false,
		isMobile: false,
		collapsible: "offcanvas",
		shortcut: "b",
		cookieName: "sidebar_state",
		mobileBreakpoint: 768,
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
				if (this.cookieName) document.cookie = `${this.cookieName}=${value}; path=/; max-age=604800`;
			});
			this.$watch("isMobile", () => {
				this.openMobile = false;
			});
		},
		checkIfMobile() {
			this.isMobile = window.innerWidth < this.mobileBreakpoint;
		},
		toggle() {
			if (this.isMobile) this.openMobile = !this.openMobile;
			else this.open = !this.open;
		},
		setOpen(value) {
			this.open = value;
		},
		setOpenMobile(value) {
			this.openMobile = value;
		},
		close() {
			if (this.isMobile) this.openMobile = false;
		},
		isMobileOpen() {
			return this.openMobile;
		},
		get desktopState() {
			return this.open ? "expanded" : "collapsed";
		},
		get state() {
			return this.open ? "expanded" : "collapsed";
		},
		get mobileState() {
			return this.openMobile ? "open" : "closed";
		},
		getCollapsibleAttribute() {
			return this.state === "collapsed" ? this.collapsible : "";
		}
	};
}
//#endregion
export { rzModal, rzSheet, rzSidebar };

//# sourceMappingURL=dialogs-panels-runtime-Dq6uhPYF.js.map