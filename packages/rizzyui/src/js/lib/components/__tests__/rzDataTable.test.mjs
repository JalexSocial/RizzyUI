import assert from 'node:assert/strict';
import test from 'node:test';
import rzDataTable from '../rzDataTable.js';
import { rzDataTable as bundledRzDataTable } from '../../../bundles/table-runtime.js';
import { componentBundleManifest } from '../../../runtime/componentBundleManifest.js';

class HostElement {
  constructor(config) {
    this.dataset = { configId: 'datatable-config', alpineRoot: 'orders-table' };
    this.listeners = new Map();
    this.events = [];
    this.config = config;
  }

  addEventListener(type, listener) {
    this.listeners.set(type, listener);
  }

  removeEventListener(type, listener) {
    if (this.listeners.get(type) === listener) {
      this.listeners.delete(type);
    }
  }

  dispatchEvent(event) {
    this.events.push(event);
    return true;
  }
}

function withDom(config, callback) {
  const previousDocument = globalThis.document;
  const previousCustomEvent = globalThis.CustomEvent;
  const host = new HostElement(config);

  globalThis.document = {
    getElementById(id) {
      if (id !== 'datatable-config') return null;

      return {
        textContent: JSON.stringify(config),
      };
    },
  };
  globalThis.CustomEvent = class CustomEvent {
    constructor(type, options = {}) {
      this.type = type;
      this.detail = options.detail;
      this.bubbles = options.bubbles;
    }
  };

  try {
    return callback(host);
  } finally {
    if (previousDocument === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = previousDocument;
    }

    if (previousCustomEvent === undefined) {
      delete globalThis.CustomEvent;
    } else {
      globalThis.CustomEvent = previousCustomEvent;
    }
  }
}

function createConfig(overrides = {}) {
  return {
    data: [
      { id: 'a&<"', name: 'Ada', email: 'ada@example.com' },
      { id: 'b', name: 'Grace', email: 'grace@example.com' },
      { id: 'c', name: 'Linus', email: 'linus@example.com' },
    ],
    columns: [
      { id: 'select', cell: 'rowSelection', enableSorting: false },
      { id: 'name', accessorKey: 'name', header: 'Name' },
      { id: 'email', accessorKey: 'email', header: 'Email' },
    ],
    initialState: {
      pagination: { pageIndex: 0, pageSize: 2 },
      sorting: [],
      columnVisibility: {},
      columnFilters: [],
      rowSelection: {},
    },
    options: {
      enableSorting: true,
      enableFilters: true,
      enableColumnFilters: true,
      enableGlobalFilter: true,
      enableHiding: true,
      enableRowSelection: true,
      enableMultiRowSelection: true,
      enableSortingRemoval: true,
      enableMultiSort: true,
    },
    rowModelPipeline: {
      core: 'getCoreRowModel',
      filtered: 'getFilteredRowModel',
      sorted: 'getSortedRowModel',
      paginated: 'getPaginationRowModel',
    },
    rowStructure: {
      rowIdPath: 'id',
    },
    ...overrides,
  };
}

function mount(config = createConfig()) {
  return withDom(config, host => {
    const component = rzDataTable();
    component.$el = host;
    component.$root = host;
    component.init();

    return { component, host };
  });
}

test('DataTable runtime remains owned by the lazy table bundle', () => {
  assert.equal(componentBundleManifest.rzDataTable, 'table-runtime');
  assert.equal(bundledRzDataTable, rzDataTable);
});

test('generated row-selection cell has escaped row-specific accessible checkbox state', () => {
  const { component } = mount();
  const cell = component.rows[0].cells[0];
  const renderable = cell.column.columnDef.cell(cell.getContext());

  assert.equal(renderable.kind, 'html');
  assert.match(renderable.value, /type="checkbox"/);
  assert.match(renderable.value, /data-rz-datatable-row-select/);
  assert.match(renderable.value, /data-row-id="a&amp;&lt;&quot;"/);
  assert.match(renderable.value, /aria-label="Select row a&amp;&lt;&quot;"/);
  assert.match(renderable.value, /aria-checked="false"/);
});

