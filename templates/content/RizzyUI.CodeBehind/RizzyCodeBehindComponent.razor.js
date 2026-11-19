// @ts-check
// Alpine code-behind for RizzyCodeBehindComponent.razor. The default export returns a new data
// object for each instance: properties are reactive state, methods are called from the markup.

/** @type {import('rizzyui').AlpineCodeBehind<{ title: string }>} */
export default () => ({
  count: 0,

  init() {
    // Runs once when the component starts. this.$props holds the Props from the .razor file.
  },

  increment() {
    this.count++;
  },

  decrement() {
    this.count--;
  },
});
