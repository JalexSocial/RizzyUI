
namespace RizzyUI.Charts;

/// <summary>
/// Base class for all dataset builders, providing common properties like labels and colors.
/// </summary>
public abstract class BaseDatasetBuilder<T> where T : BaseDatasetBuilder<T>
{
    private readonly BaseDataset _dataset;

    internal BaseDatasetBuilder(BaseDataset baseDataset)
    {
        _dataset = baseDataset;
    }

    /// <summary>
    /// Sets the label for the dataset which appears in the legend and tooltips.
    /// </summary>
    public T Label(string label) { _dataset.Label = label; return (T)this; }

    /// <summary>
    /// Sets the fill color for the dataset elements (bars, arcs, areas).
    /// </summary>
    public T BackgroundColor(string color) { _dataset.BackgroundColor = color; return (T)this; }

    /// <summary>
    /// Sets the fill color for the dataset elements using a <see cref="Color"/> token.
    /// </summary>
    public T BackgroundColor(Color color) { _dataset.BackgroundColor = color.ToCssColorString(); return (T)this; }

    /// <summary>
    /// Sets an array of background colors, allowing per-element coloring (e.g. each bar in a bar chart).
    /// </summary>
    public T BackgroundColors(params string[] colors) { _dataset.BackgroundColor = colors; return (T)this; }

    /// <summary>
    /// Sets an array of background colors using <see cref="Color"/> tokens.
    /// </summary>
    public T BackgroundColors(params Color[] colors) { _dataset.BackgroundColor = colors.Select(c => c.ToCssColorString()).ToArray(); return (T)this; }

    /// <summary>
    /// Sets the color of the border around dataset elements.
    /// </summary>
    public T BorderColor(string color) { _dataset.BorderColor = color; return (T)this; }

    /// <summary>
    /// Sets the color of the border using a <see cref="Color"/> token.
    /// </summary>
    public T BorderColor(Color color) { _dataset.BorderColor = color.ToCssColorString(); return (T)this; }

    /// <summary>
    /// Sets an array of border colors for per-element styling.
    /// </summary>
    public T BorderColors(params string[] colors) { _dataset.BorderColor = colors; return (T)this; }

    /// <summary>
    /// Sets an array of border colors using <see cref="Color"/> tokens.
    /// </summary>
    public T BorderColors(params Color[] colors) { _dataset.BorderColor = colors.Select(c => c.ToCssColorString()).ToArray(); return (T)this; }

    /// <summary>
    /// Sets the width of the border in pixels.
    /// </summary>
    public T BorderWidth(int width) { _dataset.BorderWidth = width; return (T)this; }

    /// <summary>
    /// Sets how the dataset is clipped relative to the chart area.
    /// </summary>
    public T Clip(int clip) { _dataset.Clip = clip; return (T)this; }

    /// <summary>
    /// Configures clipping per-side (left, top, right, bottom).
    /// </summary>
    public T Clip(Action<ClipBuilder> action)
    {
        _dataset.Clip = new Clip();
        action(new ClipBuilder((Clip)_dataset.Clip));
        return (T)this;
    }

    /// <summary>
    /// Enables or disables clipping for the dataset.
    /// </summary>
    public T Clip(bool enabled) { _dataset.Clip = enabled; return (T)this; }

    /// <summary>
    /// Sets the background color of elements when they are hovered.
    /// </summary>
    public T HoverBackgroundColor(string color) { _dataset.HoverBackgroundColor = color; return (T)this; }

    /// <summary>
    /// Sets the hover background color using a <see cref="Color"/> token.
    /// </summary>
    public T HoverBackgroundColor(Color color) { _dataset.HoverBackgroundColor = color.ToCssColorString(); return (T)this; }

    /// <summary>
    /// Sets an array of background colors for hover states.
    /// </summary>
    public T HoverBackgroundColors(params string[] colors) { _dataset.HoverBackgroundColor = colors; return (T)this; }

    /// <summary>
    /// Sets an array of hover background colors using <see cref="Color"/> tokens.
    /// </summary>
    public T HoverBackgroundColors(params Color[] colors) { _dataset.HoverBackgroundColor = colors.Select(c => c.ToCssColorString()).ToArray(); return (T)this; }

