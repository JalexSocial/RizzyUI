
#pragma warning disable CS1591
namespace RizzyUI.Charts;


public class Scale
{
    // Common options to all axes
    public string? Type { get; set; }
    public bool? AlignToPixels { get; set; }
    public string? BackgroundColor { get; set; }
    public ScaleBorder? Border { get; set; }
    public object? Display { get; set; }
    public Grid? Grid { get; set; }
    public int? Min { get; set; }
    public int? Max { get; set; }
    public bool? Reverse { get; set; }
    public object? Stacked { get; set; }
    public int? SuggestedMax { get; set; }
    public int? SuggestedMin { get; set; }
    public Ticks? Ticks { get; set; }
    public int? Weight { get; set; }

    // Linear Axis specific options
    public bool? BeginAtZero { get; set; }
    public object? Grace { get; set; }

    // Common options to all cartesian axes
    public Bounds? Bounds { get; set; }
    public bool? Clip { get; set; }
    public AxisPosition? Position { get; set; }
    public string? Stack { get; set; }
    public int? StackWeight { get; set; }
    public string? Axis { get; set; }
    public bool? Offset { get; set; }
    public ScaleTitle? Title { get; set; }

    // Callbacks
    public string? BeforeUpdate { get; set; }
    public string? AfterUpdate { get; set; }
    public string? BeforeSetDimensions { get; set; }
    public string? AfterSetDimensions { get; set; }
    public string? BeforeDataLimits { get; set; }
    public string? AfterDataLimits { get; set; }
    public string? BeforeBuildTicks { get; set; }
    public string? AfterBuildTicks { get; set; }
    public string? BeforeTickToLabelConversion { get; set; }
    public string? AfterTickToLabelConversion { get; set; }
    public string? BeforeCalculateLabelRotation { get; set; }
    public string? AfterCalculateLabelRotation { get; set; }
    public string? BeforeFit { get; set; }
    public string? AfterFit { get; set; }
}

public class Grid
{
    public bool? Circular { get; set; }
    public string[]? Color { get; set; }
    public bool? Display { get; set; }
    public bool? DrawOnChartArea { get; set; }
    public bool? DrawTicks { get; set; }
    public int? LineWidth { get; set; }
    public bool? Offset { get; set; }
    public int[]? TickBorderDash { get; set; }
    public int? TickBorderDashOffset { get; set; }
    public string? TickColor { get; set; }
    public int? TickLength { get; set; }
    public int? TickWidth { get; set; }
    public int? Z { get; set; }
}

public class ScaleBorder
{
    public bool? Display { get; set; }
    public string? Color { get; set; }
    public int Width { get; set; }
    public int[]? Dash { get; set; }
    public double DashOffset { get; set; }
    public int Z { get; set; }
}

public class ScaleTitle
{
    public bool? Display { get; set; }
    public TitleAlign? Align { get; set; }
    public object? Text { get; set; }
    public string? Color { get; set; }
    public ChartFont? Font { get; set; }
    public Padding? Padding { get; set; }
}

public class TicksMajor
{
    public bool? Enabled { get; set; }
}

public class Ticks
{
    // Common tick options to all axes
    public string? BackdropColor { get; set; }
    public Padding? BackdropPadding { get; set; }
    public string? Callback { get; set; }
    public bool? Display { get; set; }
    public string? Color { get; set; }
    public ChartFont? Font { get; set; }
    public TicksMajor? Major { get; set; }
    public int? Padding { get; set; }
    public bool? ShowLabelBackdrop { get; set; }
    public string? TextStrokeColor { get; set; }
    public int? TextStrokeWidth { get; set; }
    public int? Z { get; set; }

    // Common tick options to all cartesian axes
    public TicksAlign? Align { get; set; }
    public TicksCrossAlign? CrossAlign { get; set; }
    public int? SampleSize { get; set; }
    public bool? AutoSkip { get; set; }
    public int? AutoSkipPadding { get; set; }
    public bool? IncludeBounds { get; set; }
    public int? LabelOffset { get; set; }
    public int? MaxRotation { get; set; }
    public int? MinRotation { get; set; }
    public bool? Mirror { get; set; }
    public int? MaxTicksLimit { get; set; }
}