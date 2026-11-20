// Code-behind module for HarnessCounter.razor (integration tests).
export default () => ({
  count: 0,
  step: 1,

  init() {
    this.count = this.$props.InitialCount;
    this.step = this.$props.Step;
  },

  increment() {
    this.count += this.step;
  },

  decrement() {
    this.count -= this.step;
  },
});
