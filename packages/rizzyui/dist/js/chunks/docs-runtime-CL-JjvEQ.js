import { r as rizzyRequire } from "./bootstrap-DmUTAXwT.js";
function rzBrowser() {
  return {
    screenSize: "",
    /**
     * Executes the `setDesktopScreenSize` operation.
     * @returns {any} Returns the result of `setDesktopScreenSize` when applicable.
     */
    setDesktopScreenSize() {
      this.screenSize = "";
    },
    /**
     * Executes the `setTabletScreenSize` operation.
     * @returns {any} Returns the result of `setTabletScreenSize` when applicable.
     */
    setTabletScreenSize() {
      this.screenSize = "max-w-2xl";
    },
    /**
     * Executes the `setPhoneScreenSize` operation.
     * @returns {any} Returns the result of `setPhoneScreenSize` when applicable.
     */
    setPhoneScreenSize() {
      this.screenSize = "max-w-sm";
    },
    // Get CSS classes for browser border based on screen size
    getBrowserBorderCss() {
      return [this.screenSize, this.screenSize === "" ? "border-none" : "border-x"];
    },
    // Get CSS classes for desktop screen button styling
    getDesktopScreenCss() {
      return [this.screenSize === "" ? "text-foreground forced-color-adjust-auto dark:text-foreground" : "opacity-60"];
    },
    // Get CSS classes for tablet screen button styling
    getTabletScreenCss() {
      return [this.screenSize === "max-w-2xl" ? "text-foreground forced-color-adjust-auto dark:text-foreground" : "opacity-60"];
    },
    // Get CSS classes for phone screen button styling
    getPhoneScreenCss() {
      return [this.screenSize === "max-w-sm" ? "text-foreground forced-color-adjust-auto dark:text-foreground" : "opacity-60"];
    }
  };
}
function rzCodeViewer() {
  return {
    expand: false,
    border: true,
    copied: false,
    copyTitle: "Copy",
    // Default title
    copiedTitle: "Copied!",
    // Default title
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const assets = JSON.parse(this.$el.dataset.assets);
      const codeId = this.$el.dataset.codeid;
      const nonce = this.$el.dataset.nonce;
      this.copyTitle = this.$el.dataset.copyTitle || this.copyTitle;
      this.copiedTitle = this.$el.dataset.copiedTitle || this.copiedTitle;
      rizzyRequire(assets, {
        success: function() {
          const codeBlock = document.getElementById(codeId);
          if (window.hljs && codeBlock) {
            window.hljs.highlightElement(codeBlock);
          }
        },
        error: function() {
          console.error("Failed to load Highlight.js");
        }
      }, nonce);
    },
    // Function to check if code is NOT copied (for x-show)
    notCopied() {
      return !this.copied;
    },
    // Function to reset the copied state (e.g., on blur)
    disableCopied() {
      this.copied = false;
    },
    // Function to toggle the expand state
    toggleExpand() {
      this.expand = !this.expand;
    },
    // Function to copy code to clipboard
    copyHTML() {
      navigator.clipboard.writeText(this.$refs.codeBlock.textContent);
      this.copied = !this.copied;
    },
    // Get the title for the copy button (copy/copied)
    getCopiedTitle() {
      return this.copied ? this.copiedTitle : this.copyTitle;
    },
    // Get CSS classes for the copy button based on copied state
    getCopiedCss() {
      return [this.copied ? "focus-visible:outline-success" : "focus-visible:outline-foreground"];
    },
    // Get CSS classes for the code container based on expand state
    getExpandCss() {
      return [this.expand ? "" : "max-h-60"];
    },
    // Get CSS classes for the expand button icon based on expand state
    getExpandButtonCss() {
      return this.expand ? "rotate-180" : "rotate-0";
    }
  };
}
function rzEmbeddedPreview() {
  return {
    iframe: null,
    onDarkModeToggle: null,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      try {
        this.iframe = this.$refs.iframe;
        const resize = this.debounce(() => {
          this.resizeIframe(this.iframe);
        }, 50);
        this.resizeIframe(this.iframe);
        const resizeObserver = new ResizeObserver((entries) => {
          for (let entry of entries) {
            resize();
          }
        });
        resizeObserver.observe(this.iframe);
        const iframe = this.iframe;
        this.onDarkModeToggle = (event) => {
          iframe.contentWindow.postMessage(event.detail, "*");
        };
        window.addEventListener("darkModeToggle", this.onDarkModeToggle);
      } catch (error) {
        console.error("Cannot access iframe content");
      }
    },
    // Adjusts the iframe height based on its content
    resizeIframe(iframe) {
      if (iframe) {
        try {
          const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDocument) {
            const iframeBody = iframeDocument.body;
            if (!iframeBody) {
              setInterval(() => {
                this.resizeIframe(iframe);
              }, 150);
            } else {
              const newHeight = iframeBody.scrollHeight + 15;
              iframe.style.height = newHeight + "px";
            }
          }
        } catch (error) {
          console.error("Error resizing iframe:", error);
        }
      }
    },
    // Debounce helper to limit function calls
    debounce(func, timeout = 300) {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          func.apply(this, args);
        }, timeout);
      };
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      window.removeEventListener("darkModeToggle", this.onDarkModeToggle);
    }
  };
}
const PREVIEW_MAX_LENGTH = 160;
function rzEventViewer() {
  return {
    eventNames: [],
    entries: [],
    error: null,
    paused: false,
    copied: false,
    copyTitle: "Copy",
    copiedTitle: "Copied!",
    listeningStatusText: "Listening",
    pausedStatusText: "Paused",
    expandText: "Expand event details",
    collapseText: "Collapse event details",
    target: "window",
    targetEl: null,
    maxEntries: 200,
    autoScroll: true,
    pretty: true,
    showTimestamp: true,
    showEventMeta: false,
    level: "info",
    filterPath: "",
    stickToBottom: true,
    expandedEntryId: null,
    _handlers: /* @__PURE__ */ new Map(),
    _boundEvents: /* @__PURE__ */ new Set(),
    _entryId: 0,
    hasError() {
      return this.error !== null;
    },
    isPaused() {
      return this.paused;
    },
    notPaused() {
      return !this.paused;
    },
    notCopied() {
      return !this.copied;
    },
    entryCount() {
      return this.entries.length;
    },
    getStatusText() {
      return this.paused ? this.pausedStatusText : this.listeningStatusText;
    },
    init() {
      this.target = this.$el.dataset.target || "window";
      this.maxEntries = Number.parseInt(this.$el.dataset.maxEntries || "200", 10);
      this.autoScroll = this.parseBoolean(this.$el.dataset.autoScroll, true);
      this.pretty = this.parseBoolean(this.$el.dataset.pretty, true);
      this.showTimestamp = this.parseBoolean(this.$el.dataset.showTimestamp, true);
      this.showEventMeta = this.parseBoolean(this.$el.dataset.showEventMeta, false);
      this.level = this.$el.dataset.level || "info";
      this.filterPath = this.$el.dataset.filter || "";
      this.copyTitle = this.$el.dataset.copyTitle || this.copyTitle;
      this.copiedTitle = this.$el.dataset.copiedTitle || this.copiedTitle;
      this.listeningStatusText = this.$el.dataset.listeningText || this.listeningStatusText;
      this.pausedStatusText = this.$el.dataset.pausedText || this.pausedStatusText;
      this.expandText = this.$el.dataset.expandText || this.expandText;
      this.collapseText = this.$el.dataset.collapseText || this.collapseText;
      this.eventNames = this.resolveEventNames();
      if (this.eventNames.length === 0) {
        this.error = "At least one event name is required.";
        return;
      }
      this.targetEl = this.resolveTargetElement(this.target);
      if (!this.targetEl) {
        this.error = `Unable to resolve target: ${this.target}`;
        return;
      }
      for (const eventName of this.eventNames) {
        const handler = this.createHandler(eventName);
        this._handlers.set(eventName, handler);
        this.targetEl.addEventListener(eventName, handler);
        this._boundEvents.add(eventName);
      }
      this.appendSystemEntry(`Listening for: ${this.eventNames.join(", ")}`);
    },
    destroy() {
      if (this.targetEl) {
        for (const [eventName, handler] of this._handlers.entries()) {
          this.targetEl.removeEventListener(eventName, handler);
        }
      }
      this._handlers.clear();
      this._boundEvents.clear();
    },
    parseBoolean(value, defaultValue) {
      if (typeof value !== "string" || value.length === 0) {
        return defaultValue;
      }
      return value === "true";
    },
    resolveEventNames() {
      const names = [];
      const single = this.$el.dataset.eventName || "";
      const multiple = this.$el.dataset.eventNames || "";
      if (single.trim().length > 0) {
        names.push(single.trim());
      }
      if (multiple.trim().length > 0) {
        const raw = multiple.trim();
        if (raw.startsWith("[")) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              for (const entry of parsed) {
                if (typeof entry === "string") {
                  names.push(entry.trim());
                } else {
                  this.appendSystemEntry("Ignored non-string event name in JSON array.");
                }
              }
            }
          } catch {
            this.appendSystemEntry("Failed to parse JSON event names; treating as CSV.");
            names.push(...raw.split(",").map((part) => part.trim()));
          }
        } else {
          names.push(...raw.split(",").map((part) => part.trim()));
        }
      }
      const deduped = [];
      const seen = /* @__PURE__ */ new Set();
      for (const name of names) {
        if (!name || seen.has(name)) {
          continue;
        }
        seen.add(name);
        deduped.push(name);
      }
      return deduped;
    },
    resolveTargetElement(target) {
      if (target === "window") {
        return window;
      }
      if (target === "document") {
        return document;
      }
      return document.querySelector(target);
    },
    createHandler(eventName) {
      return (evt) => {
        if (this.paused) {
          return;
        }
        const eventType = evt?.type || eventName;
        const rawDetail = evt instanceof CustomEvent ? evt.detail : evt?.detail;
        const filteredDetail = this.applyFilter(rawDetail, this.filterPath);
        this.entries.push(this.buildEntry(eventType, filteredDetail));
        this.enforceMaxEntries();
        this.scrollToBottom();
      };
    },
    buildEntry(eventType, detail) {
      const timestamp = this.showTimestamp ? `[${(/* @__PURE__ */ new Date()).toLocaleTimeString()}]` : "";
      const bodyRaw = this.stringifyDetail(detail, this.pretty);
      const bodyPreview = this.buildBodyPreview(detail);
      const withMetaRaw = this.appendMetaSuffix(bodyRaw);
      const withMetaPreview = this.appendMetaSuffix(bodyPreview);
      return {
        id: `${eventType}-${this._entryId++}`,
        type: eventType,
        level: this.level,
        hasTimestamp: this.showTimestamp,
        timestamp,
        bodyRaw: withMetaRaw,
        bodyPreview: withMetaPreview,
        body: withMetaRaw,
        expanded: false,
        toggleLabel: this.expandText,
        toggleClass: ""
      };
    },
    buildBodyPreview(detail) {
      if (detail === void 0) {
        return "undefined";
      }
      if (detail === null) {
        return "null";
      }
      if (typeof detail === "string") {
        return this.truncatePreview(this.toSingleLine(detail.trim()));
      }
      const compact = this.stringifyDetail(detail, false);
      return this.truncatePreview(this.toSingleLine(compact));
    },
    appendMetaSuffix(value) {
      if (!this.showEventMeta) {
        return value;
      }
      return `${value} [level:${this.level}]`;
    },
    toSingleLine(value) {
      return value.replace(/\s+/g, " ").trim();
    },
    truncatePreview(value) {
      if (value.length <= PREVIEW_MAX_LENGTH) {
        return value;
      }
      return `${value.slice(0, PREVIEW_MAX_LENGTH - 1)}…`;
    },
    enforceMaxEntries() {
      if (this.entries.length > this.maxEntries) {
        this.entries.splice(0, this.entries.length - this.maxEntries);
      }
      if (this.expandedEntryId && !this.entries.some((entry) => entry.id === this.expandedEntryId)) {
        this.expandedEntryId = null;
      }
    },
    handleConsoleScroll() {
      if (!this.$refs.console) {
        return;
      }
      const distanceFromBottom = this.$refs.console.scrollHeight - (this.$refs.console.scrollTop + this.$refs.console.clientHeight);
      this.stickToBottom = distanceFromBottom < 12;
    },
    scrollToBottom() {
      if (!this.autoScroll || !this.stickToBottom) {
        return;
      }
      this.$nextTick(() => {
        if (this.$refs.console) {
          this.$refs.console.scrollTop = this.$refs.console.scrollHeight;
        }
      });
    },
    toggleEntryExpansion(event) {
      const entryId = event?.currentTarget?.dataset?.entryId || event?.target?.dataset?.entryId;
      if (!entryId) {
        return;
      }
      const nextExpandedId = this.expandedEntryId === entryId ? null : entryId;
      this.expandedEntryId = nextExpandedId;
      for (const entry of this.entries) {
        const isExpanded = entry.id === this.expandedEntryId;
        entry.expanded = isExpanded;
        entry.toggleClass = isExpanded ? "rotate-90" : "";
        entry.toggleLabel = isExpanded ? this.collapseText : this.expandText;
      }
    },
    stringifyDetail(value, prettyPrint) {
      if (value === void 0) return "undefined";
      if (value === null) return "null";
      if (typeof value === "string") return value;
      if (typeof value === "number" || typeof value === "boolean") return String(value);
      const seen = /* @__PURE__ */ new WeakSet();
      const isDomObject = (v) => {
        if (!v || typeof v !== "object") return false;
        if (typeof Node !== "undefined" && v instanceof Node) return true;
        if (typeof Window !== "undefined" && v instanceof Window) return true;
        return typeof v.nodeType === "number" && typeof v.nodeName === "string";
      };
      const replacer = (key, v) => {
        if (v === void 0) return "undefined";
        if (typeof v === "function") return "function (hidden)";
        if (typeof v === "bigint") return `${v}n`;
        if (typeof v === "symbol") return "symbol (hidden)";
        if (isDomObject(v)) return "element (hidden)";
        if (v && typeof v === "object") {
          if (seen.has(v)) {
            return "[circular]";
          }
          seen.add(v);
        }
        return v;
      };
      try {
        return prettyPrint ? JSON.stringify(value, replacer, 2) : JSON.stringify(value, replacer);
      } catch {
        return "[unserializable detail]";
      }
    },
    applyFilter(detail, path) {
      if (!path || path.trim().length === 0) {
        return detail;
      }
      const parts = path.split(".").map((segment) => segment.trim()).filter(Boolean);
      let current = detail;
      for (const part of parts) {
        if (current === null || current === void 0) {
          return void 0;
        }
        if (typeof current !== "object" || !(part in current)) {
          return void 0;
        }
        current = current[part];
      }
      return current;
    },
    appendSystemEntry(message) {
      const preview = this.truncatePreview(this.toSingleLine(message));
      this.entries.push({
        id: `system-${this._entryId++}`,
        type: "system",
        level: "info",
        hasTimestamp: false,
        timestamp: "",
        bodyRaw: message,
        bodyPreview: preview,
        body: message,
        expanded: false,
        toggleLabel: this.expandText,
        toggleClass: ""
      });
      this.enforceMaxEntries();
      this.scrollToBottom();
    },
    clearEntries() {
      this.entries = [];
      this.expandedEntryId = null;
      this.stickToBottom = true;
    },
    togglePaused() {
      this.paused = !this.paused;
    },
    disableCopied() {
      this.copied = false;
    },
    getCopiedTitle() {
      return this.copied ? this.copiedTitle : this.copyTitle;
    },
    getCopiedCss() {
      return [this.copied ? "focus-visible:outline-success" : "focus-visible:outline-foreground"];
    },
    async copyEntries() {
      const payload = this.entries.map((entry) => `${entry.hasTimestamp ? `${entry.timestamp} ` : ""}${entry.type} ${entry.bodyRaw}`).join("\n");
      if (!(navigator.clipboard && typeof navigator.clipboard.writeText === "function")) {
        return;
      }
      try {
        await navigator.clipboard.writeText(payload);
        this.copied = true;
      } catch {
        this.copied = false;
      }
    }
  };
}
function rzMarkdown() {
  return {
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const assets = JSON.parse(this.$el.dataset.assets);
      const nonce = this.$el.dataset.nonce;
      rizzyRequire(assets, {
        success: function() {
          window.hljs.highlightAll();
        },
        error: function() {
          console.error("Failed to load Highlight.js");
        }
      }, nonce);
    }
  };
}
function rzQuickReferenceContainer() {
  return {
    headings: [],
    // Array of heading IDs
    currentHeadingId: "",
    // ID of the currently highlighted heading
    // Initializes the component with headings and the initial current heading from data attributes.
    init() {
      this.headings = JSON.parse(this.$el.dataset.headings || "[]");
      this.currentHeadingId = this.$el.dataset.currentheadingid || "";
    },
    // Handles click events on quick reference links.
    handleHeadingClick() {
      const id = this.$el.dataset.headingid;
      window.requestAnimationFrame(() => {
        this.currentHeadingId = id;
      });
    },
    // Sets the current heading ID based on intersection observer events from rzHeading.
    setCurrentHeading(id) {
      if (this.headings.includes(id)) {
        this.currentHeadingId = id;
      }
    },
    // Provides CSS classes for a link based on whether it's the current heading.
    // Returns an object suitable for :class binding.
    getSelectedCss() {
      const id = this.$el.dataset.headingid;
      return {
        "font-bold": this.currentHeadingId === id
        // Apply 'font-bold' if current
      };
    },
    // Determines the value for the aria-current attribute.
    getSelectedAriaCurrent() {
      const id = this.$el.dataset.headingid;
      return this.currentHeadingId === id ? "true" : null;
    }
  };
}
export {
  rzBrowser,
  rzCodeViewer,
  rzEmbeddedPreview,
  rzEventViewer,
  rzMarkdown,
  rzQuickReferenceContainer
};
//# sourceMappingURL=docs-runtime-CL-JjvEQ.js.map
