
export default () => ({
  visible: false,

  init() {
    // This init() function only runs after the 'async-alpine:load' event is dispatched with this component's ID.
    console.log('LoadByIdBanner script loaded and initialized!');
    
    // Once loaded, we can make it visible.
    this.$nextTick(() => {
        this.visible = true;
    });
  }
});