    /// <summary>
    /// Sets the border color of elements when they are hovered.
    /// </summary>
    public T HoverBorderColor(string color) { _dataset.HoverBorderColor = color; return (T)this; }

    /// <summary>
    /// Sets the hover border color using a <see cref="Color"/> token.
    /// </summary>
    public T HoverBorderColor(Color color) { _dataset.HoverBorderColor = color.ToCssColorString(); return (T)this; }

    /// <summary>
    /// Sets an array of border colors for hover states.
    /// </summary>
    public T HoverBorderColors(params string[] colors) { _dataset.HoverBorderColor = colors; return (T)this; }

    /// <summary>
    /// Sets an array of hover border colors using <see cref="Color"/> tokens.
    /// </summary>
    public T HoverBorderColors(params Color[] colors) { _dataset.HoverBorderColor = colors.Select(c => c.ToCssColorString()).ToArray(); return (T)this; }

    /// <summary>
    /// Sets the width of the border when elements are hovered.
    /// </summary>
    public T HoverBorderWidth(int width) { _dataset.HoverBorderWidth = width; return (T)this; }

    /// <summary>
    /// Controls whether automatic data parsing is enabled.
    /// </summary>
    public T Parsing(bool enabled) { _dataset.Parsing = enabled; return (T)this; }

    /// <summary>
    /// Sets the data key used for parsing complex objects.
    /// </summary>
    public T Parsing(string key) { _dataset.Parsing = new Parsing { Key = key }; return (T)this; }

    /// <summary>
    /// Sets specific keys for X and Y axis parsing.
    /// </summary>
    public T Parsing(string xAxisKey, string yAxisKey) { _dataset.Parsing = new Parsing { XAxisKey = xAxisKey, YAxisKey = yAxisKey }; return (T)this; }

    /// <summary>
    /// Configures the initial visibility of the dataset.
    /// </summary>
    public T Hidden(bool hidden) { _dataset.Hidden = hidden; return (T)this; }
}

/// <summary>
/// Base builder for datasets that use points (Line, Radar, Scatter, Bubble).
/// </summary>
public abstract class PointDatasetBuilder<T> : BaseDatasetBuilder<T> where T : PointDatasetBuilder<T>
{
    private readonly PointDataset _dataset;

    internal PointDatasetBuilder(PointDataset dataset) : base(dataset)
    {
        _dataset = dataset;
    }

    /// <summary>
    /// Sets the cap style of the line.
    /// </summary>
    public T BorderCapStyle(CapStyle capStyle) { _dataset.BorderCapStyle = capStyle; return (T)this; }

    /// <summary>
    /// Sets the dash pattern for the line border.
    /// </summary>
    public T BorderDash(params int[] borderDash) { _dataset.BorderDash = borderDash; return (T)this; }

    /// <summary>
    /// Sets the offset for the line dash pattern.
    /// </summary>
    public T BorderDashOffset(double borderDashOffset) { _dataset.BorderDashOffset = borderDashOffset; return (T)this; }

    /// <summary>
    /// Sets the join style of the line.
    /// </summary>
    public T BorderJoinStyle(JoinStyle borderJoinStyle) { _dataset.BorderJoinStyle = borderJoinStyle; return (T)this; }

    /// <summary>
    /// Sets the hover cap style.
    /// </summary>
    public T HoverBorderCapStyle(CapStyle capStyle) { _dataset.HoverBorderCapStyle = capStyle; return (T)this; }

    /// <summary>
    /// Sets the hover dash pattern.
    /// </summary>
    public T HoverBorderDash(params int[] hoverBorderDash) { _dataset.HoverBorderDash = hoverBorderDash; return (T)this; }

    /// <summary>
    /// Sets the hover dash offset.
    /// </summary>
    public T HoverBorderDashOffset(double hoverBorderDashOffset) { _dataset.HoverBorderDashOffset = hoverBorderDashOffset; return (T)this; }

    /// <summary>
    /// Sets the hover join style.
    /// </summary>
    public T HoverBorderJoinStyle(JoinStyle hoverBorderJoinStyle) { _dataset.HoverBorderJoinStyle = hoverBorderJoinStyle; return (T)this; }

