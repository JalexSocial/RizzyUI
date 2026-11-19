// @ts-check
/** @type {import('rizzyui').AlpineCodeBehind<{ InitialCount: number, Step: number }>} */
export default () => ({
  count: 0,
  step: 1,

  // init() runs when the component starts; this.$props holds the Props from CounterWithProps.razor.
  init() {
    this.count = this.$props.InitialCount;
    this.step = this.$props.Step;
  },

  increment() {
    this.count += this.step;
  },

  decrement() {
    this.count -= this.step;
  }
});
