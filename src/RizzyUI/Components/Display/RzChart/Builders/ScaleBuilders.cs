
namespace RizzyUI.Charts;

/// <summary>
/// Builder for configuring chart axes (scales).
/// </summary>
public class ScaleBuilder
{
    private Scale? _scale;
    private readonly Dictionary<string, Scale> _scales;

    internal ScaleBuilder(Dictionary<string, Scale> scales)
    {
        _scales = scales;
    }

    /// <summary>
    /// Starts configuration for a specific scale identified by ID (e.g. 'x', 'y', 'r').
    /// </summary>
    public ScaleBuilder ScaleId(string scaleId)
    {
        _scale = new Scale();
        _scales.Add(scaleId, _scale);
        return this;
    }

    /// <summary> Sets the type of scale (e.g. 'linear', 'logarithmic', 'category', 'time'). </summary>
    public ScaleBuilder Type(string type) { _scale!.Type = type; return this; }
    /// <summary> If true, aligns pixel values to device pixels. </summary>
    public ScaleBuilder AlignToPixels(bool alignToPixels) { _scale!.AlignToPixels = alignToPixels; return this; }
    /// <summary> Sets the background color of the scale area. </summary>
    public ScaleBuilder BackgroundColor(string color) { _scale!.BackgroundColor = color; return this; }
    /// <summary> Sets the background color using a <see cref="Color"/> token. </summary>
    public ScaleBuilder BackgroundColor(Color color) { _scale!.BackgroundColor = color.ToCssColorString(); return this; }

    /// <summary> Configures the scale border styling. </summary>
    public ScaleBuilder Border(Action<ScaleBorderBuilder> action)
    {
        action(new ScaleBorderBuilder(_scale!));
        return this;
    }

    /// <summary> Enables or disables the axis display. </summary>
    public ScaleBuilder Display(bool display) { _scale!.Display = display; return this; }
    /// <summary> Controls visibility using a string (e.g. 'auto'). </summary>
    public ScaleBuilder Display(string display) { _scale!.Display = display; return this; }

    /// <summary> Configures the grid lines for the axis. </summary>
    public ScaleBuilder Grid(Action<GridBuilder> action)
    {
        action(new GridBuilder(_scale!));
        return this;
    }

    /// <summary> User-defined minimum value for the scale, overrides data minimum. </summary>
    public ScaleBuilder Min(int min) { _scale!.Min = min; return this; }
    /// <summary> User-defined maximum value for the scale, overrides data maximum. </summary>
    public ScaleBuilder Max(int max) { _scale!.Max = max; return this; }
    /// <summary> Reverses the scale. </summary>
    public ScaleBuilder Reverse(bool reverse) { _scale!.Reverse = reverse; return this; }
    /// <summary> If true, datasets are stacked on this axis. </summary>
    public ScaleBuilder Stacked(bool stacked) { _scale!.Stacked = stacked; return this; }
    /// <summary> Complex stacking configuration string (e.g. 'single'). </summary>
    public ScaleBuilder Stacked(string stacked) { _scale!.Stacked = stacked; return this; }
    /// <summary> Maximum value used only if the data maximum is lower. </summary>
    public ScaleBuilder SuggestedMax(int suggestedMax) { _scale!.SuggestedMax = suggestedMax; return this; }
    /// <summary> Minimum value used only if the data minimum is higher. </summary>
    public ScaleBuilder SuggestedMin(int suggestedMin) { _scale!.SuggestedMin = suggestedMin; return this; }

    /// <summary> Configures the tick marks (labels) along the axis. </summary>
    public ScaleBuilder Ticks(Action<TicksBuilder> action)
    {
        action(new TicksBuilder(_scale!));
        return this;
    }

    /// <summary> The weight used to sort the axis. Higher weights are further away from the chart area. </summary>
    public ScaleBuilder Weight(int weight) { _scale!.Weight = weight; return this; }

    /// <summary> Configures lifecycle and update callbacks for the scale. </summary>
    public ScaleBuilder Callbacks(Action<ScaleCallbackBuilder> action)
    {
        action(new ScaleCallbackBuilder(_scale!));
        return this;
    }

