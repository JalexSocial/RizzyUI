
#pragma warning disable CS1591
namespace RizzyUI.Charts;

public abstract class BaseDatasetBuilder<T> where T : BaseDatasetBuilder<T>
{
    private readonly BaseDataset _dataset;

    internal BaseDatasetBuilder(BaseDataset baseDataset)
    {
        _dataset = baseDataset;
    }

    public T Label(string label) { _dataset.Label = label; return (T)this; }
    public T BackgroundColor(string color) { _dataset.BackgroundColor = color; return (T)this; }
    public T BackgroundColor(Color color) { _dataset.BackgroundColor = color.ToCssColorString(); return (T)this; }
    public T BackgroundColors(params string[] colors) { _dataset.BackgroundColor = colors; return (T)this; }
    public T BackgroundColors(params Color[] colors) { _dataset.BackgroundColor = colors.Select(c => c.ToCssColorString()).ToArray(); return (T)this; }
    public T BorderColor(string color) { _dataset.BorderColor = color; return (T)this; }
    public T BorderColor(Color color) { _dataset.BorderColor = color.ToCssColorString(); return (T)this; }
    public T BorderColors(params string[] colors) { _dataset.BorderColor = colors; return (T)this; }
    public T BorderColors(params Color[] colors) { _dataset.BorderColor = colors.Select(c => c.ToCssColorString()).ToArray(); return (T)this; }
    public T BorderWidth(int width) { _dataset.BorderWidth = width; return (T)this; }
    public T Clip(int clip) { _dataset.Clip = clip; return (T)this; }
    public T Clip(Action<ClipBuilder> action)
    {
        _dataset.Clip = new Clip();
        action(new ClipBuilder((Clip)_dataset.Clip));
        return (T)this;
    }
    public T Clip(bool enabled) { _dataset.Clip = enabled; return (T)this; }
    public T HoverBackgroundColor(string color) { _dataset.HoverBackgroundColor = color; return (T)this; }
    public T HoverBackgroundColor(Color color) { _dataset.HoverBackgroundColor = color.ToCssColorString(); return (T)this; }
    public T HoverBackgroundColors(params string[] colors) { _dataset.HoverBackgroundColor = colors; return (T)this; }
    public T HoverBackgroundColors(params Color[] colors) { _dataset.HoverBackgroundColor = colors.Select(c => c.ToCssColorString()).ToArray(); return (T)this; }
    public T HoverBorderColor(string color) { _dataset.HoverBorderColor = color; return (T)this; }
    public T HoverBorderColor(Color color) { _dataset.HoverBorderColor = color.ToCssColorString(); return (T)this; }
    public T HoverBorderColors(params string[] colors) { _dataset.HoverBorderColor = colors; return (T)this; }
    public T HoverBorderColors(params Color[] colors) { _dataset.HoverBorderColor = colors.Select(c => c.ToCssColorString()).ToArray(); return (T)this; }
    public T HoverBorderWidth(int width) { _dataset.HoverBorderWidth = width; return (T)this; }
    public T Parsing(bool enabled) { _dataset.Parsing = enabled; return (T)this; }
    public T Parsing(string key) { _dataset.Parsing = new Parsing { Key = key }; return (T)this; }
    public T Parsing(string xAxisKey, string yAxisKey) { _dataset.Parsing = new Parsing { XAxisKey = xAxisKey, YAxisKey = yAxisKey }; return (T)this; }
    public T Hidden(bool hidden) { _dataset.Hidden = hidden; return (T)this; }
}

public abstract class PointDatasetBuilder<T> : BaseDatasetBuilder<T> where T : PointDatasetBuilder<T>
{
    private readonly PointDataset _dataset;

    internal PointDatasetBuilder(PointDataset dataset) : base(dataset)
    {
        _dataset = dataset;
    }

