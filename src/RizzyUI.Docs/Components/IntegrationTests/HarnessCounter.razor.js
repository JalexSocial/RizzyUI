// Code-behind module for HarnessCounter.razor (integration tests).
export default () => ({
  count: 0,
  step: 1,

  init() {
    this.count = this.$props.initialCount;
    this.step = this.$props.step;
  },

  increment() {
    this.count += this.step;
  },

  decrement() {
    this.count -= this.step;
  },
});