    /// <summary>
    /// Determines whether the area under the line is filled.
    /// </summary>
    public T Fill(bool fill) { _dataset.Fill = fill; return (T)this; }

    /// <summary>
    /// Sets a named fill boundary (e.g. "origin", "start", "end").
    /// </summary>
    public T Fill(string fill) { _dataset.Fill = fill; return (T)this; }

    /// <summary>
    /// Configures advanced filling options like target and color.
    /// </summary>
    public T Fill(Action<FillBuilder> action)
    {
        _dataset.Fill = new Fill();
        action(new FillBuilder((Fill)_dataset.Fill));
        return (T)this;
    }

    /// <summary>
    /// Sets the drawing order of the dataset. Lower numbers are drawn on top.
    /// </summary>
    public T Order(int order) { _dataset.Order = order; return (T)this; }

    /// <summary>
    /// Sets the background color of the point markers.
    /// </summary>
    public T PointBackgroundColor(string color) { _dataset.PointBackgroundColor = color; return (T)this; }

    /// <summary>
    /// Sets the point background color using a <see cref="Color"/> token.
    /// </summary>
    public T PointBackgroundColor(Color color) { _dataset.PointBackgroundColor = color.ToCssColorString(); return (T)this; }

    /// <summary>
    /// Sets the border color of the point markers.
    /// </summary>
    public T PointBorderColor(string color) { _dataset.PointBorderColor = color; return (T)this; }

    /// <summary>
    /// Sets the point border color using a <see cref="Color"/> token.
    /// </summary>
    public T PointBorderColor(Color color) { _dataset.PointBorderColor = color.ToCssColorString(); return (T)this; }

    /// <summary>
    /// Sets the width of the point marker border.
    /// </summary>
    public T PointBorderWidth(int width) { _dataset.PointBorderWidth = width; return (T)this; }

    /// <summary>
    /// Sets the radius of the point hit detection area.
    /// </summary>
    public T PointHitRadius(int radius) { _dataset.PointHitRadius = radius; return (T)this; }

    /// <summary>
    /// Sets the point background color on hover.
    /// </summary>
    public T PointHoverBackgroundColor(string color) { _dataset.PointHoverBackgroundColor = color; return (T)this; }

    /// <summary>
    /// Sets the point hover background color using a <see cref="Color"/> token.
    /// </summary>
    public T PointHoverBackgroundColor(Color color) { _dataset.PointHoverBackgroundColor = color.ToCssColorString(); return (T)this; }

    /// <summary>
    /// Sets the point border color on hover.
    /// </summary>
    public T PointHoverBorderColor(string color) { _dataset.PointHoverBorderColor = color; return (T)this; }

    /// <summary>
    /// Sets the point hover border color using a <see cref="Color"/> token.
    /// </summary>
    public T PointHoverBorderColor(Color color) { _dataset.PointHoverBorderColor = color.ToCssColorString(); return (T)this; }

    /// <summary>
    /// Sets the width of the point border on hover.
    /// </summary>
    public T PointHoverBorderWidth(int width) { _dataset.PointHoverBorderWidth = width; return (T)this; }

    /// <summary>
    /// Sets the radius of the point marker on hover.
    /// </summary>
    public T PointHoverRadius(int radius) { _dataset.PointHoverRadius = radius; return (T)this; }

    /// <summary>
    /// Sets the radius of the point markers.
    /// </summary>
    public T PointRadius(int radius) { _dataset.PointRadius = radius; return (T)this; }

    /// <summary>
    /// Sets the rotation of the point marker in degrees.
    /// </summary>
    public T PointRotation(int rotation) { _dataset.PointRotation = rotation; return (T)this; }

    /// <summary>
    /// Enables or disables point styling.
    /// </summary>
    public T PointStyle(bool enabled) { _dataset.PointStyle = enabled; return (T)this; }

    /// <summary>
    /// Sets the shape style of the point markers (e.g. circle, rect, star).
    /// </summary>
    public T PointStyle(PointStyle pointStyle) { _dataset.PointStyle = pointStyle; return (T)this; }

    /// <summary>
    /// If true, lines will be drawn between points with no or null data.
    /// </summary>
    public T SpanGaps(bool spanGaps) { _dataset.SpanGaps = spanGaps; return (T)this; }

