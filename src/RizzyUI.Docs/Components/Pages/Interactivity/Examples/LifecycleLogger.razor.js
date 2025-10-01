
export default () => ({
  seconds: 0,
  intervalId: null,

  handleResize() {
    console.log('Window resized!');
  },

  init() {
    console.log('LifecycleLogger component initialized!');
    this.intervalId = setInterval(() => {
      this.seconds++;
    }, 1000);

    // Manually add a window event listener
    window.addEventListener('resize', this.handleResize);
  },

  destroy() {
    // Clean up the interval when the component is removed
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Always remove manual event listeners
    window.removeEventListener('resize', this.handleResize);
    
    console.log('LifecycleLogger component destroyed and cleaned up.');
  }
});