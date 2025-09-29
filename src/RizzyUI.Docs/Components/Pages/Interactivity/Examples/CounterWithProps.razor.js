
export default () => ({
  count: 0,
  step: 1,

  // init() runs when the component is initialized.
  init() {
    // Read the data passed from Blazor.
    const props = Rizzy.props(this.$el);
    this.count = props.initialCount || 0; // Use a fallback
    this.step = props.step || 1;
  },

  increment() {
    this.count += this.step;
  },

  decrement() {
    this.count -= this.step;
  }
});