    public T BorderCapStyle(CapStyle capStyle) { _dataset.BorderCapStyle = capStyle; return (T)this; }
    public T BorderDash(params int[] borderDash) { _dataset.BorderDash = borderDash; return (T)this; }
    public T BorderDashOffset(double borderDashOffset) { _dataset.BorderDashOffset = borderDashOffset; return (T)this; }
    public T BorderJoinStyle(JoinStyle borderJoinStyle) { _dataset.BorderJoinStyle = borderJoinStyle; return (T)this; }
    public T HoverBorderCapStyle(CapStyle capStyle) { _dataset.HoverBorderCapStyle = capStyle; return (T)this; }
    public T HoverBorderDash(params int[] hoverBorderDash) { _dataset.HoverBorderDash = hoverBorderDash; return (T)this; }
    public T HoverBorderDashOffset(double hoverBorderDashOffset) { _dataset.HoverBorderDashOffset = hoverBorderDashOffset; return (T)this; }
    public T HoverBorderJoinStyle(JoinStyle hoverBorderJoinStyle) { _dataset.HoverBorderJoinStyle = hoverBorderJoinStyle; return (T)this; }
    public T Fill(bool fill) { _dataset.Fill = fill; return (T)this; }
    public T Fill(string fill) { _dataset.Fill = fill; return (T)this; }
    public T Fill(Action<FillBuilder> action)
    {
        _dataset.Fill = new Fill();
        action(new FillBuilder((Fill)_dataset.Fill));
        return (T)this;
    }
    public T Order(int order) { _dataset.Order = order; return (T)this; }
    public T PointBackgroundColor(string color) { _dataset.PointBackgroundColor = color; return (T)this; }
    public T PointBackgroundColor(Color color) { _dataset.PointBackgroundColor = color.ToCssColorString(); return (T)this; }
    public T PointBorderColor(string color) { _dataset.PointBorderColor = color; return (T)this; }
    public T PointBorderColor(Color color) { _dataset.PointBorderColor = color.ToCssColorString(); return (T)this; }
    public T PointBorderWidth(int width) { _dataset.PointBorderWidth = width; return (T)this; }
    public T PointHitRadius(int radius) { _dataset.PointHitRadius = radius; return (T)this; }
    public T PointHoverBackgroundColor(string color) { _dataset.PointHoverBackgroundColor = color; return (T)this; }
    public T PointHoverBackgroundColor(Color color) { _dataset.PointHoverBackgroundColor = color.ToCssColorString(); return (T)this; }
    public T PointHoverBorderColor(string color) { _dataset.PointHoverBorderColor = color; return (T)this; }
    public T PointHoverBorderColor(Color color) { _dataset.PointHoverBorderColor = color.ToCssColorString(); return (T)this; }
    public T PointHoverBorderWidth(int width) { _dataset.PointHoverBorderWidth = width; return (T)this; }
    public T PointHoverRadius(int radius) { _dataset.PointHoverRadius = radius; return (T)this; }
    public T PointRadius(int radius) { _dataset.PointRadius = radius; return (T)this; }
    public T PointRotation(int rotation) { _dataset.PointRotation = rotation; return (T)this; }
    public T PointStyle(bool enabled) { _dataset.PointStyle = enabled; return (T)this; }
    public T PointStyle(PointStyle pointStyle) { _dataset.PointStyle = pointStyle; return (T)this; }
    public T SpanGaps(bool spanGaps) { _dataset.SpanGaps = spanGaps; return (T)this; }
    public T Tension(double tension) { _dataset.Tension = tension; return (T)this; }
}

public abstract class ArcDatasetBuilder<T> : BaseDatasetBuilder<T> where T : ArcDatasetBuilder<T>
{
    private readonly ArcDataset _dataset;

    internal ArcDatasetBuilder(ArcDataset dataset) : base(dataset)
    {
        _dataset = dataset;
    }

    public T BorderAlign(BorderAlign borderAlign) { _dataset.BorderAlign = borderAlign; return (T)this; }
    public T BorderDash(params int[] dashes) { _dataset.BorderDash = dashes; return (T)this; }
    public T BorderDashOffset(double dashOffset) { _dataset.BorderDashOffset = dashOffset; return (T)this; }
    public T BorderJoinStyle(JoinStyle joinStyle) { _dataset.BorderJoinStyle = joinStyle; return (T)this; }
    public T Data(params int[] data) { _dataset.Data = data; return (T)this; }
    public T HoverBorderDash(params int[] dashes) { _dataset.HoverBorderDash = dashes; return (T)this; }
    public T HoverBorderDashOffset(double dashOffset) { _dataset.HoverBorderDashOffset = dashOffset; return (T)this; }
    public T HoverBorderJoinStyle(JoinStyle joinStyle) { _dataset.HoverBorderJoinStyle = joinStyle; return (T)this; }
}

