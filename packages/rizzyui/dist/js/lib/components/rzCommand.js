
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
        
        // --- CONFIG ---
        loop: false,
        shouldFilter: true,

        // --- COMPUTED ---
        showEmpty() {
            return this.isEmpty && this.search;
        },

        // --- LIFECYCLE ---
        init() {
            this.loop = this.$el.dataset.loop === 'true';
            this.shouldFilter = this.$el.dataset.shouldFilter !== 'false';
            this.selectedValue = this.$el.dataset.selectedValue || null;

            this.$watch('search', () => {
                this.firstRender = false;
                this.filterAndSortItems();
            });

            this.$watch('selectedIndex', (index) => {
                if (index > -1 && this.filteredItems[index]) {
                    const selectedItem = this.filteredItems[index];
                    this.activeDescendantId = selectedItem.id;
                    
                    const el = this.$root.querySelector(`[data-command-item-id="${selectedItem.id}"]`);
                    el?.scrollIntoView({ block: 'nearest' });

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
                this.isOpen = items.length > 0;
                this.isEmpty = items.length === 0;

                window.dispatchEvent(new CustomEvent('rz:command:list-changed', {
                    detail: {
                        items: this.filteredItems,
                        groups: this.groupTemplates,
                        commandId: this.$el.id
                    }
                }));
            });

            this.$el.addEventListener('rz:command:item-click', (e) => {
                const index = e.detail?.index ?? -1;
                if (index > -1) {
                    const item = this.filteredItems[index];
                    if (item && !item.disabled) {
                        this.selectedIndex = index;
                        this.$dispatch('rz:command:execute', { value: item.value });
                    }
                }
            });
        },

        // --- METHODS ---
        registerItem(item) {
            item._order = this.items.length;
            this.items.push(item);
            this.filterAndSortItems();
        },

        unregisterItem(itemId) {
            this.items = this.items.filter(i => i.id !== itemId);
            this.filterAndSortItems();
        },

        registerGroupTemplate(name, templateId) {
            if (!this.groupTemplates.has(name)) {
                this.groupTemplates.set(name, templateId);
            }
        },

        filterAndSortItems() {
            
            if (this.firstRender) return;
            
            let items;
            if (!this.shouldFilter || !this.search) {
                items = this.items.map(item => ({ ...item, score: 1 }));
            } else {
                items = this.items
                    .map(item => ({
                        ...item,
                        score: item.forceMount ? 0 : this.commandScore(item.value, this.search, item.keywords)
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

        selectFirst() {
            if (this.filteredItems.length > 0) {
                const firstEnabledIndex = this.filteredItems.findIndex(item => !item.disabled);
                if (firstEnabledIndex > -1) this.selectedIndex = firstEnabledIndex;
            }
        },

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

            const fullString = `${string} ${keywords.join(' ')}`;

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