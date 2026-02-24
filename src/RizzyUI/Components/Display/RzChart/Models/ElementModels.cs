
#pragma warning disable CS1591
namespace RizzyUI.Charts;


public class Elements
{
    public PointElement? Point { get; set; }
    public LineElement? Line { get; set; }
    public BarElement? Bar { get; set; }
    public ArcElement? Arc { get; set; }
}

public class BaseElement
{
    public object? BackgroundColor { get; set; }
    public int? BorderWidth { get; set; }
    public object? BorderColor { get; set; }
}

public class ArcElement : BaseElement
{
    public int? Angle { get; set; }
    public BorderAlign? BorderAlign { get; set; }
    public int[]? BorderDash { get; set; }
    public double? BorderDashOffset { get; set; }
    public JoinStyle? BorderJoinStyle { get; set; }
    public bool? Circular { get; set; }
}

public class BarElement : BaseElement
{
    public object? BorderSkipped { get; set; }
    public object? BorderRadius { get; set; }
    public object? InflateAmount { get; set; }
    public PointStyle? PointStyle { get; set; }
}

public class LineElement : BaseElement
{
    public double? Tension { get; set; }
    public CapStyle? BorderCapStyle { get; set; }
    public int[]? BorderDash { get; set; }
    public double? BorderDashOffset { get; set; }
    public JoinStyle? BorderJoinStyle { get; set; }
    public bool? CapBezierPoints { get; set; }
    public string? CubicInterpolationMode { get; set; }
    public object? Fill { get; set; }
    public bool? Stepped { get; set; }
}

public class PointElement : BaseElement
{
    public int? Radius { get; set; }
    public object? PointStyle { get; set; }
    public int? Rotation { get; set; }
    public int? HitRadius { get; set; }
    public int? HoverRadius { get; set; }
    public int? HoverBorderWidth { get; set; }
}