public class BarDatasetBuilder : BaseDatasetBuilder<BarDatasetBuilder>
{
    private readonly BarDataset _dataset;

    internal BarDatasetBuilder(BarDataset baseDataset) : base(baseDataset)
    {
        _dataset = baseDataset;
    }

    public BarDatasetBuilder Data(object data) { _dataset.Data = data; return this; }
    public BarDatasetBuilder Data(IList<object> data) { _dataset.Data = data; return this; }
    public BarDatasetBuilder Data(params double[] data) { _dataset.Data = data; return this; }
    public BarDatasetBuilder Data(params string[] data) { _dataset.Data = data; return this; }
    public BarDatasetBuilder Base(int value) { _dataset.Base = value; return this; }
    public BarDatasetBuilder BarPercentage(double percentage) { _dataset.BarPercentage = percentage; return this; }
    public BarDatasetBuilder BarThickness(int thickness) { _dataset.BarThickness = thickness; return this; }
    public BarDatasetBuilder BarThickness(string thickness) { _dataset.BarThickness = thickness; return this; }
    public BarDatasetBuilder BorderSkipped(Skipped skipped) { _dataset.BorderSkipped = skipped; return this; }
    public BarDatasetBuilder BorderSkipped(bool skipped) { _dataset.BorderSkipped = skipped; return this; }
    public new BarDatasetBuilder BorderWidth(int width) { _dataset.BorderWidth = width; return this; }
    public BarDatasetBuilder BorderWidth(Action<BorderWidthBuilder> action)
    {
        _dataset.BorderWidth = new BorderWidth();
        action(new BorderWidthBuilder((BorderWidth)_dataset.BorderWidth));
        return this;
    }
    public BarDatasetBuilder BorderRadius(int radius) { _dataset.BorderRadius = radius; return this; }
    public BarDatasetBuilder BorderRadius(Action<BorderRadiusBuilder> action)
    {
        _dataset.BorderRadius = new BorderRadius();
        action(new BorderRadiusBuilder((BorderRadius)_dataset.BorderRadius));
        return this;
    }
    public BarDatasetBuilder CategoryPercentage(double percentage) { _dataset.CategoryPercentage = percentage; return this; }
    public BarDatasetBuilder Grouped(bool grouped) { _dataset.Grouped = grouped; return this; }
    public BarDatasetBuilder HoverBorderRadius(int radius) { _dataset.HoverBorderRadius = radius; return this; }
    public BarDatasetBuilder IndexAxis(IndexAxis axis) { _dataset.IndexAxis = axis; return this; }
    public BarDatasetBuilder Order(int order) { _dataset.Order = order; return this; }
    public BarDatasetBuilder PointStyle(bool enabled) { _dataset.PointStyle = enabled; return this; }
    public BarDatasetBuilder PointStyle(PointStyle pointStyle) { _dataset.PointStyle = pointStyle; return this; }
    public BarDatasetBuilder SkipNull(bool skipNull) { _dataset.SkipNull = skipNull; return this; }
    public BarDatasetBuilder Stack(string stack) { _dataset.Stack = stack; return this; }
    public BarDatasetBuilder XAxisID(string axisID) { _dataset.XAxisID = axisID; return this; }
    public BarDatasetBuilder YAxisID(string axisID) { _dataset.YAxisID = axisID; return this; }
}

public class BubbleDatasetBuilder : BaseDatasetBuilder<BubbleDatasetBuilder>
{
    private readonly BubbleDataset _dataset;

    internal BubbleDatasetBuilder(BubbleDataset dataset) : base(dataset)
    {
        _dataset = dataset;
    }

    public BubbleDatasetBuilder Data(IList<object> data) { _dataset.Data = data; return this; }
    public BubbleDatasetBuilder DrawActiveElementsOnTop(bool drawActiveElementsOnTop) { _dataset.DrawActiveElementsOnTop = drawActiveElementsOnTop; return this; }
    public BubbleDatasetBuilder HoverRadius(int radius) { _dataset.HoverRadius = radius; return this; }
    public BubbleDatasetBuilder HitRadius(int radius) { _dataset.HitRadius = radius; return this; }
    public BubbleDatasetBuilder Order(int order) { _dataset.Order = order; return this; }
    public BubbleDatasetBuilder PointStyle(PointStyle style) { _dataset.PointStyle = style; return this; }
    public BubbleDatasetBuilder PointStyle(bool enabled) { _dataset.PointStyle = enabled; return this; }
    public BubbleDatasetBuilder Rotation(int rotation) { _dataset.Rotation = rotation; return this; }
    public BubbleDatasetBuilder Radius(int radius) { _dataset.Radius = radius; return this; }
}

