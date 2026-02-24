
#pragma warning disable CS1591
namespace RizzyUI.Charts;

public class ChartBuilder
{
    internal Chart Chart { get; } = new();

    public ChartBuilder Data(Action<DataBuilder> action)
    {
        Chart.Data = new Data();
        var builder = new DataBuilder(Chart.Data);
        action(builder);
        return this;
    }

    public ChartBuilder Options(Action<OptionsBuilder> action)
    {
        Chart.Options = new Options();
        var builder = new OptionsBuilder(Chart.Options);
        action(builder);
        return this;
    }
}

public class DataBuilder
{
    private readonly Data _data;

    internal DataBuilder(Data data)
    {
        _data = data;
    }

    public DataBuilder Labels(params string[] labels)
    {
        _data.Labels = labels;
        return this;
    }

    public DataBuilder Datasets(Action<DatasetsBuilder> action)
    {
        var builder = new DatasetsBuilder(_data);
        action(builder);
        return this;
    }
}

public class DatasetsBuilder
{
    private readonly Data _data;

    internal DatasetsBuilder(Data data)
    {
        _data = data;
    }

    public LineDatasetBuilder Line()
    {
        var dataset = new LineDataset { Type = "line" };
        _data.Datasets.Add(dataset);
        return new LineDatasetBuilder(dataset);
    }

    public RadarDatasetBuilder Radar()
    {
        var dataset = new RadarDataset { Type = "radar" };
        _data.Datasets.Add(dataset);
        return new RadarDatasetBuilder(dataset);
    }

    public BarDatasetBuilder Bar()
    {
        var dataset = new BarDataset { Type = "bar" };
        _data.Datasets.Add(dataset);
        return new BarDatasetBuilder(dataset);
    }

    public BubbleDatasetBuilder Bubble()
    {
        var dataset = new BubbleDataset { Type = "bubble" };
        _data.Datasets.Add(dataset);
        return new BubbleDatasetBuilder(dataset);
    }

    public DoughnutPieDatasetBuilder Doughnut()
    {
        var dataset = new DoughnutPieDataset { Type = "doughnut" };
        _data.Datasets.Add(dataset);
        return new DoughnutPieDatasetBuilder(dataset);
    }

    public DoughnutPieDatasetBuilder Pie()
    {
        var dataset = new DoughnutPieDataset { Type = "pie" };
        _data.Datasets.Add(dataset);
        return new DoughnutPieDatasetBuilder(dataset);
    }

    public PolarAreaDatasetBuilder PolarArea()
    {
        var dataset = new PolarAreaDataset { Type = "polarArea" };
        _data.Datasets.Add(dataset);
        return new PolarAreaDatasetBuilder(dataset);
    }

    public LineDatasetBuilder Scatter()
    {
        var dataset = new LineDataset { Type = "scatter" };
        _data.Datasets.Add(dataset);
        return new LineDatasetBuilder(dataset);
    }
}