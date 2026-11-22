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
    // SF-058: the provider announces a complete range but is not part of the form, so put the range in
    // the hidden inputs and submit the form.
    this.onRange = (event: Event) => {
      const { start, end } = (event as CustomEvent<{ start: string; end: string }>).detail;
      this.closePopover();
      this.send(start, end);
    };
    this.$el.addEventListener('rz:calendar:range-complete', this.onRange);
  },

  destroy() {
    this.$el.removeEventListener('rz:calendar:range-complete', this.onRange);
  },

  last7() { this.setRange(daysBefore(this.$props.Today, 6), this.$props.Today); },
  last30() { this.setRange(daysBefore(this.$props.Today, 29), this.$props.Today); },
  wholeSale() { this.setRange(this.$props.AllFrom, this.$props.Today); },

  /**
   * Sets the provider's dates (the calendar and the button label follow them) and submits the form.
   * The provider normalizes the dates over more than one tick, so the hidden inputs are written
   * directly rather than waiting for their bindings.
   */
  setRange(from: string, to: string) {
    const provider = window.Rizzy.$data(this.$props.ProviderId);
    if (!provider) return;
    provider.dates = [from, to];
    this.send(from, to);
  },

  /** Writes the range into the form's hidden inputs (ahead of their bindings) and submits the form. */
  send(from: string, to: string) {
    const form = this.$root.querySelector('form') as HTMLFormElement;
    (form.elements.namedItem('From') as HTMLInputElement).value = from;
    (form.elements.namedItem('To') as HTMLInputElement).value = to;
    window.htmx.trigger(form, 'change');
  },

  closePopover() {
    const popover = this.$root.querySelector('[data-slot="popover"]');
    const data = popover ? window.Rizzy.$data(popover) : null;
    if (data && 'open' in data) data.open = false;
  },
});

export default dashboardFilters;