test('sort changes dispatch aggregate, granular, and polite announcement events without unrelated granular noise', () => {
  const { component, host } = mount();
  const sortableHeader = component.headerGroups[0].headers.find(header => header.column.id === 'name');

  host.events.length = 0;
  component.sort.toggle(sortableHeader);

  const eventTypes = host.events.map(event => event.type);
  assert.deepEqual(eventTypes, [
    'rz:datatable:state-changed',
    'rz:datatable:sort-changed',
    'rz:datatable:announcement',
  ]);
  assert.deepEqual(host.events[0].detail.sorting, [{ id: 'name', desc: false }]);
  assert.deepEqual(host.events[1].detail.sorting, [{ id: 'name', desc: false }]);
  assert.equal(host.events[2].detail.reason, 'sorting');
  assert.equal(host.events[2].detail.politeness, 'polite');
  assert.equal(component.announcement.message, 'Sorted by name ascending.');
  assert.equal(component.sort.ariaSort(sortableHeader), 'ascending');
});

test('delegated generated selection checkbox updates row state with stable serializable payloads', () => {
  const { component, host } = mount();
  const changeListener = host.listeners.get('change');
  assert.equal(typeof changeListener, 'function');

  host.events.length = 0;
  changeListener({
    target: {
      checked: true,
      dataset: { rowId: 'b' },
      matches(selector) { return selector === 'input[data-rz-datatable-row-select][data-row-id]'; },
    },
  });

  const eventTypes = host.events.map(event => event.type);
  assert.deepEqual(eventTypes, [
    'rz:datatable:state-changed',
    'rz:datatable:selection-changed',
    'rz:datatable:announcement',
    'rz:datatable:row-selection-input-changed',
  ]);
  assert.deepEqual(host.events[1].detail.selectedRowIds, ['b']);
  assert.equal(host.events[1].detail.selectedRowCount, 1);
  assert.equal(host.events[2].detail.message, '1 row selected.');
  assert.equal(host.events[3].detail.rowId, 'b');
  assert.equal(host.events[3].detail.selected, true);
});

test('pagination, filter, and column visibility changes announce real state changes', () => {
  const { component, host } = mount();

  host.events.length = 0;
  component.pagination.nextPage();
  assert.equal(host.events.find(event => event.type === 'rz:datatable:page-changed').detail.pagination.pageIndex, 1);
  assert.equal(host.events.find(event => event.type === 'rz:datatable:announcement').detail.reason, 'pagination');

  host.events.length = 0;
  component.filter.setGlobalFilter('Ada');
  assert.equal(host.events.find(event => event.type === 'rz:datatable:filter-changed').detail.globalFilter, 'Ada');
  assert.equal(host.events.find(event => event.type === 'rz:datatable:announcement').detail.reason, 'filter');

  host.events.length = 0;
  component.toggleColumnVisibility('email');
  const visibilityEvent = host.events.find(event => event.type === 'rz:datatable:column-visibility-changed');
  assert.equal(visibilityEvent.detail.columnVisibility.email, false);
  assert.deepEqual(visibilityEvent.detail.visibleColumnIds, ['select', 'name']);
  assert.equal(host.events.find(event => event.type === 'rz:datatable:announcement').detail.reason, 'columnVisibility');
});


