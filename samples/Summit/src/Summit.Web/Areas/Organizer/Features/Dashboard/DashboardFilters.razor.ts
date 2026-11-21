// Code-behind for DashboardFilters.razor (TypeScript).
import type { AlpineCodeBehind } from 'rizzyui';

type Props = { ProviderId: string; CalendarId: string; Today: string; AllFrom: string };

const CALENDAR_EVENTS = ['rz:calendar:init', 'rz:calendar:destroy', 'rz:calendar:click-day'];

/** yyyy-MM-dd for a day `offset` days before `iso`. */
function daysBefore(iso: string, offset: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d - offset));
  return date.toISOString().slice(0, 10);
}

/** SF-062: destroys the real Chart.js instances of the RzCharts in `region` and their theme listeners. */
function destroyCharts(region: Element) {
  const Alpine = window.Rizzy.Alpine;
  region.querySelectorAll('[x-data="rzChart"]').forEach((element) => {
    const data = Alpine.$data(element);
    if (!data) return;
    if (data.themeChangeHandler) {
      window.removeEventListener('rz:theme-change', data.themeChangeHandler);
      data.themeChangeHandler = null;
    }
    const chart = Alpine.raw(data.chartInstance);
    if (chart) {
      chart.destroy();
      data.chartInstance = null;
    }
  });
}

const dashboardFilters: AlpineCodeBehind<Props> = () => ({
  init() {
    // SF-057: RzPopover teleports its content (and the calendar) to <body>, so the calendar's events
    // bubble to <body> instead of the provider that wraps the popover. Forward them to the provider.
    this.forward = (event: Event) => {
      const target = event.target as Element | null;
      if (!target?.closest?.(`#${this.$props.CalendarId}`)) return;
      const provider = document.getElementById(this.$props.ProviderId);
      if (!provider || provider.contains(target)) return;
      provider.dispatchEvent(new CustomEvent(event.type, { detail: (event as CustomEvent).detail }));
    };
    for (const name of CALENDAR_EVENTS) document.addEventListener(name, this.forward);

    // SF-058: the provider announces a complete range but is not part of the form, so put the range in
    // the hidden inputs and submit the form.
    this.onRange = (event: Event) => {
      const { start, end } = (event as CustomEvent<{ start: string; end: string }>).detail;
      this.closePopover();
      this.send(start, end);
    };
    this.$el.addEventListener('rz:calendar:range-complete', this.onRange);

    // SF-062: RzChart keeps its Chart.js instance in Alpine's reactive state, so its own destroy() and
    // update() run on a proxy: destroy() leaves the chart registered with Chart.js (later frames throw
    // "reading 'save'") and update() on a theme change throws. Destroy the real instances before the
    // charts region is swapped.
    this.onBeforeSwap = (event: Event) => {
      const text = (event as CustomEvent).detail?.ctx?.text;
      const region = document.getElementById('dashboard-charts');
      if (region && typeof text === 'string' && text.includes('id="dashboard-charts"')) destroyCharts(region);
    };
    document.addEventListener('htmx:before:swap', this.onBeforeSwap);

    // SF-005 (and SF-062): RzChart does not re-read its CSS variable colors on a theme change. This
    // listener is registered before any chart's, so it runs first: it destroys the charts (removing
    // their listeners before they run) and loads the panels again under the new theme.
    this.onTheme = () => {
      const region = document.getElementById('dashboard-charts');
      if (!region || !region.querySelector('[data-slot="chart"]')) return;
      destroyCharts(region);
      const form = this.$root.querySelector('form') as HTMLFormElement;
      const query = new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString();
      window.htmx.ajax('GET', `/organizer/dashboard/panels?${query}`, { target: '#dashboard-charts', swap: 'outerHTML' });
    };
    window.addEventListener('rz:theme-change', this.onTheme);
  },

  destroy() {
    for (const name of CALENDAR_EVENTS) document.removeEventListener(name, this.forward);
    this.$el.removeEventListener('rz:calendar:range-complete', this.onRange);
    window.removeEventListener('rz:theme-change', this.onTheme);
    document.removeEventListener('htmx:before:swap', this.onBeforeSwap);
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
