
export default () => ({
  visible: false,

  init() {
    // This init() function only runs after the 'loadPromo' event is dispatched.
    console.log('Promo banner script loaded and initialized!');
    
    // Once loaded, we can make it visible.
    // A small delay can make the transition feel smoother.
    this.$nextTick(() => {
        this.visible = true;
    });
  }
});