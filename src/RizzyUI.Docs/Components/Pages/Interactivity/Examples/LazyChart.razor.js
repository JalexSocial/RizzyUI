
// This example assumes a charting library like Chart.js is available globally
// or can be imported. For a real app, you would add Chart.js to your asset bundling.

export default () => ({
  chartInstance: null,

  async init() {
    // This init() function will only run when the component becomes visible
    // because of `LoadStrategy="visible"`.
    console.log('LazyChart is now visible and its script is running!');

    await Rizzy.require("https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.2.0/chart.umd.js")
          .then(({ bundleId }) => {
              console.log(`Bundle ${bundleId} loaded successfully!`);

              const props = Rizzy.props(this.$el);
              const canvas = this.$el.querySelector('canvas');

              if (canvas && props.chartData) {

                  this.chartInstance = new Chart(canvas, {
                      type: 'bar',
                      data: {
                          labels: props.chartData.labels,
                          datasets: [{
                              label: '# of Votes',
                              data: props.chartData.data,
                              borderWidth: 1
                          }]
                      }
                  });
              }

          })
          .catch(err => {
              console.error("Failed to load bundle:", err.message);
          });
  },

  destroy() {
    // If you created a chart instance, you would destroy it here
    if (this.chartInstance) {
       this.chartInstance.destroy();
    }
  }
});