import {
    createTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    functionalUpdate,
} from '@tanstack/table-core';
import { flex } from '../directives/flexrender.js';

function readJsonConfig(rootEl) {
    const configId = rootEl?.dataset?.configId;
    if (!configId) {
        throw new Error('[RizzyUI] rzDataTable requires data-config-id on the alpine host.');
    }

    const scriptEl = document.getElementById(configId);
    if (!scriptEl) {
        throw new Error(`[RizzyUI] rzDataTable config script '${configId}' was not found.`);
    }

    return JSON.parse(scriptEl.textContent || '{}');
}

function getSegmentValue(source, segment) {
    if (source === null || source === undefined) {
        return undefined;
    }

    if (typeof source !== 'object') {
        return undefined;
    }

    if (Object.prototype.hasOwnProperty.call(source, segment)) {
        return source[segment];
    }

    const camelCaseSegment = segment.length > 0
        ? segment.charAt(0).toLowerCase() + segment.slice(1)
        : segment;

    if (Object.prototype.hasOwnProperty.call(source, camelCaseSegment)) {
        return source[camelCaseSegment];
    }

    return undefined;
}

function getByPath(source, path) {
    if (!path) {
        return undefined;
    }

    const segments = path.split('.');
    let current = source;

    for (const segment of segments) {
        current = getSegmentValue(current, segment);
        if (current === undefined) {
            return undefined;
        }
    }

    return current;
}

function normalizeColumns(columns) {
    return (columns || []).map(column => {
        const normalized = {
            ...column,
        };

        if (Array.isArray(column.columns) && column.columns.length > 0) {
            normalized.columns = normalizeColumns(column.columns);
        }

        if (column.accessorKey) {
            normalized.accessorFn = row => getByPath(row, column.accessorKey);
        }

        if (column.cell === 'rowSelection') {
            normalized.cell = cellContext => {
                const row = cellContext.row;
                const isChecked = row.getIsSelected();
                return flex.html(`<input type="checkbox" aria-label="Select row ${row.id}" ${isChecked ? 'checked' : ''} />`);
            };
        } else if (!column.cell) {
            normalized.cell = cellContext => flex.text(cellContext.getValue?.() ?? '');
        }

        if (typeof normalized.header === 'string') {
            const headerText = normalized.header;
            normalized.header = () => flex.text(headerText);
        }

        if (typeof normalized.footer === 'string') {
            const footerText = normalized.footer;
            normalized.footer = () => flex.text(footerText);
        }

        return normalized;
    });
}

function buildRowModelGetters(pipeline) {
    const registry = {
        getCoreRowModel,
        getFilteredRowModel,
        getSortedRowModel,
        getPaginationRowModel,
    };

    const result = {};
    for (const key of [pipeline?.core, pipeline?.filtered, pipeline?.sorted, pipeline?.paginated]) {
        if (key && registry[key]) {
            result[key] = registry[key]();
        }
    }

    return result;
}

function normalizeInitialState(initialState) {
    return {
        sorting: initialState?.sorting || [],
        pagination: initialState?.pagination || { pageIndex: 0, pageSize: 10 },
        columnVisibility: initialState?.columnVisibility || {},
        columnFilters: initialState?.columnFilters || [],
        globalFilter: initialState?.globalFilter,
        rowSelection: initialState?.rowSelection || {},
        columnPinning: initialState?.columnPinning || { left: [], right: [] },
    };
}

function normalizeStatePayload(state, componentId, table) {
    return {
        componentId,
        sorting: state.sorting || [],
        pagination: state.pagination || null,
        globalFilter: state.globalFilter,
        rowSelection: state.rowSelection || {},
        columnVisibility: state.columnVisibility || {},
        selectedRowCount: table.getSelectedRowModel().rows.length,
    };
}

function normalizeRowIdValue(value, rowIdPath, index) {
    if (value === null || value === undefined || value === '') {
        throw new Error(`[RizzyUI] rzDataTable could not resolve a stable non-empty row id for row at index ${index} using path '${rowIdPath}'.`);
    }

    return String(value);
}

function validateRowIds(data, rowIdPath) {
    if (!rowIdPath || typeof rowIdPath !== 'string') {
        throw new Error('[RizzyUI] rzDataTable requires rowStructure.rowIdPath to resolve a stable row id for every row.');
    }

    const seen = new Map();

    for (let index = 0; index < data.length; index++) {
        const originalRow = data[index];
        const rawValue = getByPath(originalRow, rowIdPath);
        const normalizedId = normalizeRowIdValue(rawValue, rowIdPath, index);

        if (seen.has(normalizedId)) {
            const firstIndex = seen.get(normalizedId);
            throw new Error(`[RizzyUI] rzDataTable resolved duplicate row id '${normalizedId}' for rows at indexes ${firstIndex} and ${index} using path '${rowIdPath}'. Row ids must be unique.`);
        }

        seen.set(normalizedId, index);
    }
}

