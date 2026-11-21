// @ts-check
// Code-behind for ConferenceCountdown.razor: ticks down to the opening keynote once a minute.

/**
 * @typedef {{ OpensAt: number, ServerNow: number }} Props
 * @type {import('rizzyui').AlpineCodeBehind<Props>}
 */
export default () => ({
  days: '0',
  hours: '00',
  minutes: '00',

  init() {
    // Use the server's "now" plus the time elapsed in the browser, so a skewed client clock (or the
    // fixed clock in tests) cannot change the countdown.
    this.offset = this.$props.ServerNow - Date.now();
    this.update();
    this.timer = setInterval(() => this.update(), 60_000);
  },

  destroy() {
    clearInterval(this.timer);
  },

  update() {
    const left = Math.max(0, this.$props.OpensAt - (Date.now() + this.offset));
    const totalMinutes = Math.floor(left / 60_000);
    this.days = String(Math.floor(totalMinutes / 1440));
    this.hours = String(Math.floor((totalMinutes % 1440) / 60)).padStart(2, '0');
    this.minutes = String(totalMinutes % 60).padStart(2, '0');
  },
});
