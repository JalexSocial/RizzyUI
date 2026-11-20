// Code-behind module for HarnessPanel.razor (integration tests): uses an explicit Name.
export default () => ({
  title: '',
  opened: 'no',

  init() {
    this.title = this.$props.Title;
  },

  toggle() {
    this.opened = this.opened === 'no' ? 'yes' : 'no';
  },
});