    /// <summary>
    /// Sets the Bezier curve tension of the line. Set to 0 for straight lines.
    /// </summary>
    public T Tension(double tension) { _dataset.Tension = tension; return (T)this; }
}

/// <summary>
/// Base builder for datasets that use arcs (Doughnut, Pie, PolarArea).
/// </summary>
public abstract class ArcDatasetBuilder<T> : BaseDatasetBuilder<T> where T : ArcDatasetBuilder<T>
{
    private readonly ArcDataset _dataset;

    internal ArcDatasetBuilder(ArcDataset dataset) : base(dataset)
    {
        _dataset = dataset;
    }

    /// <summary>
    /// Sets the border alignment for the arc (center or inner).
    /// </summary>
    public T BorderAlign(BorderAlign borderAlign) { _dataset.BorderAlign = borderAlign; return (T)this; }

    /// <summary>
    /// Sets the dash pattern for the arc border.
    /// </summary>
    public T BorderDash(params int[] dashes) { _dataset.BorderDash = dashes; return (T)this; }

    /// <summary>
    /// Sets the dash offset for the arc border.
    /// </summary>
    public T BorderDashOffset(double dashOffset) { _dataset.BorderDashOffset = dashOffset; return (T)this; }

    /// <summary>
    /// Sets the join style for the arc border.
    /// </summary>
    public T BorderJoinStyle(JoinStyle joinStyle) { _dataset.BorderJoinStyle = joinStyle; return (T)this; }

    /// <summary>
    /// Sets the numerical data for the arcs.
    /// </summary>
    public T Data(params int[] data) { _dataset.Data = data; return (T)this; }

    /// <summary>
    /// Sets the hover dash pattern.
    /// </summary>
    public T HoverBorderDash(params int[] dashes) { _dataset.HoverBorderDash = dashes; return (T)this; }

    /// <summary>
    /// Sets the hover dash offset.
    /// </summary>
    public T HoverBorderDashOffset(double dashOffset) { _dataset.HoverBorderDashOffset = dashOffset; return (T)this; }

    /// <summary>
    /// Sets the hover join style.
    /// </summary>
    public T HoverBorderJoinStyle(JoinStyle joinStyle) { _dataset.HoverBorderJoinStyle = joinStyle; return (T)this; }
}

/// <summary>
/// Builder for Bar datasets.
/// </summary>
public class BarDatasetBuilder : BaseDatasetBuilder<BarDatasetBuilder>
{
    private readonly BarDataset _dataset;

    internal BarDatasetBuilder(BarDataset baseDataset) : base(baseDataset)
    {
        _dataset = baseDataset;
    }

    /// <summary>
    /// Sets the data for the bars. Supports simple values or range arrays for floating bars.
    /// </summary>
    public BarDatasetBuilder Data(object data) { _dataset.Data = data; return this; }

    /// <summary>
    /// Sets the data for the bars using a list of objects.
    /// </summary>
    public BarDatasetBuilder Data(IList<object> data) { _dataset.Data = data; return this; }

    /// <summary>
    /// Sets the data for the bars using a list of doubles.
    /// </summary>
    public BarDatasetBuilder Data(params double[] data) { _dataset.Data = data; return this; }

    /// <summary>
    /// Sets the data for the bars using a list of strings.
    /// </summary>
    public BarDatasetBuilder Data(params string[] data) { _dataset.Data = data; return this; }

    /// <summary>
    /// Sets the base value for the bar in data units.
    /// </summary>
    public BarDatasetBuilder Base(int value) { _dataset.Base = value; return this; }

    /// <summary>
    /// Percent (0-1) of the available width each bar should be within the category width.
    /// </summary>
    public BarDatasetBuilder BarPercentage(double percentage) { _dataset.BarPercentage = percentage; return this; }

    /// <summary>
    /// Manually sets the thickness of each bar in pixels. If not set, it is calculated automatically.
    /// </summary>
    public BarDatasetBuilder BarThickness(int thickness) { _dataset.BarThickness = thickness; return this; }

    /// <summary>
    /// Sets bar thickness to a special value like "flex".
    /// </summary>
    public BarDatasetBuilder BarThickness(string thickness) { _dataset.BarThickness = thickness; return this; }

