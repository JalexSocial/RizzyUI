
export default () => ({
  message: '',
  count: 0,

  init() {
    // Watch the 'message' property for changes.
    this.$watch('message', (newValue) => {
      this.count = newValue.length;
    });
  }
});