public class DoughnutPieDatasetBuilder : ArcDatasetBuilder<DoughnutPieDatasetBuilder>
{
    private readonly DoughnutPieDataset _dataset;

    internal DoughnutPieDatasetBuilder(DoughnutPieDataset dataset) : base(dataset)
    {
        _dataset = dataset;
    }

    public DoughnutPieDatasetBuilder Circumference(int circumference) { _dataset.Circumference = circumference; return this; }
    public DoughnutPieDatasetBuilder HoverOffset(int offset) { _dataset.HoverOffset = offset; return this; }
    public DoughnutPieDatasetBuilder Offset(int offset) { _dataset.Offset = offset; return this; }
    public DoughnutPieDatasetBuilder Offset(params int[] offset) { _dataset.Offset = offset; return this; }
    public DoughnutPieDatasetBuilder Rotation(int rotation) { _dataset.Rotation = rotation; return this; }
    public DoughnutPieDatasetBuilder Spacing(int spacing) { _dataset.Spacing = spacing; return this; }
    public DoughnutPieDatasetBuilder Weight(int weight) { _dataset.Weight = weight; return this; }
}

public class LineDatasetBuilder : PointDatasetBuilder<LineDatasetBuilder>
{
    private readonly LineDataset _dataset;

    internal LineDatasetBuilder(LineDataset lineDataset) : base(lineDataset)
    {
        _dataset = lineDataset;
    }

    public LineDatasetBuilder Data(object data) { _dataset.Data = data; return this; }
    public LineDatasetBuilder Data(IList<object> data) { _dataset.Data = data; return this; }
    public LineDatasetBuilder Data(params double[] data) { _dataset.Data = data; return this; }
    public LineDatasetBuilder Data(params string[] data) { _dataset.Data = data; return this; }
    public LineDatasetBuilder CubicInterpolationMode(InterpolationMode cubicInterpolationMode) { _dataset.CubicInterpolationMode = cubicInterpolationMode; return this; }
    public LineDatasetBuilder DrawActiveElementsOnTop(bool drawActiveElementsOnTop) { _dataset.DrawActiveElementsOnTop = drawActiveElementsOnTop; return this; }
    public LineDatasetBuilder IndexAxis(IndexAxis indexAxis) { _dataset.IndexAxis = indexAxis; return this; }
    public LineDatasetBuilder Segment(string segment) { _dataset.Segment = segment; return this; }
    public LineDatasetBuilder ShowLine(bool showLine) { _dataset.ShowLine = showLine; return this; }
    public LineDatasetBuilder Stack(string stack) { _dataset.Stack = stack; return this; }
    public LineDatasetBuilder Stepped(bool stepped) { _dataset.Stepped = stepped; return this; }
    public LineDatasetBuilder Stepped(string stepped) { _dataset.Stepped = stepped; return this; }
    public LineDatasetBuilder XAxisID(string xAxisID) { _dataset.XAxisID = xAxisID; return this; }
    public LineDatasetBuilder YAxisID(string yAxisID) { _dataset.YAxisID = yAxisID; return this; }
}

public class PolarAreaDatasetBuilder : ArcDatasetBuilder<PolarAreaDatasetBuilder>
{
    private readonly PolarAreaDataset _dataset;

    internal PolarAreaDatasetBuilder(PolarAreaDataset dataset) : base(dataset)
    {
        _dataset = dataset;
    }

    public PolarAreaDatasetBuilder Circular(bool circular) { _dataset.Circular = circular; return this; }
}

public class RadarDatasetBuilder : PointDatasetBuilder<RadarDatasetBuilder>
{
    private readonly RadarDataset _radarDataset;

    internal RadarDatasetBuilder(RadarDataset radarDataset) : base(radarDataset)
    {
        _radarDataset = radarDataset;
    }

    public RadarDatasetBuilder Data(params double[] data) { _radarDataset.Data = data; return this; }
}
