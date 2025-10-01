
// This example assumes a charting library like Chart.js is available globally
// or can be imported. For a real app, you would add Chart.js to your asset bundling.
// For this demo, we will simulate the chart creation.

export default () => ({
  chartInstance: null,

  init() {
    // This init() function will only run when the component becomes visible
    // because of `LoadStrategy="visible"`.
    console.log('LazyChart is now visible and its script is running!');

    const props = Rizzy.props(this.$el);
    const canvas = this.$el.querySelector('canvas');

    if (canvas && props.ChartData) {
      // In a real application, you would initialize Chart.js here:
      // import Chart from 'chart.js/auto';
      // this.chartInstance = new Chart(canvas, {
      //   type: 'bar',
      //   data: {
      //     labels: props.ChartData.labels,
      //     datasets: [{
      //       label: '# of Votes',
      //       data: props.ChartData.data,
      //       borderWidth: 1
      //     }]
      //   }
      // });

      // For this documentation demo, we'll just simulate it.
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(100, 150, 255, 0.5)';
      ctx.fillRect(20, 80, 50, 70);
      ctx.fillRect(90, 40, 50, 110);
      ctx.fillRect(160, 120, 50, 30);
      ctx.font = '16px sans-serif';
      ctx.fillStyle = 'black';
      ctx.fillText('Chart would be rendered here', 20, 20);
    }
  },

  destroy() {
    // If you created a chart instance, you would destroy it here
    // if (this.chartInstance) {
    //   this.chartInstance.destroy();
    // }
  }
});