function buildHeaderGroups(table) {
    const groups = table?.getHeaderGroups?.() || [];

    return groups.map(group => ({
        id: group.id,
        headers: [...group.headers],
    }));
}

function buildRows(table) {
    const rows = table?.getRowModel?.().rows || [];

    return rows.map(row => ({
        id: row.id,
        row,
        cells: [...row.getVisibleCells()],
    }));
}

function buildFooterGroups(table) {
    const groups = table?.getFooterGroups?.() || [];

    return groups.map(group => ({
        id: group.id,
        headers: [...group.headers],
    }));
}

function createEmptyPaginationState() {
    return {
        pageIndex: 0,
        pageSize: 10,
        pageCount: 0,
        canPreviousPage: false,
        canNextPage: false,
        totalRows: 0,
        startRow: 0,
        endRow: 0,
    };
}

function buildPaginationItems(pageIndex, pageCount) {
    if (pageCount <= 0) {
        return [];
    }

    if (pageCount <= 7) {
        return Array.from({ length: pageCount }, (_, index) => ({
            kind: 'page',
            id: `page-${index}`,
            pageIndex: index,
            label: String(index + 1),
            isActive: index === pageIndex,
        }));
    }

    const includedPages = new Set([
        0,
        1,
        pageCount - 2,
        pageCount - 1,
        pageIndex - 1,
        pageIndex,
        pageIndex + 1,
    ]);

    const normalizedPages = [...includedPages]
        .filter(x => x >= 0 && x < pageCount)
        .sort((a, b) => a - b);

    const items = [];
    let previousPage = null;

    for (const page of normalizedPages) {
        if (previousPage !== null && page - previousPage > 1) {
            items.push({
                kind: 'ellipsis',
                id: `ellipsis-${previousPage}-${page}`,
            });
        }

        items.push({
            kind: 'page',
            id: `page-${page}`,
            pageIndex: page,
            label: String(page + 1),
            isActive: page === pageIndex,
        });

        previousPage = page;
    }

    return items;
}


function resolveSortDirection(component, header) {
    if (!header?.column) {
        return false;
    }

    // Read a reactive value so Alpine re-evaluates sort helper expressions when table state changes.
    // This keeps bindings like x-show="sort.direction(header) === 'asc'" in sync.
    // eslint-disable-next-line no-unused-expressions
    component._stateVersion;

    const columnId = header.column.id;
    const sorting = component.table?.getState?.()?.sorting || [];
    const entry = sorting.find(x => x?.id === columnId);

    if (!entry) {
        return false;
    }

    return entry.desc ? 'desc' : 'asc';
}


function touchReactiveState(component) {
    // eslint-disable-next-line no-unused-expressions
    component._stateVersion;
}

function createSortApi(component) {
    return {
        can: header => {
            touchReactiveState(component);
            return !!header?.column?.getCanSort?.();
        },

        direction: header => resolveSortDirection(component, header),

        isSorted: header => resolveSortDirection(component, header) !== false,

        toggle: header => {
            if (!header?.column?.getCanSort?.()) {
                return;
            }

            header.column.toggleSorting();
        },

        ariaSort: header => {
            const value = resolveSortDirection(component, header);

            if (value === 'asc') {
                return 'ascending';
            }

            if (value === 'desc') {
                return 'descending';
            }

            return 'none';
        },

        nextLabel: header => {
            if (!header?.column?.getCanSort?.()) {
                return 'Sorting unavailable';
            }

            const value = resolveSortDirection(component, header);
            const enableSortingRemoval = component.table?.options?.enableSortingRemoval !== false;

            if (value === 'asc') {
                return 'Sort descending';
            }

            if (value === 'desc') {
                return enableSortingRemoval ? 'Clear sort' : 'Sort ascending';
            }

            return 'Sort ascending';
        },
    };
}
function createSelectionApi(component) {
    return {
        canSelect: row => {
            touchReactiveState(component);
            return row?.getCanSelect?.() !== false;
        },

        isSelected: row => {
            touchReactiveState(component);
            return !!row?.getIsSelected?.();
        },

        isSomeSelected: row => {
            touchReactiveState(component);
            return !!row?.getIsSomeSelected?.();
        },

        setRowSelected: (row, value) => {
            if (row?.getCanSelect?.() === false) {
                return;
            }

            row?.toggleSelected?.(!!value);
        },

        toggleRow: row => {
            if (row?.getCanSelect?.() === false) {
                return;
            }

            row?.toggleSelected?.();
        },

        allRowsSelected: () => {
            touchReactiveState(component);
            return !!component.table?.getIsAllRowsSelected?.();
        },

        someRowsSelected: () => {
            touchReactiveState(component);
            return !!component.table?.getIsSomeRowsSelected?.();
        },

        setAllRows: value => {
            component.table?.toggleAllRowsSelected?.(!!value);
        },

        toggleAllRows: () => {
            component.table?.toggleAllRowsSelected?.();
        },

        allPageRowsSelected: () => {
            touchReactiveState(component);
            return !!component.table?.getIsAllPageRowsSelected?.();
        },

        somePageRowsSelected: () => {
            touchReactiveState(component);
            return !!component.table?.getIsSomePageRowsSelected?.();
        },

        setAllPageRows: value => {
            component.table?.toggleAllPageRowsSelected?.(!!value);
        },

        toggleAllPageRows: () => {
            component.table?.toggleAllPageRowsSelected?.();
        },
    };
}