    /// <summary> If true, the scale will always include 0. Only applicable to Linear scales. </summary>
    public ScaleBuilder BeginAtZero(bool beginAtZero) { _scale!.BeginAtZero = beginAtZero; return this; }
    /// <summary> Value or percentage for adding room in the scale range above/below data. </summary>
    public ScaleBuilder Grace(string grace) { _scale!.Grace = grace; return this; }
    /// <summary> Fixed value for added room in the scale range. </summary>
    public ScaleBuilder Grace(int grace) { _scale!.Grace = grace; return this; }

    /// <summary> Determines the scale bounds ('ticks' or 'data'). </summary>
    public ScaleBuilder Bounds(Bounds bounds) { _scale!.Bounds = bounds; return this; }
    /// <summary> If true, clips the dataset drawing against the scale size. </summary>
    public ScaleBuilder Clip(bool clip) { _scale!.Clip = clip; return this; }
    /// <summary> Position of the axis relative to the chart area. </summary>
    public ScaleBuilder Position(AxisPosition position) { _scale!.Position = position; return this; }
    /// <summary> Stack group identifier. Axes with the same stack ID are stacked together. </summary>
    public ScaleBuilder Stack(string stack) { _scale!.Stack = stack; return this; }
    /// <summary> Weight of the scale within its stack group. </summary>
    public ScaleBuilder StackWeight(int weight) { _scale!.StackWeight = weight; return this; }
    /// <summary> Which type of axis this is ('x' or 'y'). </summary>
    public ScaleBuilder Axis(string axis) { _scale!.Axis = axis; return this; }
    /// <summary> If true, extra space is added to both edges and the axis is scaled to fit. </summary>
    public ScaleBuilder Offset(bool offset) { _scale!.Offset = offset; return this; }

    /// <summary> Configures the title for the scale. </summary>
    public ScaleBuilder Title(Action<ScaleTitleBuilder> action)
    {
        action(new ScaleTitleBuilder(_scale!));
        return this;
    }
}

/// <summary>
/// Builder for configuring scale grid lines.
/// </summary>
public class GridBuilder
{
    private readonly Grid _scaleGrid;

    internal GridBuilder(Scale scale)
    {
        scale.Grid = _scaleGrid = new Grid();
    }

    /// <summary> If true, gridlines are circular (Radar and Polar Area only). </summary>
    public GridBuilder Circular(bool circular) { _scaleGrid.Circular = circular; return this; }
    /// <summary> Color(s) for the grid lines. </summary>
    public GridBuilder Color(params string[] color) { _scaleGrid.Color = color; return this; }
    /// <summary> Color(s) using <see cref="RizzyUI.Color"/> tokens. </summary>
    public GridBuilder Color(params Color[] color) { _scaleGrid.Color = color.Select(c => c.ToCssColorString()).ToArray(); return this; }
    /// <summary> If false, do not display grid lines for this axis. </summary>
    public GridBuilder Display(bool display) { _scaleGrid.Display = display; return this; }
    /// <summary> If true, draw lines on the chart area. </summary>
    public GridBuilder DrawOnChartArea(bool drawOnChartArea) { _scaleGrid.DrawOnChartArea = drawOnChartArea; return this; }
    /// <summary> If true, draw lines beside the ticks in the axis area. </summary>
    public GridBuilder DrawTicks(bool drawTicks) { _scaleGrid.DrawTicks = drawTicks; return this; }
    /// <summary> Stroke width of grid lines. </summary>
    public GridBuilder LineWidth(int width) { _scaleGrid.LineWidth = width; return this; }
    /// <summary> If true, grid lines are shifted to be between labels. </summary>
    public GridBuilder Offset(bool offset) { _scaleGrid.Offset = offset; return this; }
    /// <summary> Dash pattern for the tick mark line. </summary>
    public GridBuilder TickBorderDash(params int[] borderDash) { _scaleGrid.TickBorderDash = borderDash; return this; }
    /// <summary> Dash offset for the tick mark line. </summary>
    public GridBuilder TickBorderDashOffset(int offset) { _scaleGrid.TickBorderDashOffset = offset; return this; }
    /// <summary> Color of the tick lines. </summary>
    public GridBuilder TickColor(string color) { _scaleGrid.TickColor = color; return this; }
    /// <summary> Tick color using a <see cref="RizzyUI.Color"/> token. </summary>
    public GridBuilder TickColor(Color color) { _scaleGrid.TickColor = color.ToCssColorString(); return this; }
    /// <summary> Length in pixels that the grid lines draw into the axis area. </summary>
    public GridBuilder TickLength(int length) { _scaleGrid.TickLength = length; return this; }
    /// <summary> Width of the tick mark in pixels. </summary>
    public GridBuilder TickWidth(int width) { _scaleGrid.TickWidth = width; return this; }
    /// <summary> Z-index of the gridline layer. </summary>
    public GridBuilder Z(int z) { _scaleGrid.Z = z; return this; }
}

