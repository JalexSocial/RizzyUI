// @ts-check
// Code-behind for ScheduleBoard.razor: client-side level filter and day memory for the schedule.

/** @type {import('rizzyui').AlpineCodeBehind<{}>} */
export default () => ({
  announcement: '',

  init() {
    // The grid is replaced by htmx when a server filter changes: apply the level filter to the new cards.
    this.onSwap = () => this.applyLevels({ announce: false });
    this.$el.addEventListener('htmx:after:swap', this.onSwap);

    // The level toggles dispatch this from their x-on:click (an event rather than a method call, so
    // applyLevels runs with this component's $el, not the toggle's).
    this.onLevels = () => this.applyLevels();
    this.$el.addEventListener('summit:levels-changed', this.onLevels);
  },

  destroy() {
    this.$el.removeEventListener('htmx:after:swap', this.onSwap);
    this.$el.removeEventListener('summit:levels-changed', this.onLevels);
  },

  /** Keeps the selected day in the filter form, so the next server filter returns the same tab. */
  rememberDay(/** @type {CustomEvent} */ event) {
    const value = String(event.detail?.value ?? '');
    const input = /** @type {HTMLInputElement | null} */ (this.$el.querySelector('[data-schedule-day]'));
    if (input && value.startsWith('day-')) input.value = value.slice(4);
  },

  /** Shows only cards whose level is pressed; with nothing pressed, shows everything. */
  applyLevels(options = { announce: true }) {
    // RzToggle updates aria-pressed in its own click handler; read it after that has run.
    this.$nextTick(() => {
      const pressed = [...this.$el.querySelectorAll('[data-level-toggle]')]
        .filter(toggle => toggle.getAttribute('aria-pressed') === 'true')
        .map(toggle => toggle.getAttribute('data-level-toggle'));

      let visible = 0;
      for (const card of this.$el.querySelectorAll('[data-session-card]')) {
        const show = pressed.length === 0 || pressed.includes(card.getAttribute('data-level'));
        card.toggleAttribute('hidden', !show);
        if (show) visible++;
      }
      for (const slot of this.$el.querySelectorAll('[data-schedule-slot]')) {
        slot.toggleAttribute('hidden', slot.querySelector('[data-session-card]:not([hidden])') === null);
      }

      if (options.announce) {
        this.announcement = pressed.length === 0
          ? `Showing all ${visible} sessions.`
          : `${visible} ${pressed.join(' and ').toLowerCase()} sessions shown.`;
      }
    });
  },
});