test('selection helpers maintain page/all checkbox state and dispatch serializable aggregate events', () => {
  const { component, host } = mount();

  assert.equal(component.selection.allPageRowsSelected(), false);
  assert.equal(component.selection.somePageRowsSelected(), false);

  host.events.length = 0;
  component.selection.setAllPageRows(true);

  assert.equal(component.selection.allPageRowsSelected(), true);
  assert.equal(component.selection.somePageRowsSelected(), false);
  assert.equal(component.selectedRowCount, 2);

  const stateEvent = host.events.find(event => event.type === 'rz:datatable:state-changed');
  const selectionEvent = host.events.find(event => event.type === 'rz:datatable:selection-changed');
  assert.deepEqual(stateEvent.detail.selectedRowIds, ['a&<"', 'b']);
  assert.deepEqual(selectionEvent.detail.selectedRowIds, ['a&<"', 'b']);
  assert.equal(selectionEvent.detail.selectedRowCount, 2);
  assert.equal(host.events.find(event => event.type === 'rz:datatable:announcement').detail.message, '2 rows selected.');

  host.events.length = 0;
  component.selection.setAllRows(false);
  assert.equal(component.selection.allRowsSelected(), false);
  assert.equal(component.selectedRowCount, 0);
  assert.deepEqual(host.events.find(event => event.type === 'rz:datatable:selection-changed').detail.selectedRowIds, []);
});

test('pagination ignores unavailable moves and emits page state only for real keyboard-activatable changes', () => {
  const { component, host } = mount();

  host.events.length = 0;
  component.pagination.previousPage();
  assert.deepEqual(host.events, []);
  assert.equal(component.pagination.pageIndex, 0);

  component.pagination.nextPage();
  assert.equal(component.pagination.pageIndex, 1);
  assert.equal(component.pagination.canPreviousPage, true);
  assert.equal(component.pagination.canNextPage, false);
  assert.equal(component.pagination.startRow, 3);
  assert.equal(component.pagination.endRow, 3);
  assert.deepEqual(host.events.find(event => event.type === 'rz:datatable:page-changed').detail.pagination, {
    pageIndex: 1,
    pageSize: 2,
  });
  assert.equal(host.events.find(event => event.type === 'rz:datatable:announcement').detail.message, 'Page 2 of 2. Showing rows 3 to 3 of 3.');
});

test('filter state updates row count and announces matching rows', () => {
  const { component, host } = mount();

  host.events.length = 0;
  component.filter.setGlobalFilter('Ada');

  assert.equal(component.filter.globalFilter, 'Ada');
  assert.equal(component.rows.length, 1);
  assert.equal(component.pagination.totalRows, 1);
  assert.equal(component.pagination.startRow, 1);
  assert.equal(component.pagination.endRow, 1);
  assert.equal(host.events.find(event => event.type === 'rz:datatable:filter-changed').detail.globalFilter, 'Ada');
  assert.equal(host.events.find(event => event.type === 'rz:datatable:announcement').detail.message, 'Filters applied. 1 rows match.');
});

test('column visibility helpers preserve column state and dispatch visible column ids', () => {
  const { component, host } = mount();

  const emailColumn = component.columns.getColumn('email');
  assert.equal(component.columns.getCanHide(emailColumn), true);
  assert.equal(component.columns.getIsVisible(emailColumn), true);

  host.events.length = 0;
  component.columns.toggleVisibility(emailColumn, false);

  assert.equal(component.columns.getIsVisible(emailColumn), false);
  assert.deepEqual(component.columns.getVisibleLeafColumns().map(column => column.id), ['select', 'name']);

  const visibilityEvent = host.events.find(event => event.type === 'rz:datatable:column-visibility-changed');
  assert.deepEqual(visibilityEvent.detail.columnVisibility, { email: false });
  assert.deepEqual(visibilityEvent.detail.visibleColumnIds, ['select', 'name']);
  assert.equal(host.events.find(event => event.type === 'rz:datatable:announcement').detail.message, '2 of 3 columns visible.');
});

test('row id validation preserves duplicate id rejection in the runtime', () => {
  assert.throws(() => mount(createConfig({
    data: [
      { id: 'duplicate', name: 'Ada' },
      { id: 'duplicate', name: 'Grace' },
    ],
  })), /duplicate row id 'duplicate'/);
});