/// <summary>
/// Builder for configuring scale border styling.
/// </summary>
public class ScaleBorderBuilder
{
    private readonly ScaleBorder _scaleBorder;

    internal ScaleBorderBuilder(Scale scale)
    {
        scale.Border = _scaleBorder = new ScaleBorder();
    }

    /// <summary> If true, draw a border between the axis and chart area. </summary>
    public ScaleBorderBuilder Display(bool display) { _scaleBorder.Display = display; return this; }
    /// <summary> Color of the border line. </summary>
    public ScaleBorderBuilder Color(string color) { _scaleBorder.Color = color; return this; }
    /// <summary> Border color using a <see cref="RizzyUI.Color"/> token. </summary>
    public ScaleBorderBuilder Color(Color color) { _scaleBorder.Color = color.ToCssColorString(); return this; }
    /// <summary> Width of the border line in pixels. </summary>
    public ScaleBorderBuilder Width(int width) { _scaleBorder.Width = width; return this; }
    /// <summary> Dash pattern for the border. </summary>
    public ScaleBorderBuilder Dash(params int[] dash) { _scaleBorder.Dash = dash; return this; }
    /// <summary> Dash offset for the border. </summary>
    public ScaleBorderBuilder DashOffset(double dashOffset) { _scaleBorder.DashOffset = dashOffset; return this; }
    /// <summary> Z-index of the border layer. </summary>
    public ScaleBorderBuilder Z(int z) { _scaleBorder.Z = z; return this; }
}

/// <summary>
/// Builder for configuring scale title options.
/// </summary>
public class ScaleTitleBuilder
{
    private readonly ScaleTitle _scaleTitle;

    internal ScaleTitleBuilder(Scale scale)
    {
        scale.Title = _scaleTitle = new ScaleTitle();
    }

    /// <summary> If true, display the axis title. </summary>
    public ScaleTitleBuilder Display(bool display) { _scaleTitle.Display = display; return this; }
    /// <summary> Alignment of the title ('start', 'center', 'end'). </summary>
    public ScaleTitleBuilder Align(TitleAlign align) { _scaleTitle.Align = align; return this; }
    /// <summary> The title text. </summary>
    public ScaleTitleBuilder Text(string text) { _scaleTitle.Text = text; return this; }
    /// <summary> Multiline title text. </summary>
    public ScaleTitleBuilder Text(params string[] text) { _scaleTitle.Text = text; return this; }
    /// <summary> Color of the title text. </summary>
    public ScaleTitleBuilder Color(string color) { _scaleTitle.Color = color; return this; }
    /// <summary> Title color using a <see cref="RizzyUI.Color"/> token. </summary>
    public ScaleTitleBuilder Color(Color color) { _scaleTitle.Color = color.ToCssColorString(); return this; }
    /// <summary> Configures the font for the scale title. </summary>
    public ScaleTitleBuilder Font(Action<FontBuilder> action)
    {
        _scaleTitle.Font = new ChartFont();
        action(new FontBuilder(_scaleTitle.Font));
        return this;
    }
    /// <summary> Padding around the title in pixels. </summary>
    public ScaleTitleBuilder Padding(int padding) { _scaleTitle.Padding = new Padding(padding); return this; }
    /// <summary> Granular padding around the title. </summary>
    public ScaleTitleBuilder Padding(Action<PaddingBuilder> action)
    {
        _scaleTitle.Padding = new Padding();
        action(new PaddingBuilder(_scaleTitle.Padding));
        return this;
    }
}

/// <summary>
/// Builder for configuring axis tick labels.
/// </summary>
public class TicksBuilder
{
    private readonly Ticks _scaleTicks;

