
namespace RizzyUI.Charts;

/// <summary>
/// Container for global default element configurations.
/// </summary>
public class Elements
{
    /// <summary> Default settings for points. </summary>
    public PointElement? Point { get; set; }
    /// <summary> Default settings for lines. </summary>
    public LineElement? Line { get; set; }
    /// <summary> Default settings for bars. </summary>
    public BarElement? Bar { get; set; }
    /// <summary> Default settings for arcs. </summary>
    public ArcElement? Arc { get; set; }
}

/// <summary>
/// Common configuration for all chart elements.
/// </summary>
public class BaseElement
{
    /// <summary> Default background color. </summary>
    public object? BackgroundColor { get; set; }
    /// <summary> Default border width. </summary>
    public int? BorderWidth { get; set; }
    /// <summary> Default border color. </summary>
    public object? BorderColor { get; set; }
}

/// <summary>
/// Default settings for Arc elements (Pie/Doughnut).
/// </summary>
public class ArcElement : BaseElement
{
    /// <summary> Sweep angle in degrees. </summary>
    public int? Angle { get; set; }
    /// <summary> Border alignment ('center', 'inner'). </summary>
    public BorderAlign? BorderAlign { get; set; }
    /// <summary> Line dash pattern. </summary>
    public int[]? BorderDash { get; set; }
    /// <summary> Offset for line dashes. </summary>
    public double? BorderDashOffset { get; set; }
    /// <summary> Join style for borders. </summary>
    public JoinStyle? BorderJoinStyle { get; set; }
    /// <summary> If true, arc is curved. </summary>
    public bool? Circular { get; set; }
}

/// <summary>
/// Default settings for Bar elements.
/// </summary>
public class BarElement : BaseElement
{
    /// <summary> Edge to skip border. </summary>
    public object? BorderSkipped { get; set; }
    /// <summary> Corner radius in pixels. </summary>
    public object? BorderRadius { get; set; }
    /// <summary> Amount of pixels to inflate the bar. </summary>
    public object? InflateAmount { get; set; }
    /// <summary> Default point style for the legend. </summary>
    public PointStyle? PointStyle { get; set; }
}

/// <summary>
/// Default settings for Line elements.
/// </summary>
public class LineElement : BaseElement
{
    /// <summary> Bezier curve tension. </summary>
    public double? Tension { get; set; }
    /// <summary> Cap style. </summary>
    public CapStyle? BorderCapStyle { get; set; }
    /// <summary> Dash pattern. </summary>
    public int[]? BorderDash { get; set; }
    /// <summary> Dash offset. </summary>
    public double? BorderDashOffset { get; set; }
    /// <summary> Join style. </summary>
    public JoinStyle? BorderJoinStyle { get; set; }
    /// <summary> Keep Bezier control points inside the chart. </summary>
    public bool? CapBezierPoints { get; set; }
    /// <summary> Interpolation mode. </summary>
    public string? CubicInterpolationMode { get; set; }
    /// <summary> Default fill setting. </summary>
    public object? Fill { get; set; }
    /// <summary> Draw as stepped line. </summary>
    public bool? Stepped { get; set; }
}

/// <summary>
/// Default settings for Point elements.
/// </summary>
public class PointElement : BaseElement
{
    /// <summary> Point radius. </summary>
    public int? Radius { get; set; }
    /// <summary> Shape style. </summary>
    public object? PointStyle { get; set; }
    /// <summary> Rotation in degrees. </summary>
    public int? Rotation { get; set; }
    /// <summary> Hit detection radius. </summary>
    public int? HitRadius { get; set; }
    /// <summary> Radius when hovered. </summary>
    public int? HoverRadius { get; set; }
    /// <summary> Border width when hovered. </summary>
    public int? HoverBorderWidth { get; set; }
}