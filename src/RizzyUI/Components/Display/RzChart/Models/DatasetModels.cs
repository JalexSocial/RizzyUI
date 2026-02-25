using System.Text.Json.Serialization;

namespace RizzyUI.Charts;

/// <summary>
/// Base class for all dataset types, containing common visual and functional configuration.
/// </summary>
[JsonConverter(typeof(ChartJsBaseDatasetConverter))]
public class BaseDataset
{
    /// <summary> The actual data values for the dataset. </summary>
    public object? Data { get; set; }
    /// <summary> The label for the dataset which appears in the legend and tooltips. </summary>
    public string? Label { get; set; }
    /// <summary> The chart type for this specific dataset (allows mixed charts). </summary>
    public string? Type { get; set; }
    /// <summary> Fill color(s). Can be a single color string or an array of strings. </summary>
    public object? BackgroundColor { get; set; }
    /// <summary> Border color(s). Can be a single color string or an array of strings. </summary>
    public object? BorderColor { get; set; }
    /// <summary> The width of the border around elements in pixels. </summary>
    public int? BorderWidth { get; set; }
    /// <summary> How to clip the dataset drawing against the chart area. </summary>
    public object? Clip { get; set; }
    /// <summary> Background color when the element is hovered. </summary>
    public object? HoverBackgroundColor { get; set; }
    /// <summary> Border color when the element is hovered. </summary>
    public object? HoverBorderColor { get; set; }
    /// <summary> Border width when the element is hovered. </summary>
    public int? HoverBorderWidth { get; set; }
    /// <summary> Configuration for data parsing. </summary>
    public object? Parsing { get; set; }
    /// <summary> Configures the initial visibility of the dataset. </summary>
    public bool? Hidden { get; set; }
}

/// <summary>
/// Represents a dataset used for arc-based charts (Doughnut, Pie, Polar Area).
/// </summary>
public class ArcDataset : BaseDataset
{
    /// <summary> Border alignment ('center' or 'inner'). </summary>
    public BorderAlign? BorderAlign { get; set; }
    /// <summary> Dash pattern for the arc border. </summary>
    public int[]? BorderDash { get; set; }
    /// <summary> Offset for line dashes. </summary>
    public double? BorderDashOffset { get; set; }
    /// <summary> Join style for arc borders. </summary>
    public JoinStyle? BorderJoinStyle { get; set; }
    /// <summary> Dash pattern for the border on hover. </summary>
    public int[]? HoverBorderDash { get; set; }
    /// <summary> Offset for line dashes on hover. </summary>
    public double? HoverBorderDashOffset { get; set; }
    /// <summary> Join style on hover. </summary>
    public JoinStyle? HoverBorderJoinStyle { get; set; }
    /// <summary> The numeric data points for the arcs. </summary>
    public new int[]? Data { get; set; }
}

/// <summary>
/// Represents a dataset used for Bar charts.
/// </summary>
public class BarDataset : BaseDataset
{
    /// <summary> Base value for the bar in data units along the value axis. </summary>
    public int? Base { get; set; }
    /// <summary> Percent (0-1) of the available width each bar should be within the category width. </summary>
    public double? BarPercentage { get; set; }
    /// <summary> Width of each bar in pixels. Can be a number or 'flex'. </summary>
    public object? BarThickness { get; set; }
    /// <summary> Defines which edge to skip when drawing bar border. </summary>
    public object? BorderSkipped { get; set; }
    /// <summary> Border width. Can be a number or an object for per-side width. </summary>
    public new object? BorderWidth { get; set; }
    /// <summary> Border radius. Can be a number or an object for per-corner radius. </summary>
    public object? BorderRadius { get; set; }
    /// <summary> Percent (0-1) of the available width each category should be within the sample width. </summary>
    public double? CategoryPercentage { get; set; }
    /// <summary> Should the bars be grouped on the index axis. </summary>
    public bool? Grouped { get; set; }
    /// <summary> Border radius when hovered. </summary>
    public int? HoverBorderRadius { get; set; }
    /// <summary> Base axis of the dataset ('x' or 'y'). </summary>
    public IndexAxis? IndexAxis { get; set; }
    /// <summary> Drawing order. </summary>
    public int? Order { get; set; }
    /// <summary> Style of the point for legend representation. </summary>
    public object? PointStyle { get; set; }
    /// <summary> If true, null values will not be used for spacing calculations. </summary>
    public bool? SkipNull { get; set; }
    /// <summary> ID of the stack group this dataset belongs to. </summary>
    public string? Stack { get; set; }
    /// <summary> ID of the X-axis to plot on. </summary>
    public string? XAxisID { get; set; }
    /// <summary> ID of the Y-axis to plot on. </summary>
    public string? YAxisID { get; set; }
}

