// @ts-check
/** @type {import('rizzyui').AlpineCodeBehind<{ initialCount: number, step: number }>} */
export default () => ({
  count: 0,
  step: 1,

  // init() runs when the component starts; this.$props holds the Props from CounterWithProps.razor.
  init() {
    this.count = this.$props.initialCount;
    this.step = this.$props.step;
  },

  increment() {
    this.count += this.step;
  },

  decrement() {
    this.count -= this.step;
  }
});
