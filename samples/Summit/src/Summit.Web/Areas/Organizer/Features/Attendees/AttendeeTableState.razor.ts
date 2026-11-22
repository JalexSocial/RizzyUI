// Code-behind for AttendeeTableState.razor (TypeScript, bundled by esbuild through RizzyUI.targets).
import type { AlpineCodeBehind } from 'rizzyui';
import { plural } from '../../../../Components/Shared/text';

type Props = {
  TableId: string;
  EditUrl: string;
  /** Id of the editor sheet (AttendeeEditor.SheetId). */
  EditorSheetId: string;
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
  focusAfterClose: null as string | null,
  editorOpen: false,

  init() {
    // SF-001: mirror the table's state into the hidden inputs.
    this.onState = (event: Event) => {
      const state = (event as CustomEvent<TableState>).detail;
      if (state.componentId !== this.$props.TableId) return;
      this.apply(state);
    };

    // The table dispatches no state event when it starts (on page load or after a rebuild), so read its
    // state once it is ready: a rebuilt table may start on another page than the inputs say. Then give
    // focus back to the row that was edited: the row is rebuilt after a save, so the sheet cannot.
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
      // While the editor is still open, its close (rz:sheet:close, after the sheet restored focus) does it.
      if (this.editorOpen) this.focusAfterClose = id;
      else this.focusRow(id);
    };

    this.onEditor = (event: Event) => {
      if ((event as CustomEvent<{ id: string }>).detail?.id !== this.$props.EditorSheetId) return;
      this.editorOpen = event.type === 'rz:sheet:open';
      const id = this.focusAfterClose;
      if (this.editorOpen || !id) return;
      this.focusAfterClose = null;
      this.focusRow(id);
    };

    this.$el.addEventListener('rz:datatable:state-changed', this.onState);
    this.$el.addEventListener('rz:datatable:ready', this.onReady);
    window.addEventListener('rz:sheet:open', this.onEditor);
    window.addEventListener('rz:sheet:close', this.onEditor);
  },

  destroy() {
    this.$el.removeEventListener('rz:datatable:state-changed', this.onState);
    this.$el.removeEventListener('rz:datatable:ready', this.onReady);
    window.removeEventListener('rz:sheet:open', this.onEditor);
    window.removeEventListener('rz:sheet:close', this.onEditor);
  },

  focusRow(id: string) {
    this.$nextTick(() => (this.$el.querySelector(`[data-edit-id="${CSS.escape(id)}"]`) as HTMLElement | null)?.focus());
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
