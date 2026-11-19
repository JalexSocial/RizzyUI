// @ts-check
// Alpine code-behind for WelcomeTip.razor. The default export returns the component's data:
// properties are reactive state, methods are called from the markup (x-on:click="dismiss").

/** @type {import('rizzyui').AlpineCodeBehind<{ storageKey: string }>} */
export default () => ({
  visible: false,

  init() {
    this.visible = readFlag(this.$props.storageKey) !== 'dismissed';
  },

  dismiss() {
    this.visible = false;
    writeFlag(this.$props.storageKey, 'dismissed');
  },
});

/** @param {string} key */
function readFlag(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** @param {string} key @param {string} value */
function writeFlag(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private windows, blocked site data); the tip just shows again.
  }
}
