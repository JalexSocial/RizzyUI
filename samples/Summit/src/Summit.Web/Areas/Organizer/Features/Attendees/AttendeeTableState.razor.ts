// Code-behind for AttendeeTableState.razor (TypeScript, bundled by esbuild through RizzyUI.targets).
import type { AlpineCodeBehind } from 'rizzyui';
import { plural } from '../../../../Components/Shared/text';

type Props = {
  TableId: string;
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
  selectedCount: 0,
  bulkAction: '',
  bulkSummary: '',
  focusAfterRebuild: null as string | null,
  focusAfterClose: null as string | null,
  editorOpen: false,

  init() {
    // The table keeps its own state input (StateInputName, D-31); the bulk bar needs the selection count.
    this.onState = (event: Event) => {
      const state = (event as CustomEvent<TableState>).detail;
      if (state.componentId !== this.$props.TableId) return;
      this.selectedCount = state.selectedRowCount;
    };

    // A rebuilt table starts without a selection and dispatches no state event, so reset the count when
    // it is ready. Then give focus back to the row that was edited: the row is rebuilt after a save, so
    // the sheet cannot.
    this.onReady = (event: Event) => {
      if ((event as CustomEvent<{ componentId: string }>).detail.componentId !== this.$props.TableId) return;
      const table = window.Rizzy.$data(this.$props.TableId)?.table;
      if (table) this.selectedCount = table.getSelectedRowModel().rows.length;
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

  /** The row's Edit button loads the editor with hx-get; remember the row to give focus back after a save. */
  edit(rowId: string) {
    this.focusAfterRebuild = rowId;
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
