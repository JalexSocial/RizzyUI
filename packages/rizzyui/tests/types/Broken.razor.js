// @ts-check
// Must NOT type-check: misuses $props (tests/types.test.mjs expects the errors).

/** @type {import('rizzyui').AlpineCodeBehind<{ initialCount: number }>} */
export default () => ({
  count: 0,
  init() {
    /** @type {string} */
    const wrong = this.$props.initialCount;
    void wrong;
    this.$props.initialCount = 3;
  },
});