    /// <summary>
    /// Defines which edge to skip when drawing the bar border.
    /// </summary>
    public BarDatasetBuilder BorderSkipped(Skipped skipped) { _dataset.BorderSkipped = skipped; return this; }

    /// <summary>
    /// Skips all or no borders.
    /// </summary>
    public BarDatasetBuilder BorderSkipped(bool skipped) { _dataset.BorderSkipped = skipped; return this; }

    /// <summary>
    /// Sets the width of the bar border in pixels.
    /// </summary>
    public new BarDatasetBuilder BorderWidth(int width) { _dataset.BorderWidth = width; return this; }

    /// <summary>
    /// Configures per-side border widths.
    /// </summary>
    public BarDatasetBuilder BorderWidth(Action<BorderWidthBuilder> action)
    {
        _dataset.BorderWidth = new BorderWidth();
        action(new BorderWidthBuilder((BorderWidth)_dataset.BorderWidth));
        return this;
    }

    /// <summary>
    /// Sets the corner radius of the bars in pixels.
    /// </summary>
    public BarDatasetBuilder BorderRadius(int radius) { _dataset.BorderRadius = radius; return this; }

    /// <summary>
    /// Configures per-corner border radii.
    /// </summary>
    public BarDatasetBuilder BorderRadius(Action<BorderRadiusBuilder> action)
    {
        _dataset.BorderRadius = new BorderRadius();
        action(new BorderRadiusBuilder((BorderRadius)_dataset.BorderRadius));
        return this;
    }

    /// <summary>
    /// Percent (0-1) of the available width each category should be within the sample width.
    /// </summary>
    public BarDatasetBuilder CategoryPercentage(double percentage) { _dataset.CategoryPercentage = percentage; return this; }

    /// <summary>
    /// Should the bars be grouped on the index axis.
    /// </summary>
    public BarDatasetBuilder Grouped(bool grouped) { _dataset.Grouped = grouped; return this; }

    /// <summary>
    /// Sets the corner radius of the bars when hovered.
    /// </summary>
    public BarDatasetBuilder HoverBorderRadius(int radius) { _dataset.HoverBorderRadius = radius; return this; }

    /// <summary>
    /// Sets the base axis of the dataset ('x' or 'y').
    /// </summary>
    public BarDatasetBuilder IndexAxis(IndexAxis axis) { _dataset.IndexAxis = axis; return this; }

    /// <summary>
    /// Sets the drawing order.
    /// </summary>
    public BarDatasetBuilder Order(int order) { _dataset.Order = order; return this; }

    /// <summary>
    /// Enables or disables point styling for the legend.
    /// </summary>
    public BarDatasetBuilder PointStyle(bool enabled) { _dataset.PointStyle = enabled; return this; }

    /// <summary>
    /// Sets the point style shape for the legend.
    /// </summary>
    public BarDatasetBuilder PointStyle(PointStyle pointStyle) { _dataset.PointStyle = pointStyle; return this; }

    /// <summary>
    /// If true, null values are not used for spacing calculations.
    /// </summary>
    public BarDatasetBuilder SkipNull(bool skipNull) { _dataset.SkipNull = skipNull; return this; }

    /// <summary>
    /// Assigns the dataset to a specific stack group. Datasets with the same stack ID will be stacked.
    /// </summary>
    public BarDatasetBuilder Stack(string stack) { _dataset.Stack = stack; return this; }

    /// <summary>
    /// Maps the dataset to a specific X-axis.
    /// </summary>
    public BarDatasetBuilder XAxisID(string axisID) { _dataset.XAxisID = axisID; return this; }

    /// <summary>
    /// Maps the dataset to a specific Y-axis.
    /// </summary>
    public BarDatasetBuilder YAxisID(string axisID) { _dataset.YAxisID = axisID; return this; }
}

/// <summary>
/// Builder for Bubble datasets.
/// </summary>
public class BubbleDatasetBuilder : BaseDatasetBuilder<BubbleDatasetBuilder>
{
    private readonly BubbleDataset _dataset;

    internal BubbleDatasetBuilder(BubbleDataset dataset) : base(dataset)
    {
        _dataset = dataset;
    }

