//#region src/js/lib/components/rzCommand.js
function rzCommand() {
	return {
		search: "",
		selectedValue: null,
		selectedIndex: -1,
		items: [],
		itemsById: /* @__PURE__ */ new Map(),
		filteredItems: [],
		filteredIndexById: /* @__PURE__ */ new Map(),
		groupTemplates: /* @__PURE__ */ new Map(),
		activeDescendantId: null,
		isOpen: false,
		isEmpty: true,
		isLoading: false,
		error: null,
		loop: false,
		shouldFilter: true,
		itemsUrl: null,
		fetchTrigger: "immediate",
		serverFiltering: false,
		dataItemTemplateId: null,
		maxRender: 100,
		_dataFetched: false,
		_debounceTimer: null,
		_lastSearch: "",
		_lastMatchedItems: [],
		_listInstance: null,
		hashString(value) {
			let hash = 0;
			for (let i = 0; i < value.length; i++) {
				hash = (hash << 5) - hash + value.charCodeAt(i);
				hash |= 0;
			}
			return String(hash >>> 0);
		},
		resolveStableItemId(item) {
			if (item?.id) return String(item.id);
			if (item?.value) return String(item.value);
			const fallbackValue = item?.name || item?.label || JSON.stringify(item ?? {});
			return `item-${this.hashString(String(fallbackValue))}`;
		},
		showLoading() {
			return this.isLoading;
		},
		hasError() {
			return this.error !== null;
		},
		notHasError() {
			return this.error == null;
		},
		shouldShowEmpty() {
			return this.isEmpty && this.search && !this.isLoading && !this.error;
		},
		shouldShowEmptyOrError() {
			return this.isEmpty && this.search && !this.isLoading || this.error !== null;
		},
		init() {
			this.loop = this.$el.dataset.loop === "true";
			this.shouldFilter = this.$el.dataset.shouldFilter !== "false";
			this.selectedValue = this.$el.dataset.selectedValue || null;
			this.itemsUrl = this.$el.dataset.itemsUrl || null;
			this.fetchTrigger = this.$el.dataset.fetchTrigger || "immediate";
			this.serverFiltering = this.$el.dataset.serverFiltering === "true";
			this.dataItemTemplateId = this.$el.dataset.templateId || null;
			this.maxRender = Number.parseInt(this.$el.dataset.maxRender || "100", 10);
			const itemsScriptId = this.$el.dataset.itemsId;
			let staticItems = [];
			if (itemsScriptId) {
				const itemsScript = document.getElementById(itemsScriptId);
				if (itemsScript) try {
					staticItems = JSON.parse(itemsScript.textContent || "[]");
				} catch (e) {
					console.error(`RzCommand: Failed to parse JSON from script tag #${itemsScriptId}`, e);
				}
			}
			if (staticItems.length > 0 && !this.dataItemTemplateId) console.error("RzCommand: `Items` were provided, but no `<CommandItemTemplate>` was found to render them.");
			const normalizedStaticItems = staticItems.map((item) => ({
				...item,
				id: this.resolveStableItemId(item),
				isDataItem: true
			}));
			this.registerItems(normalizedStaticItems, { suppressFilter: true });
			if (this.itemsUrl && this.fetchTrigger === "immediate") this.fetchItems();
			else this.filterAndSortItems();
			this.$watch("search", (newValue) => {
				if (this.serverFiltering) {
					clearTimeout(this._debounceTimer);
					this._debounceTimer = setTimeout(() => {
						this.fetchItems(newValue);
					}, 300);
					return;
				}
				this.filterAndSortItems();
			});
			this.$watch("selectedIndex", (newIndex, oldIndex) => {
				if (oldIndex > -1) {
					const oldItem = this.filteredItems[oldIndex];
					if (oldItem) {
						const oldEl = this.$el.querySelector(`[data-command-item-id="${oldItem.id}"]`);
						if (oldEl) {
							oldEl.removeAttribute("data-selected");
							oldEl.setAttribute("aria-selected", "false");
						}
					}
				}
				if (newIndex > -1 && this.filteredItems[newIndex]) {
					const selectedItem = this.filteredItems[newIndex];
					this.activeDescendantId = selectedItem.id;
					const el = this.$el.querySelector(`[data-command-item-id="${selectedItem.id}"]`);
					if (el) {
						el.setAttribute("data-selected", "true");
						el.setAttribute("aria-selected", "true");
						el.scrollIntoView({ block: "nearest" });
					}
					const newValue = selectedItem.value;
					if (this.selectedValue !== newValue) {
						this.selectedValue = newValue;
						this.$dispatch("rz:command:select", { value: newValue });
					}
				} else {
					this.activeDescendantId = null;
					this.selectedValue = null;
				}
			});
			this.$watch("selectedValue", (newValue) => {
				const index = this.filteredItems.findIndex((item) => item.value === newValue);
				if (this.selectedIndex !== index) this.selectedIndex = index;
			});
			this.$watch("filteredItems", (items) => {
				this.isOpen = items.length > 0 || this.isLoading;
				this.isEmpty = items.length === 0;
				if (this._listInstance) this._listInstance.renderList();
			});
		},
		setListInstance(listInstance) {
			this._listInstance = listInstance;
			this._listInstance.renderList();
		},
		normalizeItem(item) {
			const name = item.name || "";
			const keywords = Array.isArray(item.keywords) ? item.keywords : [];
			return {
				...item,
				id: this.resolveStableItemId(item),
				keywords,
				_searchText: `${name} ${keywords.join(" ")}`.trim().toLowerCase(),
				_order: item._order ?? this.items.length
			};
		},
		registerItems(items, options = {}) {
			const suppressFilter = options.suppressFilter === true;
			let added = 0;
			for (const rawItem of items) {
				if (!rawItem) continue;
				const itemId = this.resolveStableItemId(rawItem);
				if (this.itemsById.has(itemId)) continue;
				const normalizedItem = this.normalizeItem(rawItem);
				normalizedItem._order = this.items.length;
				this.items.push(normalizedItem);
				this.itemsById.set(normalizedItem.id, normalizedItem);
				added++;
			}
			if (added > 0 && this.selectedIndex === -1) this.selectedIndex = 0;
			if (!suppressFilter && !this.serverFiltering) this.filterAndSortItems();
		},
		registerItem(item) {
			this.registerItems([item]);
		},
		unregisterItem(itemId) {
			if (!this.itemsById.has(itemId)) return;
			this.itemsById.delete(itemId);
			this.items = this.items.filter((i) => i.id !== itemId);
			this.filterAndSortItems();
		},
		registerGroupTemplate(name, templateContent, headingId) {
			if (!name || !templateContent || this.groupTemplates.has(name)) return;
			this.groupTemplates.set(name, {
				headingId,
				templateContent
			});
		},
		updateFilteredIndexes() {
			const indexMap = /* @__PURE__ */ new Map();
			for (let i = 0; i < this.filteredItems.length; i++) indexMap.set(this.filteredItems[i].id, i);
			this.filteredIndexById = indexMap;
		},
		fastScore(searchText, searchTerm) {
			if (!searchTerm) return 1;
			const termIndex = searchText.indexOf(searchTerm);
			if (termIndex === -1) return 0;
			if (termIndex === 0) return 4;
			if (searchText.includes(` ${searchTerm}`)) return 3;
			return 2;
		},
		filterAndSortItems() {
			if (this.serverFiltering && this._dataFetched) {
				this.filteredItems = this.items.slice(0, this.maxRender);
				this.updateFilteredIndexes();
				this.selectedIndex = this.filteredItems.length > 0 ? 0 : -1;
				return;
			}
			const searchTerm = (this.search || "").trim().toLowerCase();
			const candidates = searchTerm && this._lastSearch && searchTerm.startsWith(this._lastSearch) ? this._lastMatchedItems : this.items;
			let matches = [];
			if (!this.shouldFilter || !searchTerm) matches = this.items.slice();
			else {
				const scored = [];
				for (const item of candidates) {
					if (item.forceMount) continue;
					const score = this.fastScore(item._searchText, searchTerm);
					if (score > 0) scored.push([item, score]);
				}
				scored.sort((a, b) => {
					if (b[1] !== a[1]) return b[1] - a[1];
					return (a[0]._order || 0) - (b[0]._order || 0);
				});
				matches = scored.map(([item]) => item);
			}
			const forceMountedItems = this.items.filter((item) => item.forceMount);
			const combined = [...matches, ...forceMountedItems];
			this._lastSearch = searchTerm;
			this._lastMatchedItems = combined;
			this.filteredItems = combined.slice(0, this.maxRender);
			this.updateFilteredIndexes();
			if (this.selectedValue) {
				const newIndex = this.filteredItems.findIndex((item) => item.value === this.selectedValue);
				this.selectedIndex = newIndex > -1 ? newIndex : this.filteredItems.length > 0 ? 0 : -1;
			} else this.selectedIndex = this.filteredItems.length > 0 ? 0 : -1;
		},
		async fetchItems(query = "") {
			if (!this.itemsUrl) return;
			if (!this.dataItemTemplateId) {
				console.error("RzCommand: `ItemsUrl` was provided, but no `<CommandItemTemplate>` was found to render the data.");
				this.error = "Configuration error: No data template found.";
				return;
			}
			this.isLoading = true;
			this.error = null;
			try {
				const url = new URL(this.itemsUrl, window.location.origin);
				if (this.serverFiltering && query) url.searchParams.append("q", query);
				const response = await fetch(url);
				if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
				const data = await response.json();
				if (this.serverFiltering) {
					this.items = this.items.filter((i) => !i.isDataItem);
					this.itemsById = new Map(this.items.map((item) => [item.id, item]));
				}
				const normalizedDataItems = data.map((item) => ({
					...item,
					id: this.resolveStableItemId(item),
					isDataItem: true
				}));
				this.registerItems(normalizedDataItems, { suppressFilter: true });
				this._dataFetched = true;
			} catch (e) {
				this.error = e.message || "Failed to fetch command items.";
				console.error("RzCommand:", this.error);
			} finally {
				this.isLoading = false;
				this.filterAndSortItems();
			}
		},
		handleInteraction() {
			if (this.itemsUrl && this.fetchTrigger === "on-open" && !this._dataFetched) this.fetchItems();
		},
		handleItemClick(event) {
			const host = event.target.closest("[data-command-item-id]");
			if (!host) return;
			const itemId = host.dataset.commandItemId;
			const index = this.filteredIndexById.get(itemId) ?? -1;
			if (index > -1) {
				const item = this.filteredItems[index];
				if (item && !item.disabled) {
					this.selectedIndex = index;
					this.$dispatch("rz:command:execute", { value: item.value });
				}
			}
		},
		handleItemHover(event) {
			const host = event.target.closest("[data-command-item-id]");
			if (!host) return;
			const itemId = host.dataset.commandItemId;
			const index = this.filteredIndexById.get(itemId) ?? -1;
			if (index > -1) {
				const item = this.filteredItems[index];
				if (item && !item.disabled && this.selectedIndex !== index) this.selectedIndex = index;
			}
		},
		handleKeydown(e) {
			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					this.selectNext();
					break;
				case "ArrowUp":
					e.preventDefault();
					this.selectPrev();
					break;
				case "Home":
					e.preventDefault();
					this.selectFirst();
					break;
				case "End":
					e.preventDefault();
					this.selectLast();
					break;
				case "Enter": {
					e.preventDefault();
					const item = this.filteredItems[this.selectedIndex];
					if (item && !item.disabled) this.$dispatch("rz:command:execute", { value: item.value });
					break;
				}
			}
		},
		selectNext() {
			if (this.filteredItems.length === 0) return;
			let i = this.selectedIndex;
			let count = 0;
			do {
				i = i + 1 >= this.filteredItems.length ? this.loop ? 0 : this.filteredItems.length - 1 : i + 1;
				count++;
				if (!this.filteredItems[i]?.disabled) {
					this.selectedIndex = i;
					return;
				}
				if (!this.loop && i === this.filteredItems.length - 1) return;
			} while (count <= this.filteredItems.length);
		},
		selectPrev() {
			if (this.filteredItems.length === 0) return;
			let i = this.selectedIndex;
			let count = 0;
			do {
				i = i - 1 < 0 ? this.loop ? this.filteredItems.length - 1 : 0 : i - 1;
				count++;
				if (!this.filteredItems[i]?.disabled) {
					this.selectedIndex = i;
					return;
				}
				if (!this.loop && i === 0) return;
			} while (count <= this.filteredItems.length);
		},
		selectFirst() {
			if (this.filteredItems.length > 0) {
				const firstEnabledIndex = this.filteredItems.findIndex((item) => !item.disabled);
				if (firstEnabledIndex > -1) this.selectedIndex = firstEnabledIndex;
			}
		},
		selectLast() {
			if (this.filteredItems.length > 0) {
				const lastEnabledIndex = this.filteredItems.map((item) => item.disabled).lastIndexOf(false);
				if (lastEnabledIndex > -1) this.selectedIndex = lastEnabledIndex;
			}
		}
	};
}
//#endregion
//#region src/js/lib/components/rzCommandGroup.js
function rzCommandGroup() {
	return {
		parent: null,
		heading: "",
		headingId: "",
		init() {
			const parentEl = this.$el.closest("[x-data=\"rzCommand\"]");
			if (!parentEl) {
				console.error("CommandGroup must be a child of RzCommand.");
				return;
			}
			this.parent = window.Alpine.$data(parentEl);
			this.heading = this.$el.dataset.heading;
			const template = this.$el.querySelector("template");
			const headingId = template?.dataset.headingId || "";
			const templateContent = template?.content ? template.content.cloneNode(true) : null;
			if (this.heading && templateContent) this.parent.registerGroupTemplate(this.heading, templateContent, headingId);
		}
	};
}
//#endregion
//#region src/js/lib/components/rzCommandItem.js
function rzCommandItem() {
	return {
		parent: null,
		itemData: {},
		hashString(value) {
			let hash = 0;
			for (let i = 0; i < value.length; i++) {
				hash = (hash << 5) - hash + value.charCodeAt(i);
				hash |= 0;
			}
			return String(hash >>> 0);
		},
		resolveItemId(value, name) {
			if (this.$el.id) return this.$el.id;
			if (value) return value;
			return `item-${this.hashString(name || this.$el.textContent.trim())}`;
		},
		init() {
			const parentEl = this.$el.closest("[x-data=\"rzCommand\"]");
			if (!parentEl) {
				console.error("CommandItem must be a child of RzCommand.");
				return;
			}
			this.parent = window.Alpine.$data(parentEl);
			const template = this.$el.querySelector("template");
			const templateContent = template?.content ? template.content.cloneNode(true) : null;
			const value = this.$el.dataset.value || this.$el.textContent.trim();
			const name = this.$el.dataset.name || this.$el.dataset.value || this.$el.textContent.trim();
			this.itemData = {
				id: this.resolveItemId(value, name),
				value,
				name,
				keywords: JSON.parse(this.$el.dataset.keywords || "[]"),
				group: this.$el.dataset.group || null,
				templateContent,
				disabled: this.$el.dataset.disabled === "true",
				forceMount: this.$el.dataset.forceMount === "true"
			};
			this.parent.registerItem(this.itemData);
		},
		destroy() {
			if (this.parent) this.parent.unregisterItem(this.itemData.id);
		}
	};
}
//#endregion
//#region src/js/lib/components/rzCommandList.js
function rzCommandList() {
	return {
		parent: null,
		dataItemTemplate: null,
		rowCache: /* @__PURE__ */ new Map(),
		separatorTemplate: null,
		showLoading: false,
		init() {
			const parentEl = this.$el.closest("[x-data=\"rzCommand\"]");
			if (!parentEl) {
				console.error("CommandList must be a child of RzCommand.");
				return;
			}
			this.parent = window.Alpine.$data(parentEl);
			if (this.parent.dataItemTemplateId) this.dataItemTemplate = document.getElementById(this.parent.dataItemTemplateId);
			const separator = this.$el.querySelector("[data-slot=\"command-separator\"]");
			if (separator) {
				this.separatorTemplate = separator.cloneNode(true);
				this.separatorTemplate.removeAttribute("id");
				this.separatorTemplate.removeAttribute("x-data");
				this.separatorTemplate.removeAttribute("data-alpine-root");
			}
			this.$el.querySelectorAll("[data-slot=\"command-separator\"]").forEach((element) => {
				element.remove();
			});
			this.showLoading = this.parent?.isLoading === true;
			this.$watch("parent.isLoading", (value) => {
				this.showLoading = value === true;
			});
			this.parent.setListInstance(this);
		},
		ensureRow(item) {
			if (this.rowCache.has(item.id)) return this.rowCache.get(item.id);
			let itemEl = null;
			if (item.isDataItem) {
				if (!this.dataItemTemplate || !this.dataItemTemplate.content) return null;
				itemEl = this.dataItemTemplate.content.cloneNode(true).firstElementChild;
				if (itemEl) {
					window.Alpine.addScopeToNode(itemEl, { item });
					window.Alpine.initTree(itemEl);
				}
			} else if (item.templateContent) itemEl = item.templateContent.cloneNode(true).firstElementChild;
			if (!itemEl) return null;
			this.rowCache.set(item.id, itemEl);
			return itemEl;
		},
		applyItemAttributes(itemEl, item, itemIndex) {
			itemEl.setAttribute("data-command-item-id", item.id);
			itemEl.setAttribute("data-value", item.value || "");
			if (item.keywords) itemEl.setAttribute("data-keywords", JSON.stringify(item.keywords));
			if (item.group) itemEl.setAttribute("data-group", item.group);
			if (item.disabled) {
				itemEl.setAttribute("data-disabled", "true");
				itemEl.setAttribute("aria-disabled", "true");
			} else {
				itemEl.removeAttribute("data-disabled");
				itemEl.removeAttribute("aria-disabled");
			}
			if (item.forceMount) itemEl.setAttribute("data-force-mount", "true");
			itemEl.setAttribute("role", "option");
			itemEl.setAttribute("aria-selected", this.parent.selectedIndex === itemIndex ? "true" : "false");
			if (this.parent.selectedIndex === itemIndex) itemEl.setAttribute("data-selected", "true");
			else itemEl.removeAttribute("data-selected");
		},
		renderList() {
			const items = this.parent.filteredItems || [];
			const groups = this.parent.groupTemplates || /* @__PURE__ */ new Map();
			const container = this.$el;
			const fragment = document.createDocumentFragment();
			const groupedItems = new Map([["__ungrouped__", []]]);
			for (const item of items) {
				const groupName = item.group || "__ungrouped__";
				if (!groupedItems.has(groupName)) groupedItems.set(groupName, []);
				groupedItems.get(groupName).push(item);
			}
			const groupEntries = Array.from(groupedItems.entries()).filter(([, groupItems]) => groupItems.length > 0);
			const namedGroupCount = groupEntries.filter(([groupName]) => groupName !== "__ungrouped__").length;
			let renderedNamedGroups = 0;
			groupEntries.forEach(([groupName, groupItems]) => {
				const isNamedGroup = groupName !== "__ungrouped__";
				if (isNamedGroup && this.separatorTemplate && namedGroupCount > 1 && renderedNamedGroups > 0) {
					const separatorClone = this.separatorTemplate.cloneNode(true);
					separatorClone.setAttribute("data-dynamic-item", "true");
					fragment.appendChild(separatorClone);
				}
				const groupContainer = document.createElement("div");
				groupContainer.setAttribute("role", "group");
				groupContainer.setAttribute("data-dynamic-item", "true");
				groupContainer.setAttribute("data-slot", "command-group");
				if (isNamedGroup) {
					const groupTemplate = groups.get(groupName);
					if (groupTemplate?.templateContent) {
						const headingClone = groupTemplate.templateContent.cloneNode(true);
						if (groupTemplate.headingId) groupContainer.setAttribute("aria-labelledby", groupTemplate.headingId);
						groupContainer.appendChild(headingClone);
					}
				}
				groupItems.forEach((item, idx) => {
					const itemIndex = this.parent.filteredIndexById.get(item.id) ?? idx;
					const itemEl = this.ensureRow(item);
					if (!itemEl) return;
					this.applyItemAttributes(itemEl, item, itemIndex);
					groupContainer.appendChild(itemEl);
				});
				fragment.appendChild(groupContainer);
				if (isNamedGroup) renderedNamedGroups += 1;
			});
			container.querySelectorAll("[data-dynamic-item]").forEach((el) => el.remove());
			container.appendChild(fragment);
			if (window.htmx) window.htmx.process(container);
		}
	};
}
//#endregion
export { rzCommand, rzCommandGroup, rzCommandItem, rzCommandList };

//# sourceMappingURL=command-runtime-DAov6mma.js.map