/// <summary>
/// Represents a dataset used for Bubble charts.
/// </summary>
public class BubbleDataset : BaseDataset
{
    /// <summary> Draw active bubbles over the other bubbles of the dataset. </summary>
    public bool? DrawActiveElementsOnTop { get; set; }
    /// <summary> Additional radius when hovered. </summary>
    public int? HoverRadius { get; set; }
    /// <summary> Additional radius for hit detection. </summary>
    public int? HitRadius { get; set; }
    /// <summary> Drawing order. </summary>
    public int? Order { get; set; }
    /// <summary> Bubble shape style. </summary>
    public object? PointStyle { get; set; }
    /// <summary> Bubble rotation in degrees. </summary>
    public int? Rotation { get; set; }
    /// <summary> Bubble radius in pixels (not scaled). </summary>
    public int? Radius { get; set; }
}

/// <summary>
/// Dataset for Doughnut and Pie charts.
/// </summary>
public class DoughnutPieDataset : ArcDataset
{
    /// <summary> Total sweep angle in degrees. </summary>
    public int? Circumference { get; set; }
    /// <summary> Arc offset when hovered. </summary>
    public int? HoverOffset { get; set; }
    /// <summary> Arc offset. Can be a number or an array. </summary>
    public object? Offset { get; set; }
    /// <summary> Starting angle in degrees. </summary>
    public int? Rotation { get; set; }
    /// <summary> Fixed spacing between arcs. </summary>
    public int? Spacing { get; set; }
    /// <summary> Relative thickness of the dataset. </summary>
    public int? Weight { get; set; }
}

/// <summary>
/// Base class for datasets that render points (Line, Radar, Scatter).
/// </summary>
public class PointDataset : BaseDataset
{
    /// <summary> Line cap style ('butt', 'round', 'square'). </summary>
    public CapStyle? BorderCapStyle { get; set; }
    /// <summary> Line dash pattern. </summary>
    public int[]? BorderDash { get; set; }
    /// <summary> Line dash offset. </summary>
    public double? BorderDashOffset { get; set; }
    /// <summary> Line join style. </summary>
    public JoinStyle? BorderJoinStyle { get; set; }
    /// <summary> Hover cap style. </summary>
    public CapStyle? HoverBorderCapStyle { get; set; }
    /// <summary> Hover dash pattern. </summary>
    public int[]? HoverBorderDash { get; set; }
    /// <summary> Hover dash offset. </summary>
    public double? HoverBorderDashOffset { get; set; }
    /// <summary> Hover join style. </summary>
    public JoinStyle? HoverBorderJoinStyle { get; set; }
    /// <summary> How to fill the area under the line. </summary>
    public object? Fill { get; set; }
    /// <summary> Drawing order. </summary>
    public int? Order { get; set; }
    /// <summary> Bezier curve tension (0 for straight lines). </summary>
    public double? Tension { get; set; }
    /// <summary> Point fill color. </summary>
    public string? PointBackgroundColor { get; set; }
    /// <summary> Point border color. </summary>
    public string? PointBorderColor { get; set; }
    /// <summary> Point border width. </summary>
    public int? PointBorderWidth { get; set; }
    /// <summary> Point hit detection radius. </summary>
    public int? PointHitRadius { get; set; }
    /// <summary> Point hover background color. </summary>
    public string? PointHoverBackgroundColor { get; set; }
    /// <summary> Point hover border color. </summary>
    public string? PointHoverBorderColor { get; set; }
    /// <summary> Point hover border width. </summary>
    public int? PointHoverBorderWidth { get; set; }
    /// <summary> Point hover radius. </summary>
    public int? PointHoverRadius { get; set; }
    /// <summary> Point marker radius. </summary>
    public int? PointRadius { get; set; }
    /// <summary> Point marker rotation in degrees. </summary>
    public int? PointRotation { get; set; }
    /// <summary> Point shape style. </summary>
    public object? PointStyle { get; set; }
    /// <summary> If true, lines are drawn between null data points. </summary>
    public bool? SpanGaps { get; set; }
}

/// <summary>
/// Represents a Line chart dataset.
/// </summary>
public class LineDataset : PointDataset
{
    /// <summary> Interpolation algorithm ('default', 'monotone'). </summary>
    public InterpolationMode? CubicInterpolationMode { get; set; }
    /// <summary> Draw active points on top. </summary>
    public bool? DrawActiveElementsOnTop { get; set; }
    /// <summary> Base axis ('x' or 'y'). </summary>
    public IndexAxis? IndexAxis { get; set; }
    /// <summary> Scriptable line segment styling. </summary>
    public string? Segment { get; set; }
    /// <summary> If false, no line is drawn between points. </summary>
    public bool? ShowLine { get; set; }
    /// <summary> ID of the stack group. </summary>
    public string? Stack { get; set; }
    /// <summary> Enables stepped interpolation. </summary>
    public object? Stepped { get; set; }
    /// <summary> ID of the X-axis. </summary>
    public string? XAxisID { get; set; }
    /// <summary> ID of the Y-axis. </summary>
    public string? YAxisID { get; set; }
}

/// <summary>
/// Represents a Polar Area dataset.
/// </summary>
public class PolarAreaDataset : ArcDataset
{
    /// <summary> If true, arc is curved. If false, arc is flat. </summary>
    public bool? Circular { get; set; }
}

/// <summary>
/// Represents a Radar chart dataset.
/// </summary>
public class RadarDataset : PointDataset
{
    /// <summary> The numeric data points. </summary>
    public new double[]? Data { get; set; }
}