    internal TicksBuilder(Scale scale)
    {
        scale.Ticks = _scaleTicks = new Ticks();
    }

    /// <summary> Color of label backdrops. </summary>
    public TicksBuilder BackdropColor(string color) { _scaleTicks.BackdropColor = color; return this; }
    /// <summary> Backdrop color using a <see cref="RizzyUI.Color"/> token. </summary>
    public TicksBuilder BackdropColor(Color color) { _scaleTicks.BackdropColor = color.ToCssColorString(); return this; }
    /// <summary> Uniform padding of the label backdrop. </summary>
    public TicksBuilder BackdropPadding(int padding) { _scaleTicks.BackdropPadding = new Padding(padding); return this; }
    /// <summary> Granular padding of the label backdrop. </summary>
    public TicksBuilder BackdropPadding(Action<PaddingBuilder> action)
    {
        _scaleTicks.BackdropPadding = new Padding();
        action(new PaddingBuilder(_scaleTicks.BackdropPadding));
        return this;
    }
    /// <summary> JavaScript function name used to return a custom string representation of the tick value. </summary>
    public TicksBuilder Callback(string callback) { _scaleTicks.Callback = callback; return this; }
    /// <summary> If true, show tick labels. </summary>
    public TicksBuilder Display(bool display) { _scaleTicks.Display = display; return this; }
    /// <summary> Color of the tick labels. </summary>
    public TicksBuilder Color(string color) { _scaleTicks.Color = color; return this; }
    /// <summary> Label color using a <see cref="RizzyUI.Color"/> token. </summary>
    public TicksBuilder Color(Color color) { _scaleTicks.Color = color.ToCssColorString(); return this; }
    /// <summary> Configures the font for the tick labels. </summary>
    public TicksBuilder Font(Action<FontBuilder> action)
    {
        _scaleTicks.Font = new ChartFont();
        action(new FontBuilder(_scaleTicks.Font));
        return this;
    }
    /// <summary> If true, major ticks are generated with potential for special styling. </summary>
    public TicksBuilder Major(bool enabled) { _scaleTicks.Major = new TicksMajor { Enabled = enabled }; return this; }
    /// <summary> Padding between the tick label and the axis. </summary>
    public TicksBuilder Padding(int padding) { _scaleTicks.Padding = padding; return this; }
    /// <summary> If true, draws a background behind the tick labels. </summary>
    public TicksBuilder ShowLabelBackdrop(bool show) { _scaleTicks.ShowLabelBackdrop = show; return this; }
    /// <summary> Color of the stroke around label text. </summary>
    public TicksBuilder TextStrokeColor(string color) { _scaleTicks.TextStrokeColor = color; return this; }
    /// <summary> Stroke color using a <see cref="RizzyUI.Color"/> token. </summary>
    public TicksBuilder TextStrokeColor(Color color) { _scaleTicks.TextStrokeColor = color.ToCssColorString(); return this; }
    /// <summary> Width of the stroke around label text in pixels. </summary>
    public TicksBuilder TextStrokeWidth(int width) { _scaleTicks.TextStrokeWidth = width; return this; }
    /// <summary> Z-index of the tick layer. </summary>
    public TicksBuilder Z(int z) { _scaleTicks.Z = z; return this; }
    /// <summary> Tick alignment ('start', 'center', 'end', 'inner'). </summary>
    public TicksBuilder Align(TicksAlign align) { _scaleTicks.Align = align; return this; }
    /// <summary> Perpendicular alignment ('near', 'center', 'far'). </summary>
    public TicksBuilder CrossAlign(TicksCrossAlign align) { _scaleTicks.CrossAlign = align; return this; }
    /// <summary> Number of ticks to examine when deciding how many will fit. </summary>
    public TicksBuilder SampleSize(int size) { _scaleTicks.SampleSize = size; return this; }
    /// <summary> Automatically skip labels to avoid overlap. </summary>
    public TicksBuilder AutoSkip(bool autoSkip) { _scaleTicks.AutoSkip = autoSkip; return this; }
    /// <summary> Minimum padding in pixels between skipped ticks. </summary>
    public TicksBuilder AutoSkipPadding(int padding) { _scaleTicks.AutoSkipPadding = padding; return this; }
    /// <summary> Ensure min/max values are presented as ticks even if not 'nice'. </summary>
    public TicksBuilder IncludeBounds(bool includeBounds) { _scaleTicks.IncludeBounds = includeBounds; return this; }
    /// <summary> Distance in pixels to offset the label from the center point. </summary>
    public TicksBuilder LabelOffset(int offset) { _scaleTicks.LabelOffset = offset; return this; }
    /// <summary> Maximum rotation for tick labels in degrees. </summary>
    public TicksBuilder MaxRotation(int maxRotation) { _scaleTicks.MaxRotation = maxRotation; return this; }
    /// <summary> Minimum rotation for tick labels in degrees. </summary>
    public TicksBuilder MinRotation(int minRotation) { _scaleTicks.MinRotation = minRotation; return this; }
    /// <summary> Flips tick labels inside the chart area (vertical scales only). </summary>
    public TicksBuilder Mirror(bool mirror) { _scaleTicks.Mirror = mirror; return this; }
    /// <summary> Maximum number of ticks and gridlines to show. </summary>
    public TicksBuilder MaxTicksLimit(int maxTicksLimit) { _scaleTicks.MaxTicksLimit = maxTicksLimit; return this; }
}

