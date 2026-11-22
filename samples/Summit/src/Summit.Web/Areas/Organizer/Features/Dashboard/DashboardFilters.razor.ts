// Code-behind for DashboardFilters.razor (TypeScript).
import type { AlpineCodeBehind } from 'rizzyui';

type Props = { ProviderId: string; Today: string; AllFrom: string };

/** yyyy-MM-dd for a day `offset` days before `iso`. */
function daysBefore(iso: string, offset: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d - offset));
  return date.toISOString().slice(0, 10);
}

const dashboardFilters: AlpineCodeBehind<Props> = () => ({
  init() {
    // The provider posts the range itself and raises change (which sends the form); close the popover.
    this.onRange = () => this.closePopover();
    this.$el.addEventListener('rz:calendar:range-complete', this.onRange);
  },

  destroy() {
    this.$el.removeEventListener('rz:calendar:range-complete', this.onRange);
  },

  last7() { this.setRange(daysBefore(this.$props.Today, 6), this.$props.Today); },
  last30() { this.setRange(daysBefore(this.$props.Today, 29), this.$props.Today); },
  wholeSale() { this.setRange(this.$props.AllFrom, this.$props.Today); },

  /** Sets the provider's dates: the calendar, the button label and the form fields follow, and the form is sent. */
  setRange(from: string, to: string) {
    const provider = window.Rizzy.$data(this.$props.ProviderId);
    if (provider) provider.dates = [from, to];
  },

  closePopover() {
    const popover = this.$root.querySelector('[data-slot="popover"]');
    const data = popover ? window.Rizzy.$data(popover) : null;
    if (data && 'open' in data) data.open = false;
  },
});

export default dashboardFilters;
