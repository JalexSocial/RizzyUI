# RzDataTable architecture

The architectural contract for `RzDataTable<TItem>`. The consumer-facing explanation is on the
DataTable page of the docs site (`src/RizzyUI.Docs/Components/Pages/Components/DataTableInfo.razor`);
the accessibility model is in `DataTableAccessibilityModeInfo.razor`. The owner decisions behind this
document are D-22 and D-23 in
[docs/audits/2026-11-15-rizzyui-initial-audit/DECISIONS.md](../audits/2026-11-15-rizzyui-initial-audit/DECISIONS.md).

> **RzDataTable is a headless, composable data-table component. It manages table state, data
> operations, and reactive behavior while leaving the rendered table structure under developer
> control. It complements RzTable rather than replacing it.**

## Purpose

`RzTable` and its parts (`TableHeader`, `TableRow`, `TableCell`, ...) are presentation: semantic
HTML table structure and styling. Many tables need more: sorting, filtering, pagination, selection,
column visibility, grouped headers. Those are state and algorithms, and they are the same whatever
the table looks like.

`RzDataTable<TItem>` provides that state, through TanStack Table, and exposes it to markup the
developer writes. Keeping the two apart means a team can build a compact list, a card-like layout
inside table rows, a table with inline actions, or a plain semantic table, all on the same state
engine, without RizzyUI deciding what a row or a cell looks like.

## Responsibilities

| Part | Responsible for |
|---|---|
| `RzDataTable<TItem>` (Razor) | Validating the configuration (columns, unique non-empty row ids), serializing `Items` and the configuration into an inert JSON script, rendering the Alpine host (`x-data="rzDataTable"`, lazy loading through `x-load`), the live announcement region, and the cascading `ParentRzDataTable` value. |
| `RzDataTableConfig<TItem>` | Typed column definitions (accessors, headers, footers, grouping, per-column sorting/filtering/hiding), feature switches and initial state. |
| TanStack Table (`@tanstack/table-core`) | Table state and algorithms: the row model pipeline, sorting, filtering, pagination, selection, column visibility, header groups. It is the source of truth. |
| `rzDataTable` (Alpine, `packages/rizzyui/src/js/lib/components/rzDataTable.js`) | Creating the TanStack instance from the transport, projecting its state into reactive properties (`headerGroups`, `rows`, `footerGroups`, `pagination`, ...), helper APIs (`sort`, `selection`, `pagination`, `filter`, `columns`), `rz:datatable:*` events and announcements. |
| `x-flexrender` (`directives/flexrender.js`) and `_flex` | Rendering TanStack header, cell and footer definitions into an element the developer chose. Text by default; HTML only when a renderer returns `flex.html(...)`. |
| DataTable helpers (`DataTableSortToggle`, `DataTableSortIcon`, `DataTableSelectionHeaderCell`, `DataTableSelectionCell`, `DataTableSelectAllCheckbox`, `DataTableRowSelectCheckbox`) | Optional, accessible building blocks for common controls, used inside the developer's markup. |
| Razor `ChildContent` (the developer) | The rendered structure: table markup, loops over the projections, cell layout, controls, labels, captions, empty states, pagination UI. |
| The consuming application | Which data reaches `Items` (authorization, sensitive fields), its own Alpine expressions under its CSP, server-side data loading. |

## Extension model

Developers customize without touching the state engine:

- **Structure:** any markup in `ChildContent`, usually `RzTable` with `template x-for` over
  `headerGroups`, `rows` and `footerGroups`.
- **Cell and header presentation:** per column, branch on `cell.column.id` / `header.column.id`
  with `template x-if` and render anything (badges, links, buttons, nested layouts) from
  `cell.getValue()` or `row.row.original`; or use `x-flexrender="_flex.cell(cell)"` for the
  default rendering.
- **Controls:** bind inputs and buttons to the helper APIs (`filter.setGlobalFilter(...)`,
  `pagination.nextPage()`, `columns.toggleVisibility(...)`, ...) or use the DataTable helpers.
- **Integration:** listen to `rz:datatable:*` events; swap whole tables with htmx.

## Design boundaries

RzDataTable intentionally does **not**:

- own the developer's visual layout;
- generate every table element automatically (generated `rowSelection` cells are a convenience,
  not the rendering model);
- enforce a universal column presentation;
- act as a full ARIA grid (no roving focus, cell navigation or grid roles; see
  `DataTableAccessibilityModeInfo.razor`);
