// packages/rizzyui/src/js/lib/components/rzCommand.js
export default function(Alpine) {
    Alpine.data('rzCommand', () => ({
        // --- STATE ---
        search: '',
        selectedValue: null,
        selectedIndex: -1,
        items: [],
        itemsById: new Map(),
        filteredItems: [],
        filteredIndexById: new Map(),
        groupTemplates: new Map(),
        activeDescendantId: null,
        isOpen: false,
        isEmpty: true,
        isLoading: false,
        error: null,

        // --- CONFIG ---
        loop: false,
        shouldFilter: true,
        itemsUrl: null,
        fetchTrigger: 'immediate',
        serverFiltering: false,
        dataItemTemplateId: null,
        maxRender: 100,
        _dataFetched: false,
        _debounceTimer: null,
        _lastSearch: '',
        _lastMatchedItems: [],
        _listInstance: null,

        /**
         * Computes a deterministic 32-bit hash for a string.
         * @param {string} value The value to hash.
         * @returns {string} An unsigned integer hash represented as a string.
         */
        hashString(value) {
            let hash = 0;
            for (let i = 0; i < value.length; i++) {
                hash = ((hash << 5) - hash) + value.charCodeAt(i);
                hash |= 0;
            }

            return String(hash >>> 0);
        },

        /**
         * Resolves a stable item identifier when an item is missing an id.
         * @param {object} item The command item.
         * @returns {string} A stable identifier for the item.
         */
        resolveStableItemId(item) {
            if (item?.id) {
                return String(item.id);
            }

            if (item?.value) {
                return String(item.value);
            }

            const fallbackValue = item?.name || item?.label || JSON.stringify(item ?? {});
            return `item-${this.hashString(String(fallbackValue))}`;
        },

        // --- COMPUTED (CSP-Compliant Methods) ---
        /**
         * Indicates whether the loading state should be displayed.
         * @returns {boolean} True when loading.
         */
        showLoading() { return this.isLoading; },

        /**
         * Indicates whether an error is currently set.
         * @returns {boolean} True when an error exists.
         */
        hasError() { return this.error !== null; },

        /**
         * Indicates whether there is currently no error.
         * @returns {boolean} True when no error exists.
         */
        notHasError() { return this.error == null; },

        /**
         * Indicates whether the empty state should be shown.
         * @returns {boolean} True when the empty state should be shown.
         */
        shouldShowEmpty() { return this.isEmpty && this.search && !this.isLoading && !this.error; },

        /**
         * Indicates whether either empty or error state should be shown.
         * @returns {boolean} True when empty or error state applies.
         */
        shouldShowEmptyOrError() { return (this.isEmpty && this.search && !this.isLoading) || this.error !== null; },

        // --- LIFECYCLE ---
        /**
         * Initializes command state, registers watchers, and loads initial items.
         * @returns {void}
         */
        init() {
            this.loop = this.$el.dataset.loop === 'true';
            this.shouldFilter = this.$el.dataset.shouldFilter !== 'false';
            this.selectedValue = this.$el.dataset.selectedValue || null;
            this.itemsUrl = this.$el.dataset.itemsUrl || null;
            this.fetchTrigger = this.$el.dataset.fetchTrigger || 'immediate';
            this.serverFiltering = this.$el.dataset.serverFiltering === 'true';
            this.dataItemTemplateId = this.$el.dataset.templateId || null;
            this.maxRender = Number.parseInt(this.$el.dataset.maxRender || '100', 10);

            const itemsScriptId = this.$el.dataset.itemsId;
            let staticItems = [];
            if (itemsScriptId) {
                const itemsScript = document.getElementById(itemsScriptId);
                if (itemsScript) {
                    try {
                        staticItems = JSON.parse(itemsScript.textContent || '[]');
                    } catch (e) {
                        console.error(`RzCommand: Failed to parse JSON from script tag #${itemsScriptId}`, e);
                    }
                }
            }

            if (staticItems.length > 0 && !this.dataItemTemplateId) {
                console.error('RzCommand: `Items` were provided, but no `<CommandItemTemplate>` was found to render them.');
            }

            const normalizedStaticItems = staticItems.map(item => ({
                ...item,
                id: this.resolveStableItemId(item),
                isDataItem: true
            }));
            this.registerItems(normalizedStaticItems, { suppressFilter: true });

            if (this.itemsUrl && this.fetchTrigger === 'immediate') {
                this.fetchItems();
            } else {
                this.filterAndSortItems();
            }

            this.$watch('search', (newValue) => {
                if (this.serverFiltering) {
                    clearTimeout(this._debounceTimer);
                    this._debounceTimer = setTimeout(() => {
                        this.fetchItems(newValue);
                    }, 300);
                    return;
                }
                this.filterAndSortItems();
            });

            this.$watch('selectedIndex', (newIndex, oldIndex) => {
                if (oldIndex > -1) {
                    const oldItem = this.filteredItems[oldIndex];
                    if (oldItem) {
                        const oldEl = this.$el.querySelector(`[data-command-item-id="${oldItem.id}"]`);
                        if (oldEl) {
                            oldEl.removeAttribute('data-selected');
                            oldEl.setAttribute('aria-selected', 'false');
                        }
                    }
                }

                if (newIndex > -1 && this.filteredItems[newIndex]) {
                    const selectedItem = this.filteredItems[newIndex];
                    this.activeDescendantId = selectedItem.id;

                    const el = this.$el.querySelector(`[data-command-item-id="${selectedItem.id}"]`);
                    if (el) {
                        el.setAttribute('data-selected', 'true');
                        el.setAttribute('aria-selected', 'true');
                        el.scrollIntoView({ block: 'nearest' });
                    }

                    const newValue = selectedItem.value;
                    if (this.selectedValue !== newValue) {
                        this.selectedValue = newValue;
                        this.$dispatch('rz:command:select', { value: newValue });
                    }
                } else {
                    this.activeDescendantId = null;
                    this.selectedValue = null;
                }
            });

            this.$watch('selectedValue', (newValue) => {
                const index = this.filteredItems.findIndex(item => item.value === newValue);
                if (this.selectedIndex !== index) {
                    this.selectedIndex = index;
                }
            });

            this.$watch('filteredItems', (items) => {
                this.isOpen = items.length > 0 || this.isLoading;
                this.isEmpty = items.length === 0;

                if (this._listInstance) {
                    this._listInstance.renderList();
                }
            });
        },

        // --- METHODS ---
        /**
         * Stores the list renderer instance for cache-aware rendering.
         * @param {object} listInstance The command list Alpine instance.
         * @returns {void}
         */
        setListInstance(listInstance) {
            this._listInstance = listInstance;
            this._listInstance.renderList();
        },

        /**
         * Normalizes an item and enriches search metadata.
         * @param {object} item The command item to normalize.
         * @returns {object} The normalized item.
         */
        normalizeItem(item) {
            const name = item.name || '';
            const keywords = Array.isArray(item.keywords) ? item.keywords : [];
            return {
                ...item,
                id: this.resolveStableItemId(item),
                keywords,
                _searchText: `${name} ${keywords.join(' ')}`.trim().toLowerCase(),
                _order: item._order ?? this.items.length
            };
        },

        /**
         * Registers multiple items while avoiding duplicates.
         * @param {Array<object>} items Items to register.
         * @param {{ suppressFilter?: boolean }} options Registration options.
         * @returns {void}
         */
        registerItems(items, options = {}) {
            const suppressFilter = options.suppressFilter === true;
            let added = 0;

            for (const rawItem of items) {
                if (!rawItem) {
                    continue;
                }

                const itemId = this.resolveStableItemId(rawItem);
                if (this.itemsById.has(itemId)) {
                    continue;
                }

                const normalizedItem = this.normalizeItem(rawItem);
                normalizedItem._order = this.items.length;
                this.items.push(normalizedItem);
                this.itemsById.set(normalizedItem.id, normalizedItem);
                added++;
            }

            if (added > 0 && this.selectedIndex === -1) {
                this.selectedIndex = 0;
            }

            if (!suppressFilter && !this.serverFiltering) {
                this.filterAndSortItems();
            }
        },

        registerItem(item) {
            this.registerItems([item]);
        },

        /**
         * Unregisters an item by id.
         * @param {string} itemId The item identifier.
         * @returns {void}
         */
        unregisterItem(itemId) {
            if (!this.itemsById.has(itemId)) {
                return;
            }

            this.itemsById.delete(itemId);
            this.items = this.items.filter(i => i.id !== itemId);
            this.filterAndSortItems();
        },

        /**
         * Registers a group heading template.
         * @param {string} name The group name.
         * @param {DocumentFragment} templateContent The template content.
         * @param {string} headingId The heading identifier.
         * @returns {void}
         */
        registerGroupTemplate(name, templateContent, headingId) {
            if (!name || !templateContent || this.groupTemplates.has(name)) {
                return;
            }

            this.groupTemplates.set(name, {
                headingId,
                templateContent
            });
        },

        /**
         * Rebuilds the map of filtered indexes by item id.
         * @returns {void}
         */
        updateFilteredIndexes() {
            const indexMap = new Map();
            for (let i = 0; i < this.filteredItems.length; i++) {
                indexMap.set(this.filteredItems[i].id, i);
            }
            this.filteredIndexById = indexMap;
        },

        /**
         * Computes a simple ranking score for fast filtering.
         * @param {string} searchText Normalized searchable text.
         * @param {string} searchTerm Normalized search term.
         * @returns {number} Ranking score.
         */
        fastScore(searchText, searchTerm) {
            if (!searchTerm) {
                return 1;
            }

            const termIndex = searchText.indexOf(searchTerm);
            if (termIndex === -1) {
                return 0;
            }

            if (termIndex === 0) {
                return 4;
            }

            if (searchText.includes(` ${searchTerm}`)) {
                return 3;
            }

            return 2;
        },

        /**
         * Filters, sorts, and trims items based on current settings.
         * @returns {void}
         */
        filterAndSortItems() {
            if (this.serverFiltering && this._dataFetched) {
                this.filteredItems = this.items.slice(0, this.maxRender);
                this.updateFilteredIndexes();
                this.selectedIndex = this.filteredItems.length > 0 ? 0 : -1;
                return;
            }

            const searchTerm = (this.search || '').trim().toLowerCase();
            const useIncremental = searchTerm && this._lastSearch && searchTerm.startsWith(this._lastSearch);
            const candidates = useIncremental ? this._lastMatchedItems : this.items;

            let matches = [];
            if (!this.shouldFilter || !searchTerm) {
                matches = this.items.slice();
            } else {
                const scored = [];

                for (const item of candidates) {
                    if (item.forceMount) {
                        continue;
                    }

                    const score = this.fastScore(item._searchText, searchTerm);
                    if (score > 0) {
                        scored.push([item, score]);
                    }
                }

                scored.sort((a, b) => {
                    if (b[1] !== a[1]) {
                        return b[1] - a[1];
                    }
                    return (a[0]._order || 0) - (b[0]._order || 0);
                });

                matches = scored.map(([item]) => item);
            }

            const forceMountedItems = this.items.filter(item => item.forceMount);
            const combined = [...matches, ...forceMountedItems];

            this._lastSearch = searchTerm;
            this._lastMatchedItems = combined;
            this.filteredItems = combined.slice(0, this.maxRender);
            this.updateFilteredIndexes();

            if (this.selectedValue) {
                const newIndex = this.filteredItems.findIndex(item => item.value === this.selectedValue);
                this.selectedIndex = newIndex > -1 ? newIndex : (this.filteredItems.length > 0 ? 0 : -1);
            } else {
                this.selectedIndex = this.filteredItems.length > 0 ? 0 : -1;
            }
        },

        /**
         * Fetches remote items and registers them.
         * @param {string} [query=''] Query string used for server filtering.
         * @returns {Promise<void>}
         */
        async fetchItems(query = '') {
            if (!this.itemsUrl) return;
            if (!this.dataItemTemplateId) {
                console.error('RzCommand: `ItemsUrl` was provided, but no `<CommandItemTemplate>` was found to render the data.');
                this.error = 'Configuration error: No data template found.';
                return;
            }

            this.isLoading = true;
            this.error = null;

            try {
                const url = new URL(this.itemsUrl, window.location.origin);
                if (this.serverFiltering && query) {
                    url.searchParams.append('q', query);
                }

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                const data = await response.json();

                if (this.serverFiltering) {
                    this.items = this.items.filter(i => !i.isDataItem);
                    this.itemsById = new Map(this.items.map(item => [item.id, item]));
                }

                const normalizedDataItems = data.map(item => ({
                    ...item,
                    id: this.resolveStableItemId(item),
                    isDataItem: true
                }));

                this.registerItems(normalizedDataItems, { suppressFilter: true });
                this._dataFetched = true;
            } catch (e) {
                this.error = e.message || 'Failed to fetch command items.';
                console.error('RzCommand:', this.error);
            } finally {
                this.isLoading = false;
                this.filterAndSortItems();
            }
        },

        /**
         * Handles an interaction that may trigger deferred data fetch.
         * @returns {void}
         */
        handleInteraction() {
            if (this.itemsUrl && this.fetchTrigger === 'on-open' && !this._dataFetched) {
                this.fetchItems();
            }
        },

        // --- EVENT HANDLERS ---
        /**
         * Handles item click selection and execute dispatch.
         * @param {MouseEvent} event The click event.
         * @returns {void}
         */
        handleItemClick(event) {
            const host = event.target.closest('[data-command-item-id]');
            if (!host) return;

            const itemId = host.dataset.commandItemId;
            const index = this.filteredIndexById.get(itemId) ?? -1;

            if (index > -1) {
                const item = this.filteredItems[index];
                if (item && !item.disabled) {
                    this.selectedIndex = index;
                    this.$dispatch('rz:command:execute', { value: item.value });
                }
            }
        },

        /**
         * Handles hover-based selection changes.
         * @param {MouseEvent} event The mouse event.
         * @returns {void}
         */
        handleItemHover(event) {
            const host = event.target.closest('[data-command-item-id]');
            if (!host) return;

            const itemId = host.dataset.commandItemId;
            const index = this.filteredIndexById.get(itemId) ?? -1;

            if (index > -1) {
                const item = this.filteredItems[index];
                if (item && !item.disabled && this.selectedIndex !== index) {
                    this.selectedIndex = index;
                }
            }
        },

        // --- KEYBOARD NAVIGATION ---
        /**
         * Handles keyboard navigation and execute behavior.
         * @param {KeyboardEvent} e The keyboard event.
         * @returns {void}
         */
        handleKeydown(e) {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.selectNext();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.selectPrev();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.selectFirst();
                    break;
                case 'End':
                    e.preventDefault();
                    this.selectLast();
                    break;
                case 'Enter': {
                    e.preventDefault();
                    const item = this.filteredItems[this.selectedIndex];
                    if (item && !item.disabled) {
                        this.$dispatch('rz:command:execute', { value: item.value });
                    }
                    break;
                }
            }
        },

        /**
         * Selects the next enabled item.
         * @returns {void}
         */
        selectNext() {
            if (this.filteredItems.length === 0) return;
            let i = this.selectedIndex;
            let count = 0;
            do {
                i = (i + 1 >= this.filteredItems.length) ? (this.loop ? 0 : this.filteredItems.length - 1) : i + 1;
                count++;
                if (!this.filteredItems[i]?.disabled) { this.selectedIndex = i; return; }
                if (!this.loop && i === this.filteredItems.length - 1) return;
            } while (count <= this.filteredItems.length);
        },

        /**
         * Selects the previous enabled item.
         * @returns {void}
         */
        selectPrev() {
            if (this.filteredItems.length === 0) return;
            let i = this.selectedIndex;
            let count = 0;
            do {
                i = (i - 1 < 0) ? (this.loop ? this.filteredItems.length - 1 : 0) : i - 1;
                count++;
                if (!this.filteredItems[i]?.disabled) { this.selectedIndex = i; return; }
                if (!this.loop && i === 0) return;
            } while (count <= this.filteredItems.length);
        },

        /**
         * Selects the first enabled item.
         * @returns {void}
         */
        selectFirst() {
            if (this.filteredItems.length > 0) {
                const firstEnabledIndex = this.filteredItems.findIndex(item => !item.disabled);
                if (firstEnabledIndex > -1) this.selectedIndex = firstEnabledIndex;
            }
        },

        /**
         * Selects the last enabled item.
         * @returns {void}
         */
        selectLast() {
            if (this.filteredItems.length > 0) {
                const lastEnabledIndex = this.filteredItems.map(item => item.disabled).lastIndexOf(false);
                if (lastEnabledIndex > -1) this.selectedIndex = lastEnabledIndex;
            }
        }
    }));
}
