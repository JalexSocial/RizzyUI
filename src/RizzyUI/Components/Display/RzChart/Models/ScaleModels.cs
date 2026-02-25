
namespace RizzyUI.Charts;

/// <summary>
/// Configuration for a chart axis (scale).
/// </summary>
public class Scale
{
    /// <summary> Type of scale ('linear', 'logarithmic', 'category', 'time', 'timeseries'). </summary>
    public string? Type { get; set; }
    /// <summary> Align pixel values to device pixels. </summary>
    public bool? AlignToPixels { get; set; }
    /// <summary> Background color of the scale area. </summary>
    public string? BackgroundColor { get; set; }
    /// <summary> Scale border styling. </summary>
    public ScaleBorder? Border { get; set; }
    /// <summary> Visibility of the axis (boolean or 'auto'). </summary>
    public object? Display { get; set; }
    /// <summary> Grid line configuration. </summary>
    public Grid? Grid { get; set; }
    /// <summary> User defined minimum number for the scale. </summary>
    public int? Min { get; set; }
    /// <summary> User defined maximum number for the scale. </summary>
    public int? Max { get; set; }
    /// <summary> Reverse the scale. </summary>
    public bool? Reverse { get; set; }
    /// <summary> Should data be stacked (boolean or 'single'). </summary>
    public object? Stacked { get; set; }
    /// <summary> Max value used only if data maximum is lower. </summary>
    public int? SuggestedMax { get; set; }
    /// <summary> Min value used only if data minimum is higher. </summary>
    public int? SuggestedMin { get; set; }
    /// <summary> Tick label configuration. </summary>
    public Ticks? Ticks { get; set; }
    /// <summary> Weight used to sort the axis. </summary>
    public int? Weight { get; set; }

    /// <summary> If true, scale will include 0. </summary>
    public bool? BeginAtZero { get; set; }
    /// <summary> Added room in the scale range (number or '5%'). </summary>
    public object? Grace { get; set; }

    /// <summary> Determines scale bounds ('ticks' or 'data'). </summary>
    public Bounds? Bounds { get; set; }
    /// <summary> Clip dataset drawing against scale size. </summary>
    public bool? Clip { get; set; }
    /// <summary> Position relative to chart area. </summary>
    public AxisPosition? Position { get; set; }
    /// <summary> Stack group identifier. </summary>
    public string? Stack { get; set; }
    /// <summary> Weight within stack group. </summary>
    public int? StackWeight { get; set; }
    /// <summary> Axis type ('x', 'y'). </summary>
    public string? Axis { get; set; }
    /// <summary> Extra space added to edges. </summary>
    public bool? Offset { get; set; }
    /// <summary> Axis title configuration. </summary>
    public ScaleTitle? Title { get; set; }

    /// <summary>
    /// Gets or sets the name of the JS function called before the scale update process starts.
    /// Receives the axis instance as an argument.
    /// </summary>
    public string? BeforeUpdate { get; set; }

    /// <summary>
    /// Gets or sets the name of the JS function called at the end of the scale update process.
    /// Receives the axis instance as an argument.
    /// </summary>
    public string? AfterUpdate { get; set; }

    /// <summary>
    /// Gets or sets the name of the JS function called before the scale dimensions are set.
    /// Receives the axis instance as an argument.
    /// </summary>
    public string? BeforeSetDimensions { get; set; }

    /// <summary>
    /// Gets or sets the name of the JS function called after the scale dimensions are set.
    /// Receives the axis instance as an argument.
    /// </summary>
    public string? AfterSetDimensions { get; set; }

    /// <summary>
    /// Gets or sets the name of the JS function called before the scale data limits are determined.
    /// Receives the axis instance as an argument.
    /// </summary>
    public string? BeforeDataLimits { get; set; }

    /// <summary>
    /// Gets or sets the name of the JS function called after the scale data limits are determined.
    /// Receives the axis instance as an argument.
    /// </summary>
    public string? AfterDataLimits { get; set; }

    /// <summary>
    /// Gets or sets the name of the JS function called before the scale ticks are created.
    /// Receives the axis instance as an argument.
    /// </summary>
    public string? BeforeBuildTicks { get; set; }

    /// <summary>
    /// Gets or sets the name of the JS function called after the scale ticks are created.
    /// Useful for filtering or modifying the generated ticks. Receives the axis instance as an argument.
    /// </summary>
    public string? AfterBuildTicks { get; set; }

    /// <summary>
    /// Gets or sets the name of the JS function called before ticks are converted into string labels.
    /// Receives the axis instance as an argument.
    /// </summary>
    public string? BeforeTickToLabelConversion { get; set; }

    /// <summary>
    /// Gets or sets the name of the JS function called after ticks are converted into string labels.
    /// Receives the axis instance as an argument.
    /// </summary>
    public string? AfterTickToLabelConversion { get; set; }

    /// <summary>
    /// Gets or sets the name of the JS function called before tick rotation is determined.
    /// Receives the axis instance as an argument.
    /// </summary>
    public string? BeforeCalculateLabelRotation { get; set; }

    /// <summary>
    /// Gets or sets the name of the JS function called after tick rotation is determined.
    /// Receives the axis instance as an argument.
    /// </summary>
    public string? AfterCalculateLabelRotation { get; set; }

    /// <summary>
    /// Gets or sets the name of the JS function called before the scale fits to the canvas.
    /// Receives the axis instance as an argument.
    /// </summary>
    public string? BeforeFit { get; set; }