- decide which server-side data is safe to expose;
- require server-side rendering of every individual row;
- perform server paging, filtering or sorting (it is client-side TanStack state).

Changing any of these needs an explicit architectural decision recorded in `DECISIONS.md`.

## Client data contract (D-23)

`Items` is serialized for the browser. **Every serializable property of every item can be read in
the page**, including properties of columns that are hidden or not defined. Column visibility is
presentation, not an authorization boundary. The application decides what is sent: pass a table
DTO or project with LINQ, and filter rows and fields by authorization before they reach `Items`.
RizzyUI does not filter properties, infer sensitivity or require a projection API. This is the
accepted boundary for audit finding RZUI-033 as it applies to RzDataTable; it does not change
`RzCombobox`, which sends only `value` and `text` by default (D-9).

## CSP contract

RizzyUI is responsible for its runtime, its helpers and its documented composition patterns working
under `rizzyui-csp.js` and a policy without `unsafe-eval` or `unsafe-inline`. Applications are
responsible for their own expressions.

Verified in the browser (2026-11-18): the CSP build accepts property reads, method calls with
arguments, comparisons, `&&`/`||`/`!`, ternaries, arithmetic and string concatenation, `$event`
reads, `x-for`, `x-if`, `:key` and `x-flexrender`. It rejects property assignment, which is what
`x-effect="$el.indeterminate = ..."` and `x-model` on a property path compile to. The helpers use
`x-indeterminate` (a read-only directive) for the indeterminate state; controls call methods
(`filter.setGlobalFilter($event.target.value)`) instead of assigning.

## Compatibility requirements

These are public and change only with a recorded decision and a "Breaking" changelog entry:

- **Parameters:** `Items`, `Config`, `RowIdSelector`, `ChildContent` and the inherited `RzComponent`
  parameters; `RzDataTableConfig<TItem>`, `RzDataTableColumn<TItem>`, `RzDataTableFeatures`,
  `RzDataTableInitialState` and their properties; the helper components' parameters (`HeaderExpr`,
  `RowExpr`, `Scope`, `AriaLabel`, icons).
- **Markup contract:** `data-slot="datatable"` on the root, the Alpine host with
  `data-alpine-root`, `data-config-id` and the JSON script, the `data-slot="announcement"` live
  region, `data-rz-datatable-row-select` / `data-row-id` on generated selection inputs, the helpers'
  `data-slot` values and `data-sort-direction`.
- **Events:** `rz:datatable:ready`, `state-changed`, `selection-changed`,
  `row-selection-input-changed`, `page-changed`, `sort-changed`, `filter-changed`,
  `column-visibility-changed`, `announcement`; bubbling `CustomEvent`s whose `detail` has
  `componentId` and serializable fields.
- **Runtime projections:** `headerGroups` (`id`, `headers`), `rows` (`id`, `row`, `cells`),
  `footerGroups`, `hasRows`, `isEmpty`, `selectedRowCount`, `announcement`, and the `sort`,
  `selection`, `pagination`, `filter` and `columns` APIs as documented on the DataTable page.
  Header, row and cell objects are TanStack's; their documented TanStack API is available.
- **Rendering:** `x-flexrender` with `_flex.header(header)`, `_flex.cell(cell)`,
  `_flex.footer(footer)`; renderers returning `flex.text` (text), `flex.html` (HTML, trusted
  content only), `flex.node` (cloned node) or `flex.empty`. String headers, footers and default
  cells render as text.
- **Not public:** `table` (an escape hatch to the TanStack instance, use at your own risk),
  `_stateVersion`, and `_flex` members other than the above.

## Tests

- bUnit: `src/RizzyUI.Tests/Components/DataTable/` (transport, validation, helper markup).
- JavaScript: `packages/rizzyui/src/js/lib/components/__tests__/rzDataTable.test.mjs` and
  `directives/__tests__/indeterminate.test.mjs`.
- Browser, real components, standard and CSP runtimes: `src/RizzyUI.Docs/tests/integration/
  datatable.ts` on `/_tests/datatable` (every feature, two tables, htmx insert/replace/remove, text
  and escaping, axe) and on `/components/datatable` (every documentation example).

## Guidance for future work

Developer-authored composition is the design, not a gap. Accessibility, cleanup or convenience work
must keep the developer in control of structure and presentation: add optional helpers, do not
replace `ChildContent` with generated markup, do not move to an ARIA grid, and do not add hidden
data policies. If a change would do any of these, record the decision first.
