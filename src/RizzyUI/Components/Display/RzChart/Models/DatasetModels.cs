
#pragma warning disable CS1591
namespace RizzyUI.Charts;


public class BaseDataset
{
    public object? Data { get; set; }
    public string? Label { get; set; }
    public string? Type { get; set; }
    public object? BackgroundColor { get; set; }
    public object? BorderColor { get; set; }
    public int? BorderWidth { get; set; }
    public object? Clip { get; set; }
    public object? HoverBackgroundColor { get; set; }
    public object? HoverBorderColor { get; set; }
    public int? HoverBorderWidth { get; set; }
    public object? Parsing { get; set; }
    public bool? Hidden { get; set; }
}

public class ArcDataset : BaseDataset
{
    public BorderAlign? BorderAlign { get; set; }
    public int[]? BorderDash { get; set; }
    public double? BorderDashOffset { get; set; }
    public JoinStyle? BorderJoinStyle { get; set; }
    public int[]? HoverBorderDash { get; set; }
    public double? HoverBorderDashOffset { get; set; }
    public JoinStyle? HoverBorderJoinStyle { get; set; }
    public new int[]? Data { get; set; }
}

public class BarDataset : BaseDataset
{
    public int? Base { get; set; }
    public double? BarPercentage { get; set; }
    public object? BarThickness { get; set; }
    public object? BorderSkipped { get; set; }
    public new object? BorderWidth { get; set; }
    public object? BorderRadius { get; set; }
    public double? CategoryPercentage { get; set; }
    public bool? Grouped { get; set; }
    public int? HoverBorderRadius { get; set; }
    public IndexAxis? IndexAxis { get; set; }
    public int? Order { get; set; }
    public object? PointStyle { get; set; }
    public bool? SkipNull { get; set; }
    public string? Stack { get; set; }
    public string? XAxisID { get; set; }
    public string? YAxisID { get; set; }
}

public class BubbleDataset : BaseDataset
{
    public bool? DrawActiveElementsOnTop { get; set; }
    public int? HoverRadius { get; set; }
    public int? HitRadius { get; set; }
    public int? Order { get; set; }
    public object? PointStyle { get; set; }
    public int? Rotation { get; set; }
    public int? Radius { get; set; }
}

public class DoughnutPieDataset : ArcDataset
{
    public int? Circumference { get; set; }
    public int? HoverOffset { get; set; }
    public object? Offset { get; set; }
    public int? Rotation { get; set; }
    public int? Spacing { get; set; }
    public int? Weight { get; set; }
}

public class PointDataset : BaseDataset
{
    public CapStyle? BorderCapStyle { get; set; }
    public int[]? BorderDash { get; set; }
    public double? BorderDashOffset { get; set; }
    public JoinStyle? BorderJoinStyle { get; set; }
    public CapStyle? HoverBorderCapStyle { get; set; }
    public int[]? HoverBorderDash { get; set; }
    public double? HoverBorderDashOffset { get; set; }
    public JoinStyle? HoverBorderJoinStyle { get; set; }
    public object? Fill { get; set; }
    public int? Order { get; set; }
    public double? Tension { get; set; }
    public string? PointBackgroundColor { get; set; }
    public string? PointBorderColor { get; set; }
    public int? PointBorderWidth { get; set; }
    public int? PointHitRadius { get; set; }
    public string? PointHoverBackgroundColor { get; set; }
    public string? PointHoverBorderColor { get; set; }
    public int? PointHoverBorderWidth { get; set; }
    public int? PointHoverRadius { get; set; }
    public int? PointRadius { get; set; }
    public int? PointRotation { get; set; }
    public object? PointStyle { get; set; }
    public bool? SpanGaps { get; set; }
}

public class LineDataset : PointDataset
{
    public InterpolationMode? CubicInterpolationMode { get; set; }
    public bool? DrawActiveElementsOnTop { get; set; }
    public IndexAxis? IndexAxis { get; set; }
    public string? Segment { get; set; }
    public bool? ShowLine { get; set; }
    public string? Stack { get; set; }
    public object? Stepped { get; set; }
    public string? XAxisID { get; set; }
    public string? YAxisID { get; set; }
}

public class PolarAreaDataset : ArcDataset
{
    public bool? Circular { get; set; }
}

public class RadarDataset : PointDataset
{
    public new double[]? Data { get; set; }
}