    /// <summary>
    /// Sets the data points for the bubble chart. Each point must define x, y, and r (radius).
    /// </summary>
    public BubbleDatasetBuilder Data(IList<object> data) { _dataset.Data = data; return this; }

    /// <summary>
    /// Controls whether active bubbles are drawn on top of others.
    /// </summary>
    public BubbleDatasetBuilder DrawActiveElementsOnTop(bool drawActiveElementsOnTop) { _dataset.DrawActiveElementsOnTop = drawActiveElementsOnTop; return this; }

    /// <summary>
    /// Sets the radius of the bubble when hovered.
    /// </summary>
    public BubbleDatasetBuilder HoverRadius(int radius) { _dataset.HoverRadius = radius; return this; }

    /// <summary>
    /// Sets the hit detection radius.
    /// </summary>
    public BubbleDatasetBuilder HitRadius(int radius) { _dataset.HitRadius = radius; return this; }

    /// <summary>
    /// Sets the drawing order.
    /// </summary>
    public BubbleDatasetBuilder Order(int order) { _dataset.Order = order; return this; }

    /// <summary>
    /// Sets the shape of the bubble markers.
    /// </summary>
    public BubbleDatasetBuilder PointStyle(PointStyle style) { _dataset.PointStyle = style; return this; }

    /// <summary>
    /// Enables or disables point styling.
    /// </summary>
    public BubbleDatasetBuilder PointStyle(bool enabled) { _dataset.PointStyle = enabled; return this; }

    /// <summary>
    /// Sets the rotation of the bubble shapes in degrees.
    /// </summary>
    public BubbleDatasetBuilder Rotation(int rotation) { _dataset.Rotation = rotation; return this; }

    /// <summary>
    /// Sets the default radius for all bubbles in the dataset.
    /// </summary>
    public BubbleDatasetBuilder Radius(int radius) { _dataset.Radius = radius; return this; }
}

/// <summary>
/// Builder for Doughnut and Pie datasets.
/// </summary>
public class DoughnutPieDatasetBuilder : ArcDatasetBuilder<DoughnutPieDatasetBuilder>
{
    private readonly DoughnutPieDataset _dataset;

    internal DoughnutPieDatasetBuilder(DoughnutPieDataset dataset) : base(dataset)
    {
        _dataset = dataset;
    }

    /// <summary>
    /// Sets the total sweep angle of the chart in degrees (e.g. 180 for a semi-circle).
    /// </summary>
    public DoughnutPieDatasetBuilder Circumference(int circumference) { _dataset.Circumference = circumference; return this; }

    /// <summary>
    /// Sets the offset of the arcs when hovered in pixels.
    /// </summary>
    public DoughnutPieDatasetBuilder HoverOffset(int offset) { _dataset.HoverOffset = offset; return this; }

    /// <summary>
    /// Sets the offset of the arcs in pixels.
    /// </summary>
    public DoughnutPieDatasetBuilder Offset(int offset) { _dataset.Offset = offset; return this; }

    /// <summary>
    /// Sets per-arc offsets using an array.
    /// </summary>
    public DoughnutPieDatasetBuilder Offset(params int[] offset) { _dataset.Offset = offset; return this; }

    /// <summary>
    /// Sets the starting angle of the first segment in degrees. 0 is at the top.
    /// </summary>
    public DoughnutPieDatasetBuilder Rotation(int rotation) { _dataset.Rotation = rotation; return this; }

    /// <summary>
    /// Sets the fixed spacing between arcs in pixels.
    /// </summary>
    public DoughnutPieDatasetBuilder spacing(int spacing) { _dataset.Spacing = spacing; return this; }

    /// <summary>
    /// Sets the relative thickness of the dataset.
    /// </summary>
    public DoughnutPieDatasetBuilder Weight(int weight) { _dataset.Weight = weight; return this; }
}

/// <summary>
/// Builder for Line datasets.
/// </summary>
public class LineDatasetBuilder : PointDatasetBuilder<LineDatasetBuilder>
{
    private readonly LineDataset _dataset;

    internal LineDatasetBuilder(LineDataset lineDataset) : base(lineDataset)
    {
        _dataset = lineDataset;
    }