/// <summary>
/// Builder for configuring scale-level JavaScript callback functions.
/// </summary>
public class ScaleCallbackBuilder
{
    private readonly Scale _scale;

    internal ScaleCallbackBuilder(Scale scale)
    {
        _scale = scale;
    }

    /// <summary> Function called before the update process starts. </summary>
    public ScaleCallbackBuilder BeforeUpdate(string functionName) { _scale.BeforeUpdate = functionName; return this; }
    /// <summary> Function called at the end of the update process. </summary>
    public ScaleCallbackBuilder AfterUpdate(string functionName) { _scale.AfterUpdate = functionName; return this; }
    /// <summary> Function called before dimensions are set. </summary>
    public ScaleCallbackBuilder BeforeSetDimensions(string functionName) { _scale.BeforeSetDimensions = functionName; return this; }
    /// <summary> Function called after dimensions are set. </summary>
    public ScaleCallbackBuilder AfterSetDimensions(string functionName) { _scale.AfterSetDimensions = functionName; return this; }
    /// <summary> Function called before data limits are determined. </summary>
    public ScaleCallbackBuilder BeforeDataLimits(string functionName) { _scale.BeforeDataLimits = functionName; return this; }
    /// <summary> Function called after data limits are determined. </summary>
    public ScaleCallbackBuilder AfterDataLimits(string functionName) { _scale.AfterDataLimits = functionName; return this; }
    /// <summary> Function called before ticks are created. </summary>
    public ScaleCallbackBuilder BeforeBuildTicks(string functionName) { _scale.BeforeBuildTicks = functionName; return this; }
    /// <summary> Function called after ticks are created. </summary>
    public ScaleCallbackBuilder AfterBuildTicks(string functionName) { _scale.AfterBuildTicks = functionName; return this; }
    /// <summary> Function called before ticks are converted into strings. </summary>
    public ScaleCallbackBuilder BeforeTickToLabelConversion(string functionName) { _scale.BeforeTickToLabelConversion = functionName; return this; }
    /// <summary> Function called after ticks are converted into strings. </summary>
    public ScaleCallbackBuilder AfterTickToLabelConversion(string functionName) { _scale.AfterTickToLabelConversion = functionName; return this; }
    /// <summary> Function called before tick rotation is determined. </summary>
    public ScaleCallbackBuilder BeforeCalculateLabelRotation(string functionName) { _scale.BeforeCalculateLabelRotation = functionName; return this; }
    /// <summary> Function called after tick rotation is determined. </summary>
    public ScaleCallbackBuilder AfterCalculateLabelRotation(string functionName) { _scale.AfterCalculateLabelRotation = functionName; return this; }
    /// <summary> Function called before the scale fits to the canvas. </summary>
    public ScaleCallbackBuilder BeforeFit(string functionName) { _scale.BeforeFit = functionName; return this; }
    /// <summary> Function called after the scale fits to the canvas. </summary>
    public ScaleCallbackBuilder AfterFit(string functionName) { _scale.AfterFit = functionName; return this; }
}