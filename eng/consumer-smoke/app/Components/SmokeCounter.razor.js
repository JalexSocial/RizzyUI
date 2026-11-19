// @ts-check
/** @type {import('rizzyui').AlpineCodeBehind<{ start: number }>} */
export default () => ({
  count: 0,
  init() {
    this.count = this.$props.start;
  },
  increment() {
    this.count++;
  },
});
