// Code-behind for AttendeeTableState.razor (TypeScript, bundled by esbuild through RizzyUI.targets).
import type { AlpineCodeBehind } from 'rizzyui';
import { plural } from '../../../../Components/Shared/text';

type Props = {
  TableId: string;
  EditUrl: string;
};

/** The detail of rz:datatable:state-changed (normalizeStatePayload in rzDataTable.js). */
type TableState = {
  componentId: string;
  sorting: { id: string; desc: boolean }[];
  pagination: { pageIndex: number; pageSize: number } | null;
  globalFilter?: string;
  columnVisibility: Record<string, boolean>;
  selectedRowIds: string[];
  selectedRowCount: number;
};

const BULK_LABELS: Record<string, string> = {
  'check-in': 'Check in',
  resend: 'Resend tickets to',
  cancel: 'Cancel the registrations of',
};

const attendeeTableState: AlpineCodeBehind<Props> = () => ({
  sort: '',
  desc: true,
  page: 0,
  pageSize: 10,
  filterText: '',
  hidden: '',
  selected: '',
  selectedCount: 0,
  bulkAction: '',
  bulkSummary: '',
  focusAfterRebuild: null as string | null,

  init() {
    // SF-001: mirror the table's state into the hidden inputs.
    this.onState = (event: Event) => {
      const state = (event as CustomEvent<TableState>).detail;
      if (state.componentId !== this.$props.TableId) return;
      this.apply(state);
    };

    // The table dispatches no state event when it starts (on page load or after a rebuild), so read its
    // state once it is ready: a rebuilt table may start on another page than the inputs say. SF-002: give focus back to the row that was edited.
    this.onReady = (event: Event) => {
      if ((event as CustomEvent<{ componentId: string }>).detail.componentId !== this.$props.TableId) return;
      const table = window.Rizzy.$data(this.$props.TableId)?.table;
      if (table) {
        const s = table.getState();
        this.apply({
          componentId: this.$props.TableId,
          sorting: s.sorting,
          pagination: s.pagination,
          globalFilter: s.globalFilter,
          columnVisibility: s.columnVisibility,
          selectedRowIds: Object.keys(s.rowSelection ?? {}).filter((id) => s.rowSelection[id]),
          selectedRowCount: Object.values(s.rowSelection ?? {}).filter(Boolean).length,
        });
      }
      const id = this.focusAfterRebuild;
      if (!id) return;
      this.focusAfterRebuild = null;
      this.$nextTick(() => (this.$el.querySelector(`[data-edit-id="${CSS.escape(id)}"]`) as HTMLElement | null)?.focus());
    };

    this.$el.addEventListener('rz:datatable:state-changed', this.onState);
    this.$el.addEventListener('rz:datatable:ready', this.onReady);
  },

  destroy() {
    this.$el.removeEventListener('rz:datatable:state-changed', this.onState);
    this.$el.removeEventListener('rz:datatable:ready', this.onReady);
  },

  apply(state: TableState) {
    this.sort = state.sorting[0]?.id ?? '';
    this.desc = state.sorting[0]?.desc ?? false;
    this.page = state.pagination?.pageIndex ?? 0;
    this.pageSize = state.pagination?.pageSize ?? 10;
    this.filterText = state.globalFilter ?? '';
    this.hidden = Object.entries(state.columnVisibility ?? {}).filter(([, visible]) => !visible).map(([id]) => id).join(',');
    this.selected = state.selectedRowIds.join(',');
    this.selectedCount = state.selectedRowCount;
  },

  /** SF-048: rows are rendered by Alpine, after htmx processed the page, so they cannot carry hx-get. */
  edit(rowId: string) {
    this.focusAfterRebuild = rowId;
    const id = rowId.replace(/^a-/, '');
    window.htmx.ajax('GET', `${this.$props.EditUrl}/${id}/edit`, { target: '#attendee-editor', swap: 'innerHTML' });
  },

  /** Opens the confirmation dialog for a bulk action on the selected rows. */
  confirmBulk(action: string) {
    this.bulkAction = action;
    this.bulkSummary = `${BULK_LABELS[action] ?? action} ${plural(this.selectedCount, 'attendee')}?`;
    window.dispatchEvent(new CustomEvent('attendees:bulk-confirm'));
  },

  get selectionLabel(): string {
    return `${plural(this.selectedCount, 'attendee')} selected`;
  },
});

export default attendeeTableState;