function createPaginationApi(component) {
    return {
        ...createEmptyPaginationState(),
        items: [],

        previousPage() {
            if (!component.table || !component.table.getCanPreviousPage()) {
                return;
            }

            component.table.previousPage();
        },

        nextPage() {
            if (!component.table || !component.table.getCanNextPage()) {
                return;
            }

            component.table.nextPage();
        },

        firstPage() {
            if (!component.table || !component.table.getCanPreviousPage()) {
                return;
            }

            component.table.firstPage();
        },

        lastPage() {
            if (!component.table || !component.table.getCanNextPage()) {
                return;
            }

            component.table.lastPage();
        },

        setPageIndex(index) {
            if (!component.table) {
                return;
            }

            const parsedIndex = Number(index);
            if (!Number.isInteger(parsedIndex) || parsedIndex < 0) {
                return;
            }

            component.table.setPageIndex(parsedIndex);
        },

        setPageSize(size) {
            if (!component.table) {
                return;
            }

            const parsedSize = Number(size);
            if (!Number.isInteger(parsedSize) || parsedSize <= 0) {
                return;
            }

            component.table.setPageSize(parsedSize);
        },
    };
}

function createFilterApi(component) {
    return {
        globalFilter: '',

        setGlobalFilter(value) {
            if (!component.table) {
                return;
            }

            component.table.setGlobalFilter(value);
        },
    };
}

function createColumnsApi(component) {
    return {
        all: [],
        leaf: [],
        visibleLeaf: [],
        columnVisibility: {},

        getColumn(id) {
            return component.table?.getColumn?.(id);
        },

        getAllColumns() {
            touchReactiveState(component);
            return this.all;
        },

        getAllLeafColumns() {
            touchReactiveState(component);
            return this.leaf;
        },

        getVisibleLeafColumns() {
            touchReactiveState(component);
            return this.visibleLeaf;
        },

        setColumnVisibility(updater) {
            component.table?.setColumnVisibility?.(updater);
        },

        resetColumnVisibility() {
            component.table?.resetColumnVisibility?.();
        },

        toggleAllColumnsVisible(value) {
            component.table?.toggleAllColumnsVisible?.(value);
        },

        getIsAllColumnsVisible() {
            touchReactiveState(component);
            return !!component.table?.getIsAllColumnsVisible?.();
        },

        getIsSomeColumnsVisible() {
            touchReactiveState(component);
            return !!component.table?.getIsSomeColumnsVisible?.();
        },

        getCanHide(column) {
            touchReactiveState(component);
            return !!column?.getCanHide?.();
        },

        getIsVisible(column) {
            touchReactiveState(component);
            return !!column?.getIsVisible?.();
        },

        toggleVisibility(column, value) {
            column?.toggleVisibility?.(value);
        },
    };
}

