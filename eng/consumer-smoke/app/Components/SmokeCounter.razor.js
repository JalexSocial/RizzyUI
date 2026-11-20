// @ts-check
/** @type {import('rizzyui').AlpineCodeBehind<{ Start: number }>} */
export default () => ({
  count: 0,
  init() {
    this.count = this.$props.Start;
  },
  increment() {
    this.count++;
  },
});
