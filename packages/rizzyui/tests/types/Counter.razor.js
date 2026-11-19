// @ts-check
// Type-checked against types/rizzyui.d.ts by tests/types.test.mjs.

/** @type {import('rizzyui').AlpineCodeBehind<{ initialCount: number, label: string }>} */
export default () => ({
  count: 0,
  label: '',

  init() {
    this.count = this.$props.initialCount;
    this.label = this.$props.label.toUpperCase();
    this.$watch('count', value => this.$dispatch('counter-changed', { value }));
    const props = Rizzy.props(this.$el);
    void props;
  },

  ready() {
    const dialog = Rizzy.$data(this.$refs.dialog);
    void dialog;
  },

  increment() {
    this.count++;
  },
});

document.addEventListener('rz:module-error', event => {
  /** @type {string} */
  const name = event.detail.name;
  void name;
});