export default function rzDataTable() {
    return {
        table: null,
        headerGroups: [],
        rows: [],
        footerGroups: [],
        hasRows: false,
        isEmpty: true,
        selectedRowCount: 0,
        _stateVersion: 0,
        _flex: flex,
        sort: null,
        selection: null,
        pagination: null,
        filter: null,
        columns: null,

        init() {
            const root = this.$el;
            const componentId = root?.dataset?.alpineRoot || this.$root?.id || root?.id || null;
            const transport = readJsonConfig(root);
            const data = transport.data || [];
            const columns = normalizeColumns(transport.columns);
            const rowModelGetters = buildRowModelGetters(transport.rowModelPipeline || {});
            const state = normalizeInitialState(transport.initialState);
            const rowIdPath = transport.rowStructure?.rowIdPath;

            validateRowIds(data, rowIdPath);

            let table = null;

            table = createTable({
                data,
                columns,
                state,
                enableSorting: transport.options?.enableSorting,
                enableFilters: transport.options?.enableFilters,
                enableColumnFilters: transport.options?.enableColumnFilters,
                enableGlobalFilter: transport.options?.enableGlobalFilter,
                enableHiding: transport.options?.enableHiding,
                enableRowSelection: transport.options?.enableRowSelection,
                enableMultiRowSelection: transport.options?.enableMultiRowSelection,
                enableSortingRemoval: transport.options?.enableSortingRemoval,
                enableMultiSort: transport.options?.enableMultiSort,
                getRowId: (originalRow, index) => {
                    const rawValue = getByPath(originalRow, rowIdPath);
                    return normalizeRowIdValue(rawValue, rowIdPath, index);
                },
                onStateChange: updater => {
                    const nextState = functionalUpdate(updater, table.options.state);

                    table.setOptions(prev => ({
                        ...prev,
                        state: nextState,
                    }));

                    this.refreshDerivedState();
                    this.dispatchStateEvents(componentId);
                },
                ...rowModelGetters,
            });

            this.table = table;
            this.sort = createSortApi(this);
            this.selection = createSelectionApi(this);
            this.pagination = createPaginationApi(this);
            this.filter = createFilterApi(this);
            this.columns = createColumnsApi(this);

            this.refreshDerivedState();

            this.dispatchEvent('rz:datatable:ready', {
                componentId,
            });
        },

        toggleColumnVisibility(id) {
            const column = this.columns?.getColumn(id);
            if (!column) {
                return;
            }

            this.columns.toggleVisibility(column);
        },

        refreshDerivedState() {
            this._stateVersion += 1;
            this.headerGroups = buildHeaderGroups(this.table);
            this.rows = buildRows(this.table);
            this.footerGroups = buildFooterGroups(this.table);
            this.hasRows = this.rows.length > 0;
            this.isEmpty = !this.hasRows;
            this.selectedRowCount = this.table?.getSelectedRowModel?.().rows.length || 0;
            if (this.filter) {
                this.filter.globalFilter = this.table?.getState?.().globalFilter ?? '';
            }
            if (this.columns) {
                this.columns.all = this.table?.getAllColumns?.() ?? [];
                this.columns.leaf = this.table?.getAllLeafColumns?.() ?? [];
                this.columns.visibleLeaf = this.table?.getVisibleLeafColumns?.() ?? [];
                this.columns.columnVisibility = this.table?.getState?.().columnVisibility ?? {};
            }

            this.refreshPaginationState();
        },

        refreshPaginationState() {
            if (!this.table || !this.pagination) {
                return;
            }

            const state = this.table.getState();
            const pageIndex = state.pagination?.pageIndex ?? 0;
            const pageSize = state.pagination?.pageSize ?? 10;
            const pageCount = this.table.getPageCount();
            const totalRows = this.table.getPrePaginationRowModel().rows.length;
            const visibleRows = this.rows.length;

            const startRow = totalRows === 0 ? 0 : (pageIndex * pageSize) + 1;
            const endRow = totalRows === 0 || visibleRows === 0
                ? 0
                : startRow + visibleRows - 1;

            this.pagination.pageIndex = pageIndex;
            this.pagination.pageSize = pageSize;
            this.pagination.pageCount = pageCount;
            this.pagination.canPreviousPage = this.table.getCanPreviousPage();
            this.pagination.canNextPage = this.table.getCanNextPage();
            this.pagination.totalRows = totalRows;
            this.pagination.startRow = startRow;
            this.pagination.endRow = endRow;
            this.pagination.items = buildPaginationItems(pageIndex, pageCount);
        },

        dispatchStateEvents(componentId) {
            if (!this.table) {
                return;
            }

            const state = this.table.getState();
            const payload = normalizeStatePayload(state, componentId, this.table);

            this.dispatchEvent('rz:datatable:state-changed', payload);
            this.dispatchEvent('rz:datatable:selection-changed', {
                componentId,
                rowSelection: payload.rowSelection,
                selectedRowCount: payload.selectedRowCount,
            });
            this.dispatchEvent('rz:datatable:page-changed', {
                componentId,
                pagination: payload.pagination,
            });
            this.dispatchEvent('rz:datatable:sort-changed', {
                componentId,
                sorting: payload.sorting,
            });
            this.dispatchEvent('rz:datatable:filter-changed', {
                componentId,
                globalFilter: payload.globalFilter,
            });
            this.dispatchEvent('rz:datatable:column-visibility-changed', {
                componentId,
                columnVisibility: payload.columnVisibility,
            });
        },

        dispatchEvent(name, detail) {
            this.$el.dispatchEvent(new CustomEvent(name, {
                bubbles: true,
                detail,
            }));
        },
    };
}
