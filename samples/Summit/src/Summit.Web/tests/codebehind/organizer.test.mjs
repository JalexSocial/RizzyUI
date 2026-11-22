// Unit tests for organizer code-behind modules, with @jalexsocial/rizzyui/testing under happy-dom.
// The modules are bundled into .test-build/ by scripts/run-codebehind-tests.mjs first.
import { GlobalRegistrator } from '@happy-dom/global-registrator';
GlobalRegistrator.register();

import { test } from 'node:test';
import assert from 'node:assert/strict';

const { mountCodeBehind } = await import('@jalexsocial/rizzyui/testing');
const attendeeTableState = (await import('../../.test-build/Areas/Organizer/Features/Attendees/AttendeeTableState.razor.js')).default;
const scheduleBuilderPage = (await import('../../.test-build/Areas/Organizer/Features/ScheduleBuilder/ScheduleBuilderPage.razor.js')).default;

const stateInputs = `
  <div id="attendee-table-state">
    <input name="Sort" x-bind:value="sort"><input name="Desc" x-bind:value="desc"><input name="Page" x-bind:value="page">
    <input name="Search" x-bind:value="filterText"><input name="Hidden" x-bind:value="hidden"><input name="Selected" x-bind:value="selected">
  </div>
  <div id="table"></div>`;

const value = (root, name) => root.querySelector(`input[name="${name}"]`).value;

test('AttendeeTableState mirrors the table state into its inputs (SF-001)', async () => {
  const { root, data, nextTick, destroy } = await mountCodeBehind(attendeeTableState, {
    props: { TableId: 'attendees', EditUrl: '/organizer/attendees' },
    html: stateInputs,
  });

  root.querySelector('#table').dispatchEvent(new CustomEvent('rz:datatable:state-changed', {
    bubbles: true,
    detail: {
      componentId: 'attendees',
      sorting: [{ id: 'Company', desc: true }],
      pagination: { pageIndex: 3, pageSize: 25 },
      globalFilter: 'acme',
      columnVisibility: { Country: false, Email: true, Tags: false },
      selectedRowIds: ['a-1', 'a-7'],
      selectedRowCount: 2,
    },
  }));
  await nextTick();

  assert.equal(value(root, 'Sort'), 'Company');
  assert.equal(value(root, 'Desc'), 'true');
  assert.equal(value(root, 'Page'), '3');
  assert.equal(value(root, 'Search'), 'acme');
  assert.equal(value(root, 'Hidden'), 'Country,Tags');
  assert.equal(value(root, 'Selected'), 'a-1,a-7');
  assert.equal(data.selectionLabel, '2 attendees selected');
  destroy();
});

test('AttendeeTableState ignores other tables and builds the bulk confirmation text', async () => {
  const { root, data, nextTick, destroy } = await mountCodeBehind(attendeeTableState, {
    props: { TableId: 'attendees', EditUrl: '/organizer/attendees' },
    html: stateInputs,
  });
  root.querySelector('#table').dispatchEvent(new CustomEvent('rz:datatable:state-changed', {
    bubbles: true,
    detail: { componentId: 'other', sorting: [{ id: 'Name', desc: false }], pagination: null, columnVisibility: {}, selectedRowIds: [], selectedRowCount: 0 },
  }));
  await nextTick();
  assert.equal(value(root, 'Sort'), '');

  data.selectedCount = 1;
  let opened = false;
  window.addEventListener('attendees:bulk-confirm', () => { opened = true; }, { once: true });
  data.confirmBulk('check-in');
  assert.equal(data.bulkSummary, 'Check in 1 attendee?');
  assert.equal(data.bulkAction, 'check-in');
  assert.ok(opened);
  destroy();
});

test('ScheduleBuilderPage applies the View menu through rz:menubar:checked-change (SF-067)', async () => {
  const { root, destroy } = await mountCodeBehind(scheduleBuilderPage, {
    attributes: { 'data-density': 'comfortable', 'data-drafts-only': 'false' },
  });
  // RzMenubar dispatches the event on the menubar, inside the component (the menu content is teleported).
  const send = (detail) => root.dispatchEvent(new CustomEvent('rz:menubar:checked-change', { bubbles: true, detail }));
  send({ type: 'checkbox', value: 'drafts-only', checked: true, group: null });
  send({ type: 'radio', value: 'compact', checked: true, group: 'density' });

  assert.equal(root.dataset.draftsOnly, 'true');
  assert.equal(root.dataset.density, 'compact');
  destroy();
});
