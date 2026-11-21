// Code-behind for SettingsPage.razor: keeps the URL on the open tab, so a reload or a shared link
// opens the same section (replaceState: switching tabs is not navigation).

/** @type {import('rizzyui').AlpineCodeBehind<{ Base: string }>} */
export default () => ({
  init() {
    this.onTabChange = (event) => {
      const value = event.detail?.value;
      if (typeof value === 'string' && value) history.replaceState(history.state, '', `${this.$props.Base}/${value}`);
    };
    this.$el.addEventListener('rz:tabs-change', this.onTabChange);
  },

  destroy() {
    this.$el.removeEventListener('rz:tabs-change', this.onTabChange);
  },
});