    /// <summary>
    /// Sets the data points for the line. Supports primitives or objects.
    /// </summary>
    public LineDatasetBuilder Data(object data) { _dataset.Data = data; return this; }

    /// <summary>
    /// Sets the data using a list of objects.
    /// </summary>
    public LineDatasetBuilder Data(IList<object> data) { _dataset.Data = data; return this; }

    /// <summary>
    /// Sets the data using a list of doubles.
    /// </summary>
    public LineDatasetBuilder Data(params double[] data) { _dataset.Data = data; return this; }

    /// <summary>
    /// Sets the data using a list of strings.
    /// </summary>
    public LineDatasetBuilder Data(params string[] data) { _dataset.Data = data; return this; }

    /// <summary>
    /// Selects the interpolation algorithm. 'Monotone' is better for preserving monotonic trends.
    /// </summary>
    public LineDatasetBuilder CubicInterpolationMode(InterpolationMode cubicInterpolationMode) { _dataset.CubicInterpolationMode = cubicInterpolationMode; return this; }

    /// <summary>
    /// Controls whether active points are drawn on top.
    /// </summary>
    public LineDatasetBuilder DrawActiveElementsOnTop(bool drawActiveElementsOnTop) { _dataset.DrawActiveElementsOnTop = drawActiveElementsOnTop; return this; }

    /// <summary>
    /// Sets the base axis ('x' for horizontal, 'y' for vertical line charts).
    /// </summary>
    public LineDatasetBuilder IndexAxis(IndexAxis indexAxis) { _dataset.IndexAxis = indexAxis; return this; }

    /// <summary>
    /// Sets scriptable styles for different segments of the line.
    /// </summary>
    public LineDatasetBuilder Segment(string segment) { _dataset.Segment = segment; return this; }

    /// <summary>
    /// If false, the line connecting the points is not drawn.
    /// </summary>
    public LineDatasetBuilder ShowLine(bool showLine) { _dataset.ShowLine = showLine; return this; }

    /// <summary>
    /// Assigns the dataset to a specific stack group.
    /// </summary>
    public LineDatasetBuilder Stack(string stack) { _dataset.Stack = stack; return this; }

    /// <summary>
    /// Enables or disables stepped interpolation.
    /// </summary>
    public LineDatasetBuilder Stepped(bool stepped) { _dataset.Stepped = stepped; return this; }

    /// <summary>
    /// Sets the type of stepped interpolation (e.g. 'before', 'after', 'middle').
    /// </summary>
    public LineDatasetBuilder Stepped(string stepped) { _dataset.Stepped = stepped; return this; }

    /// <summary>
    /// Maps the dataset to a specific X-axis.
    /// </summary>
    public LineDatasetBuilder XAxisID(string xAxisID) { _dataset.XAxisID = xAxisID; return this; }

    /// <summary>
    /// Maps the dataset to a specific Y-axis.
    /// </summary>
    public LineDatasetBuilder YAxisID(string yAxisID) { _dataset.YAxisID = yAxisID; return this; }
}

/// <summary>
/// Builder for Polar Area datasets.
/// </summary>
public class PolarAreaDatasetBuilder : ArcDatasetBuilder<PolarAreaDatasetBuilder>
{
    private readonly PolarAreaDataset _dataset;

    internal PolarAreaDatasetBuilder(PolarAreaDataset dataset) : base(dataset)
    {
        _dataset = dataset;
    }

    /// <summary>
    /// If true, the arc is drawn as a curved segment. If false, it is drawn flat.
    /// </summary>
    public PolarAreaDatasetBuilder Circular(bool circular) { _dataset.Circular = circular; return this; }
}

/// <summary>
/// Builder for Radar datasets.
/// </summary>
public class RadarDatasetBuilder : PointDatasetBuilder<RadarDatasetBuilder>
{
    private readonly RadarDataset _radarDataset;

    internal RadarDatasetBuilder(RadarDataset radarDataset) : base(radarDataset)
    {
        _radarDataset = radarDataset;
    }

    /// <summary>
    /// Sets the numeric data points for the radar axes.
    /// </summary>
    public RadarDatasetBuilder Data(params double[] data) { _radarDataset.Data = data; return this; }
}