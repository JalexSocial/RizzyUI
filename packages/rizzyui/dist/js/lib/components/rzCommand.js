
// packages/rizzyui/src/js/lib/components/rzCommand.js
export default function(Alpine) {
    Alpine.data('rzCommand', () => ({
        // --- STATE ---
        search: '',
        selectedValue: null,
        selectedIndex: -1,
        items: [],
        filteredItems: [],
        groupTemplates: new Map(),
        activeDescendantId: null,
        isOpen: false,
        isEmpty: true,
        firstRender: true,
        isLoading: false,
        error: null,
        
        // --- CONFIG ---
        loop: false,
        shouldFilter: true,
        itemsUrl: null,
        fetchTrigger: 'immediate',
        serverFiltering: false,
        dataItemTemplateId: null,
        _dataFetched: false,
        _debounceTimer: null,

        // --- COMPUTED (CSP-Compliant Methods) ---
        showLoading() { return this.isLoading; },
        hasError() { return this.error !== null; },
        notHasError() { return this.error == null; },
        shouldShowEmpty() { return this.isEmpty && this.search && !this.isLoading && !this.error; },
        shouldShowEmptyOrError() { return (this.isEmpty && this.search && !this.isLoading) || this.error !== null; },

        // --- LIFECYCLE ---
        init() {
            this.loop = this.$el.dataset.loop === 'true';
            this.shouldFilter = this.$el.dataset.shouldFilter !== 'false';
            this.selectedValue = this.$el.dataset.selectedValue || null;
            this.itemsUrl = this.$el.dataset.itemsUrl || null;
            this.fetchTrigger = this.$el.dataset.fetchTrigger || 'immediate';
            this.serverFiltering = this.$el.dataset.serverFiltering === 'true';
            this.dataItemTemplateId = this.$el.dataset.templateId || null;

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

            staticItems.forEach(item => {
                item.id = item.id || `static-item-${crypto.randomUUID()}`;
                item.isDataItem = true; 
                this.registerItem(item);
            });

            if (this.itemsUrl && this.fetchTrigger === 'immediate') {
                this.fetchItems();
            }

            this.$watch('search', (newValue) => {
                this.firstRender = false;
                if (this.serverFiltering) {
                    clearTimeout(this._debounceTimer);
                    this._debounceTimer = setTimeout(() => {
                        this.fetchItems(newValue);
                    }, 300); // Debounce server requests
                } else {
                    this.filterAndSortItems();
                }
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

                if (!this.firstRender)
                {
                    window.dispatchEvent(new CustomEvent('rz:command:list-changed', {
                        detail: {
                            items: this.filteredItems,
                            groups: this.groupTemplates,
                            commandId: this.$el.id
                        }
                    }));
                }
            });
        },

        // --- METHODS ---
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

                // On server filtering, we replace items. Otherwise, we merge.
                if (this.serverFiltering) {
                    this.items = this.items.filter(i => !i.isDataItem); // Keep declarative items
                }

                data.forEach(item => {
                    item.id = item.id || `data-item-${crypto.randomUUID()}`;
                    item.isDataItem = true;
                    this.registerItem(item);
                });
                
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
         * Executes the `handleInteraction` operation.
         * @returns {any} Returns the result of `handleInteraction` when applicable.
         */
        handleInteraction() {
            if (this.itemsUrl && this.fetchTrigger === 'on-open' && !this._dataFetched) {
                this.fetchItems();
            }
        },

        /**
         * Executes the `registerItem` operation.
         * @param {any} item Input value for this method.
         * @returns {any} Returns the result of `registerItem` when applicable.
         */
        registerItem(item) {
            if (this.items.some(i => i.id === item.id)) return;
            item._order = this.items.length;
            this.items.push(item);
            
            if (this.selectedIndex === -1)
                this.selectedIndex = 0;
            
            if (!this.serverFiltering) {
                this.filterAndSortItems();
            }
        },

        /**
         * Executes the `unregisterItem` operation.
         * @param {any} itemId Input value for this method.
         * @returns {any} Returns the result of `unregisterItem` when applicable.
         */
        unregisterItem(itemId) {
            this.items = this.items.filter(i => i.id !== itemId);
            this.filterAndSortItems();
        },

        /**
         * Executes the `registerGroupTemplate` operation.
         * @param {any} name Input value for this method.
         * @param {any} templateId Input value for this method.
         * @returns {any} Returns the result of `registerGroupTemplate` when applicable.
         */
        registerGroupTemplate(name, templateId) {
            if (!this.groupTemplates.has(name)) {
                this.groupTemplates.set(name, templateId);
            }
        },

        /**
         * Executes the `filterAndSortItems` operation.
         * @returns {any} Returns the result of `filterAndSortItems` when applicable.
         */
        filterAndSortItems() {
            if (this.serverFiltering && this._dataFetched) {
                this.filteredItems = this.items;
                this.selectedIndex = this.filteredItems.length > 0 ? 0 : -1;
                return;
            }
            
            let items;
            if (!this.shouldFilter || !this.search) {
                items = this.items.map(item => ({ ...item, score: 1 }));
            } else {
                items = this.items
                    .map(item => ({
                        ...item,
                        score: item.forceMount ? 0 : this.commandScore(item.name, this.search, item.keywords)
                    }))
                    .filter(item => item.score > 0 || item.forceMount)
                    .sort((a, b) => {
                        if (a.forceMount && !b.forceMount) return 1;
                        if (!a.forceMount && b.forceMount) return -1;
                        if (b.score !== a.score) return b.score - a.score;
                        return (a._order || 0) - (b._order || 0);
                    });
            }
            this.filteredItems = items;
            
            if (this.selectedValue) {
                const newIndex = this.filteredItems.findIndex(item => item.value === this.selectedValue);
                this.selectedIndex = newIndex > -1 ? newIndex : (this.filteredItems.length > 0 ? 0 : -1);
            } else {
                this.selectedIndex = this.filteredItems.length > 0 ? 0 : -1;
            }
        },

        // --- EVENT HANDLERS ---
        handleItemClick(event) {
            const host = event.target.closest('[data-command-item-id]');
            if (!host) return;

            const itemId = host.dataset.commandItemId;
            const index = this.filteredItems.findIndex(item => item.id === itemId);

            if (index > -1) {
                const item = this.filteredItems[index];
                if (item && !item.disabled) {
                    this.selectedIndex = index;
                    this.$dispatch('rz:command:execute', { value: item.value });
                }
            }
        },

        /**
         * Executes the `handleItemHover` operation.
         * @param {any} event Input value for this method.
         * @returns {any} Returns the result of `handleItemHover` when applicable.
         */
        handleItemHover(event) {
            const host = event.target.closest('[data-command-item-id]');
            if (!host) return;

            const itemId = host.dataset.commandItemId;
            const index = this.filteredItems.findIndex(item => item.id === itemId);

            if (index > -1) {
                const item = this.filteredItems[index];
                if (item && !item.disabled) {
                    if (this.selectedIndex !== index) {
                        this.selectedIndex = index;
                    }
                }
            }
        },

        // --- KEYBOARD NAVIGATION ---
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
                case 'Enter':
                    e.preventDefault();
                    const item = this.filteredItems[this.selectedIndex];
                    if (item && !item.disabled) {
                        this.$dispatch('rz:command:execute', { value: item.value });
                    }
                    break;
            }
        },

        /**
         * Executes the `selectNext` operation.
         * @returns {any} Returns the result of `selectNext` when applicable.
         */
        selectNext() {
            if (this.filteredItems.length === 0) return;
            let i = this.selectedIndex, count = 0;
            do {
                i = (i + 1 >= this.filteredItems.length) ? (this.loop ? 0 : this.filteredItems.length - 1) : i + 1;
                count++;
                if (!this.filteredItems[i]?.disabled) { this.selectedIndex = i; return; }
                if (!this.loop && i === this.filteredItems.length - 1) return;
            } while (count <= this.filteredItems.length);
        },

        /**
         * Executes the `selectPrev` operation.
         * @returns {any} Returns the result of `selectPrev` when applicable.
         */
        selectPrev() {
            if (this.filteredItems.length === 0) return;
            let i = this.selectedIndex, count = 0;
            do {
                i = (i - 1 < 0) ? (this.loop ? this.filteredItems.length - 1 : 0) : i - 1;
                count++;
                if (!this.filteredItems[i]?.disabled) { this.selectedIndex = i; return; }
                if (!this.loop && i === 0) return;
            } while (count <= this.filteredItems.length);
        },

        /**
         * Executes the `selectFirst` operation.
         * @returns {any} Returns the result of `selectFirst` when applicable.
         */
        selectFirst() {
            if (this.filteredItems.length > 0) {
                const firstEnabledIndex = this.filteredItems.findIndex(item => !item.disabled);
                if (firstEnabledIndex > -1) this.selectedIndex = firstEnabledIndex;
            }
        },

        /**
         * Executes the `selectLast` operation.
         * @returns {any} Returns the result of `selectLast` when applicable.
         */
        selectLast() {
            if (this.filteredItems.length > 0) {
                const lastEnabledIndex = this.filteredItems.map(item => item.disabled).lastIndexOf(false);
                if (lastEnabledIndex > -1) this.selectedIndex = lastEnabledIndex;
            }
        },

        // --- SCORING ALGORITHM (Adapted from cmdk) ---
        commandScore(string, search, keywords = []) {
            const SCORE_CONTINUE_MATCH = 1;
            const SCORE_SPACE_WORD_JUMP = 0.9;
            const SCORE_NON_SPACE_WORD_JUMP = 0.8;
            const SCORE_CHARACTER_JUMP = 0.17;
            const PENALTY_SKIPPED = 0.999;
            const PENALTY_CASE_MISMATCH = 0.9999;
            const PENALTY_NOT_COMPLETE = 0.99;

            const IS_GAP_REGEXP = /[\\/_+.#"@[\(\{&]/;
            const IS_SPACE_REGEXP = /[\s-]/;

            const fullString = `${string} ${keywords ? keywords.join(' ') : ''}`;

            function formatInput(str) {
                return str.toLowerCase().replace(/[\s-]/g, ' ');
            }

            function commandScoreInner(str, abbr, lowerStr, lowerAbbr, strIndex, abbrIndex, memo) {
                if (abbrIndex === abbr.length) {
                    return strIndex === str.length ? SCORE_CONTINUE_MATCH : PENALTY_NOT_COMPLETE;
                }

                const memoKey = `${strIndex},${abbrIndex}`;
                if (memo[memoKey] !== undefined) return memo[memoKey];

                const abbrChar = lowerAbbr.charAt(abbrIndex);
                let index = lowerStr.indexOf(abbrChar, strIndex);
                let highScore = 0;

                while (index >= 0) {
                    let score = commandScoreInner(str, abbr, lowerStr, lowerAbbr, index + 1, abbrIndex + 1, memo);
                    if (score > highScore) {
                        if (index === strIndex) {
                            score *= SCORE_CONTINUE_MATCH;
                        } else if (IS_GAP_REGEXP.test(str.charAt(index - 1))) {
                            score *= SCORE_NON_SPACE_WORD_JUMP;
                        } else if (IS_SPACE_REGEXP.test(str.charAt(index - 1))) {
                            score *= SCORE_SPACE_WORD_JUMP;
                        } else {
                            score *= SCORE_CHARACTER_JUMP;
                            if (strIndex > 0) {
                                score *= Math.pow(PENALTY_SKIPPED, index - strIndex);
                            }
                        }

                        if (str.charAt(index) !== abbr.charAt(abbrIndex)) {
                            score *= PENALTY_CASE_MISMATCH;
                        }
                    }
                    
                    if (score > highScore) {
                        highScore = score;
                    }

                    index = lowerStr.indexOf(abbrChar, index + 1);
                }

                memo[memoKey] = highScore;
                return highScore;
            }

            return commandScoreInner(fullString, search, formatInput(fullString), formatInput(search), 0, 0, {});
        }
    }));
}
