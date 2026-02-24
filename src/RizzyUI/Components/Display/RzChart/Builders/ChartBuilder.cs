
namespace RizzyUI.Charts;

/// <summary>
/// Root builder for creating a complete Chart.js configuration including data and options.
/// </summary>
public class ChartBuilder
{
    internal Chart Chart { get; } = new();

    /// <summary>
    /// Configures the data for the chart, including labels and datasets.
    /// </summary>
    /// <param name="action">A delegate to configure the <see cref="DataBuilder"/>.</param>
    /// <returns>The current <see cref="ChartBuilder"/> instance.</returns>
    public ChartBuilder Data(Action<DataBuilder> action)
    {
        Chart.Data = new Data();
        var builder = new DataBuilder(Chart.Data);
        action(builder);
        return this;
    }

    /// <summary>
    /// Configures global chart behavior such as responsiveness, animations, scales, and plugins.
    /// </summary>
    /// <param name="action">A delegate to configure the <see cref="OptionsBuilder"/>.</param>
    /// <returns>The current <see cref="ChartBuilder"/> instance.</returns>
    public ChartBuilder Options(Action<OptionsBuilder> action)
    {
        Chart.Options = new Options();
        var builder = new OptionsBuilder(Chart.Options);
        action(builder);
        return this;
    }
}

/// <summary>
/// Builder for configuring the <see cref="Data"/> object of a chart.
/// </summary>
public class DataBuilder
{
    private readonly Data _data;

    internal DataBuilder(Data data)
    {
        _data = data;
    }

    /// <summary>
    /// Sets the labels for the index axis (typically the X-axis). 
    /// These labels correspond to the data points in each dataset.
    /// </summary>
    /// <param name="labels">An array of strings representing the labels.</param>
    /// <returns>The current <see cref="DataBuilder"/> instance.</returns>
    public DataBuilder Labels(params string[] labels)
    {
        _data.Labels = labels;
        return this;
    }

    /// <summary>
    /// Configures the collection of datasets to be displayed on the chart.
    /// </summary>
    /// <param name="action">A delegate to configure the <see cref="DatasetsBuilder"/>.</param>
    /// <returns>The current <see cref="DataBuilder"/> instance.</returns>
    public DataBuilder Datasets(Action<DatasetsBuilder> action)
    {
        var builder = new DatasetsBuilder(_data);
        action(builder);
        return this;
    }
}

/// <summary>
/// Factory for creating specific types of datasets (Line, Bar, Pie, etc.) within a chart.
/// </summary>
public class DatasetsBuilder
{
    private readonly Data _data;

    internal DatasetsBuilder(Data data)
    {
        _data = data;
    }

    /// <summary>
    /// Adds a Line dataset to the chart. Useful for showing trend data or comparisons.
    /// </summary>
    public LineDatasetBuilder Line()
    {
        var dataset = new LineDataset { Type = "line" };
        _data.Datasets.Add(dataset);
        return new LineDatasetBuilder(dataset);
    }

    /// <summary>
    /// Adds a Radar dataset to the chart. Useful for showing variation between multiple data points across categories.
    /// </summary>
    public RadarDatasetBuilder Radar()
    {
        var dataset = new RadarDataset { Type = "radar" };
        _data.Datasets.Add(dataset);
        return new RadarDatasetBuilder(dataset);
    }

    /// <summary>
    /// Adds a Bar dataset to the chart. Useful for comparing data values across categories.
    /// </summary>
    public BarDatasetBuilder Bar()
    {
        var dataset = new BarDataset { Type = "bar" };
        _data.Datasets.Add(dataset);
        return new BarDatasetBuilder(dataset);
    }

    /// <summary>
    /// Adds a Bubble dataset to the chart. Displays three dimensions of data (x, y, and radius).
    /// </summary>
    public BubbleDatasetBuilder Bubble()
    {
        var dataset = new BubbleDataset { Type = "bubble" };
        _data.Datasets.Add(dataset);
        return new BubbleDatasetBuilder(dataset);
    }

    /// <summary>
    /// Adds a Doughnut dataset to the chart. Displays proportional values with a cutout center.
    /// </summary>
    public DoughnutPieDatasetBuilder Doughnut()
    {
        var dataset = new DoughnutPieDataset { Type = "doughnut" };
        _data.Datasets.Add(dataset);
        return new DoughnutPieDatasetBuilder(dataset);
    }

    /// <summary>
    /// Adds a Pie dataset to the chart. Displays proportional values as slices of a circle.
    /// </summary>
    public DoughnutPieDatasetBuilder Pie()
    {
        var dataset = new DoughnutPieDataset { Type = "pie" };
        _data.Datasets.Add(dataset);
        return new DoughnutPieDatasetBuilder(dataset);
    }

    /// <summary>
    /// Adds a Polar Area dataset to the chart. Similar to pie charts, but segments have different radii based on value.
    /// </summary>
    public PolarAreaDatasetBuilder PolarArea()
    {
        var dataset = new PolarAreaDataset { Type = "polarArea" };
        _data.Datasets.Add(dataset);
        return new PolarAreaDatasetBuilder(dataset);
    }

    /// <summary>
    /// Adds a Scatter dataset to the chart. Similar to a line chart but uses numeric data for both axes.
    /// </summary>
    public LineDatasetBuilder Scatter()
    {
        var dataset = new LineDataset { Type = "scatter" };
        _data.Datasets.Add(dataset);
        return new LineDatasetBuilder(dataset);
    }
}