    /// <summary>
    /// Gets or sets the name of the JS function called after the scale has been fitted to the canvas.
    /// Receives the axis instance as an argument.
    /// </summary>
    public string? AfterFit { get; set; }
}

/// <summary>
/// Configuration for scale grid lines.
/// </summary>
public class Grid
{
    /// <summary> If true, gridlines are circular. </summary>
    public bool? Circular { get; set; }
    /// <summary> Color array for grid lines. </summary>
    public string[]? Color { get; set; }
    /// <summary> If false, grid lines are hidden. </summary>
    public bool? Display { get; set; }
    /// <summary> Draw lines on chart area. </summary>
    public bool? DrawOnChartArea { get; set; }
    /// <summary> Draw lines beside ticks. </summary>
    public bool? DrawTicks { get; set; }
    /// <summary> Grid line width in pixels. </summary>
    public int? LineWidth { get; set; }
    /// <summary> Shift lines between labels. </summary>
    public bool? Offset { get; set; }
    /// <summary> Dash pattern for tick marks. </summary>
    public int[]? TickBorderDash { get; set; }
    /// <summary> Dash offset for tick marks. </summary>
    public int? TickBorderDashOffset { get; set; }
    /// <summary> Color of the tick marks. </summary>
    public string? TickColor { get; set; }
    /// <summary> Length of tick marks in pixels. </summary>
    public int? TickLength { get; set; }
    /// <summary> Width of tick marks in pixels. </summary>
    public int? TickWidth { get; set; }
    /// <summary> Z-index for grid layer. </summary>
    public int? Z { get; set; }
}

/// <summary>
/// Configuration for the scale border line.
/// </summary>
public class ScaleBorder
{
    /// <summary> If true, draw border line. </summary>
    public bool? Display { get; set; }
    /// <summary> Border color. </summary>
    public string? Color { get; set; }
    /// <summary> Border width. </summary>
    public int Width { get; set; }
    /// <summary> Dash pattern. </summary>
    public int[]? Dash { get; set; }
    /// <summary> Dash offset. </summary>
    public double DashOffset { get; set; }
    /// <summary> Z-index. </summary>
    public int Z { get; set; }
}

/// <summary>
/// Configuration for the axis title.
/// </summary>
public class ScaleTitle
{
    /// <summary> If true, display axis title. </summary>
    public bool? Display { get; set; }
    /// <summary> Alignment ('start', 'center', 'end'). </summary>
    public TitleAlign? Align { get; set; }
    /// <summary> Title text (string or multiline array). </summary>
    public object? Text { get; set; }
    /// <summary> Text color. </summary>
    public string? Color { get; set; }
    /// <summary> Font settings. </summary>
    public ChartFont? Font { get; set; }
    /// <summary> Title padding. </summary>
    public Padding? Padding { get; set; }
}

/// <summary>
/// Configuration for major ticks.
/// </summary>
public class TicksMajor
{
    /// <summary> If true, major ticks are generated. </summary>
    public bool? Enabled { get; set; }
}

/// <summary>
/// Configuration for axis tick labels.
/// </summary>
public class Ticks
{
    /// <summary> Label backdrop color. </summary>
    public string? BackdropColor { get; set; }
    /// <summary> Backdrop padding. </summary>
    public Padding? BackdropPadding { get; set; }
    /// <summary> Label formatter function name. </summary>
    public string? Callback { get; set; }
    /// <summary> If true, show tick labels. </summary>
    public bool? Display { get; set; }
    /// <summary> Label color. </summary>
    public string? Color { get; set; }
    /// <summary> Label font settings. </summary>
    public ChartFont? Font { get; set; }
    /// <summary> Major tick settings. </summary>
    public TicksMajor? Major { get; set; }
    /// <summary> Offset from axis in pixels. </summary>
    public int? Padding { get; set; }
    /// <summary> Draw background behind labels. </summary>
    public bool? ShowLabelBackdrop { get; set; }
    /// <summary> Stroke color around text. </summary>
    public string? TextStrokeColor { get; set; }
    /// <summary> Stroke width around text. </summary>
    public int? TextStrokeWidth { get; set; }
    /// <summary> Z-index. </summary>
    public int? Z { get; set; }

    /// <summary> Label alignment. </summary>
    public TicksAlign? Align { get; set; }
    /// <summary> Perpendicular alignment. </summary>
    public TicksCrossAlign? CrossAlign { get; set; }
    /// <summary> Number of ticks to examine for autoskip. </summary>
    public int? SampleSize { get; set; }
    /// <summary> Automatically skip overlapping labels. </summary>
    public bool? AutoSkip { get; set; }
    /// <summary> Min pixels between skipped ticks. </summary>
    public int? AutoSkipPadding { get; set; }
    /// <summary> Include boundary values as ticks. </summary>
    public bool? IncludeBounds { get; set; }
    /// <summary> Pixels to offset label from center. </summary>
    public int? LabelOffset { get; set; }
    /// <summary> Max label rotation. </summary>
    public int? MaxRotation { get; set; }
    /// <summary> Min label rotation. </summary>
    public int? MinRotation { get; set; }
    /// <summary> Flip labels inside chart (vertical only). </summary>
    public bool? Mirror { get; set; }
    /// <summary> Max number of ticks to show. </summary>
    public int? MaxTicksLimit { get; set; }
}