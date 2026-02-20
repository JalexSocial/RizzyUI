export default function (Alpine) {
    Alpine.data('rzEventViewer', () => ({
        eventNames: [],
        entries: [],
        error: null,
        paused: false,
        copied: false,
        copyTitle: 'Copy',
        copiedTitle: 'Copied!',
        target: 'window',
        targetEl: null,
        maxEntries: 200,
        autoScroll: true,
        pretty: true,
        showTimestamp: true,
        showEventMeta: false,
        level: 'info',
        filterPath: '',
        _handlers: new Map(),
        _boundEvents: new Set(),
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

        init() {
            this.target = this.$el.dataset.target || 'window';
            this.maxEntries = Number.parseInt(this.$el.dataset.maxEntries || '200', 10);
            this.autoScroll = this.parseBoolean(this.$el.dataset.autoScroll, true);
            this.pretty = this.parseBoolean(this.$el.dataset.pretty, true);
            this.showTimestamp = this.parseBoolean(this.$el.dataset.showTimestamp, true);
            this.showEventMeta = this.parseBoolean(this.$el.dataset.showEventMeta, false);
            this.level = this.$el.dataset.level || 'info';
            this.filterPath = this.$el.dataset.filter || '';
            this.copyTitle = this.$el.dataset.copyTitle || this.copyTitle;
            this.copiedTitle = this.$el.dataset.copiedTitle || this.copiedTitle;

            this.eventNames = this.resolveEventNames();
            if (this.eventNames.length === 0) {
                this.error = 'At least one event name is required.';
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

            this.appendSystemEntry(`Listening for: ${this.eventNames.join(', ')}`);
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
            if (typeof value !== 'string' || value.length === 0) {
                return defaultValue;
            }

            return value === 'true';
        },

        resolveEventNames() {
            const names = [];
            const single = this.$el.dataset.eventName || '';
            const multiple = this.$el.dataset.eventNames || '';

            if (single.trim().length > 0) {
                names.push(single.trim());
            }

            if (multiple.trim().length > 0) {
                const raw = multiple.trim();
                if (raw.startsWith('[')) {
                    try {
                        const parsed = JSON.parse(raw);
                        if (Array.isArray(parsed)) {
                            for (const entry of parsed) {
                                if (typeof entry === 'string') {
                                    names.push(entry.trim());
                                } else {
                                    this.appendSystemEntry('Ignored non-string event name in JSON array.');
                                }
                            }
                        }
                    } catch {
                        this.appendSystemEntry('Failed to parse JSON event names; treating as CSV.');
                        names.push(...raw.split(',').map(part => part.trim()));
                    }
                } else {
                    names.push(...raw.split(',').map(part => part.trim()));
                }
            }

            const deduped = [];
            const seen = new Set();

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
            if (target === 'window') {
                return window;
            }

            if (target === 'document') {
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
            const timestamp = this.showTimestamp ? `[${new Date().toLocaleTimeString()}]` : '';
            const body = this.stringifyDetail(detail);
            const metaSuffix = this.showEventMeta ? ` [level:${this.level}]` : '';

            return {
                id: `${eventType}-${this._entryId++}`,
                type: eventType,
                level: this.level,
                hasTimestamp: this.showTimestamp,
                timestamp,
                body: `${body}${metaSuffix}`
            };
        },

        enforceMaxEntries() {
            if (this.entries.length > this.maxEntries) {
                this.entries.splice(0, this.entries.length - this.maxEntries);
            }
        },

        scrollToBottom() {
            if (!this.autoScroll) {
                return;
            }

            this.$nextTick(() => {
                if (this.$refs.console) {
                    this.$refs.console.scrollTop = this.$refs.console.scrollHeight;
                }
            });
        },

        stringifyDetail(value) {
            if (value === undefined) return 'undefined';
            if (value === null) return 'null';
            if (typeof value === 'string') return value;
            if (typeof value === 'number' || typeof value === 'boolean') return String(value);

            const seen = new WeakSet();

            const isDomObject = (v) => {
                if (!v || typeof v !== 'object') return false;

                // Covers elements, document, text nodes, etc.
                if (typeof Node !== 'undefined' && v instanceof Node) return true;

                // Optional: also hide Window objects
                if (typeof Window !== 'undefined' && v instanceof Window) return true;

                // Fallback for cross-realm DOM objects (iframes)
                return typeof v.nodeType === 'number' && typeof v.nodeName === 'string';
            };

            const replacer = (key, v) => {
                if (v === undefined) return 'undefined';

                if (typeof v === 'function') {
                    return 'function (hidden)';
                }

                if (typeof v === 'bigint') {
                    return `${v}n`; // JSON.stringify normally throws on BigInt
                }

                if (typeof v === 'symbol') {
                    return 'symbol (hidden)';
                }

                if (isDomObject(v)) {
                    return 'element (hidden)';
                }

                if (v && typeof v === 'object') {
                    if (seen.has(v)) {
                        return '[circular]';
                    }
                    seen.add(v);
                }

                return v;
            };

            try {
                return this.pretty
                    ? JSON.stringify(value, replacer, 2)
                    : JSON.stringify(value, replacer);
            } catch {
                return '[unserializable detail]';
            }
        },

        applyFilter(detail, path) {
            if (!path || path.trim().length === 0) {
                return detail;
            }

            const parts = path.split('.').map(segment => segment.trim()).filter(Boolean);
            let current = detail;

            for (const part of parts) {
                if (current === null || current === undefined) {
                    return undefined;
                }

                if (typeof current !== 'object' || !(part in current)) {
                    return undefined;
                }

                current = current[part];
            }

            return current;
        },

        appendSystemEntry(message) {
            this.entries.push({
                id: `system-${this._entryId++}`,
                type: 'system',
                level: 'info',
                hasTimestamp: false,
                timestamp: '',
                body: message
            });
            this.enforceMaxEntries();
            this.scrollToBottom();
        },

        clearEntries() {
            this.entries = [];
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
            return [this.copied ? 'focus-visible:outline-success' : 'focus-visible:outline-foreground'];
        },

        async copyEntries() {
            const payload = this.entries
                .map(entry => `${entry.hasTimestamp ? `${entry.timestamp} ` : ''}${entry.type} ${entry.body}`)
                .join('\n');

            if (!(navigator.clipboard && typeof navigator.clipboard.writeText === 'function')) {
                return;
            }

            try {
                await navigator.clipboard.writeText(payload);
                this.copied = true;
            } catch {
                this.copied = false;
            }
        }
    }));
}
