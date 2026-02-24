
#pragma warning disable CS1591
namespace RizzyUI.Charts;

public class ScaleBuilder
{
    private Scale? _scale;
    private readonly Dictionary<string, Scale> _scales;

    internal ScaleBuilder(Dictionary<string, Scale> scales)
    {
        _scales = scales;
    }

    public ScaleBuilder ScaleId(string scaleId)
    {
        _scale = new Scale();
        _scales.Add(scaleId, _scale);
        return this;
    }

    public ScaleBuilder Type(string type) { _scale!.Type = type; return this; }
    public ScaleBuilder AlignToPixels(bool alignToPixels) { _scale!.AlignToPixels = alignToPixels; return this; }
    public ScaleBuilder BackgroundColor(string color) { _scale!.BackgroundColor = color; return this; }
    public ScaleBuilder BackgroundColor(Color color) { _scale!.BackgroundColor = color.ToCssColorString(); return this; }
    
    public ScaleBuilder Border(Action<ScaleBorderBuilder> action)
    {
        action(new ScaleBorderBuilder(_scale!));
        return this;
    }

    public ScaleBuilder Display(bool display) { _scale!.Display = display; return this; }
    public ScaleBuilder Display(string display) { _scale!.Display = display; return this; }
    
    public ScaleBuilder Grid(Action<GridBuilder> action)
    {
        action(new GridBuilder(_scale!));
        return this;
    }

    public ScaleBuilder Min(int min) { _scale!.Min = min; return this; }
    public ScaleBuilder Max(int max) { _scale!.Max = max; return this; }
    public ScaleBuilder Reverse(bool reverse) { _scale!.Reverse = reverse; return this; }
    public ScaleBuilder Stacked(bool stacked) { _scale!.Stacked = stacked; return this; }
    public ScaleBuilder Stacked(string stacked) { _scale!.Stacked = stacked; return this; }
    public ScaleBuilder SuggestedMax(int suggestedMax) { _scale!.SuggestedMax = suggestedMax; return this; }
    public ScaleBuilder SuggestedMin(int suggestedMin) { _scale!.SuggestedMin = suggestedMin; return this; }
    
    public ScaleBuilder Ticks(Action<TicksBuilder> action)
    {
        action(new TicksBuilder(_scale!));
        return this;
    }

    public ScaleBuilder Weight(int weight) { _scale!.Weight = weight; return this; }

    public ScaleBuilder Callbacks(Action<ScaleCallbackBuilder> action)
    {
        action(new ScaleCallbackBuilder(_scale!));
        return this;
    }

    // Linear Axis specific options
    public ScaleBuilder BeginAtZero(bool beginAtZero) { _scale!.BeginAtZero = beginAtZero; return this; }
    public ScaleBuilder Grace(string grace) { _scale!.Grace = grace; return this; }
    public ScaleBuilder Grace(int grace) { _scale!.Grace = grace; return this; }

    // Common options to all cartesian axes
    public ScaleBuilder Bounds(Bounds bounds) { _scale!.Bounds = bounds; return this; }
    public ScaleBuilder Clip(bool clip) { _scale!.Clip = clip; return this; }
    public ScaleBuilder Position(AxisPosition position) { _scale!.Position = position; return this; }
    public ScaleBuilder Stack(string stack) { _scale!.Stack = stack; return this; }
    public ScaleBuilder StackWeight(int weight) { _scale!.StackWeight = weight; return this; }
    public ScaleBuilder Axis(string axis) { _scale!.Axis = axis; return this; }
    public ScaleBuilder Offset(bool offset) { _scale!.Offset = offset; return this; }
    
    public ScaleBuilder Title(Action<ScaleTitleBuilder> action)
    {
        action(new ScaleTitleBuilder(_scale!));
        return this;
    }
}

public class GridBuilder
{
    private readonly Grid _scaleGrid;

    internal GridBuilder(Scale scale)
    {
        scale.Grid = _scaleGrid = new Grid();
    }

    public GridBuilder Circular(bool circular) { _scaleGrid.Circular = circular; return this; }
    public GridBuilder Color(params string[] color) { _scaleGrid.Color = color; return this; }
    public GridBuilder Color(params Color[] color) { _scaleGrid.Color = color.Select(c => c.ToCssColorString()).ToArray(); return this; }
    public GridBuilder Display(bool display) { _scaleGrid.Display = display; return this; }
    public GridBuilder DrawOnChartArea(bool drawOnChartArea) { _scaleGrid.DrawOnChartArea = drawOnChartArea; return this; }
    public GridBuilder DrawTicks(bool drawTicks) { _scaleGrid.DrawTicks = drawTicks; return this; }
    public GridBuilder LineWidth(int width) { _scaleGrid.LineWidth = width; return this; }
    public GridBuilder Offset(bool offset) { _scaleGrid.Offset = offset; return this; }
    public GridBuilder TickBorderDash(params int[] borderDash) { _scaleGrid.TickBorderDash = borderDash; return this; }
    public GridBuilder TickBorderDashOffset(int offset) { _scaleGrid.TickBorderDashOffset = offset; return this; }
    public GridBuilder TickColor(string color) { _scaleGrid.TickColor = color; return this; }
    public GridBuilder TickColor(Color color) { _scaleGrid.TickColor = color.ToCssColorString(); return this; }
    public GridBuilder TickLength(int length) { _scaleGrid.TickLength = length; return this; }
    public GridBuilder TickWidth(int width) { _scaleGrid.TickWidth = width; return this; }
    public GridBuilder Z(int z) { _scaleGrid.Z = z; return this; }
}

public class ScaleBorderBuilder
{
    private readonly ScaleBorder _scaleBorder;

    internal ScaleBorderBuilder(Scale scale)
    {
        scale.Border = _scaleBorder = new ScaleBorder();
    }

    public ScaleBorderBuilder Display(bool display) { _scaleBorder.Display = display; return this; }
    public ScaleBorderBuilder Color(string color) { _scaleBorder.Color = color; return this; }
    public ScaleBorderBuilder Color(Color color) { _scaleBorder.Color = color.ToCssColorString(); return this; }
    public ScaleBorderBuilder Width(int width) { _scaleBorder.Width = width; return this; }
    public ScaleBorderBuilder Dash(params int[] dash) { _scaleBorder.Dash = dash; return this; }
    public ScaleBorderBuilder DashOffset(double dashOffset) { _scaleBorder.DashOffset = dashOffset; return this; }
    public ScaleBorderBuilder Z(int z) { _scaleBorder.Z = z; return this; }
}

public class ScaleTitleBuilder
{
    private readonly ScaleTitle _scaleTitle;

    internal ScaleTitleBuilder(Scale scale)
    {
        scale.Title = _scaleTitle = new ScaleTitle();
    }

    public ScaleTitleBuilder Display(bool display) { _scaleTitle.Display = display; return this; }
    public ScaleTitleBuilder Align(TitleAlign align) { _scaleTitle.Align = align; return this; }
    public ScaleTitleBuilder Text(string text) { _scaleTitle.Text = text; return this; }
    public ScaleTitleBuilder Text(params string[] text) { _scaleTitle.Text = text; return this; }
    public ScaleTitleBuilder Color(string color) { _scaleTitle.Color = color; return this; }
    public ScaleTitleBuilder Color(Color color) { _scaleTitle.Color = color.ToCssColorString(); return this; }
    public ScaleTitleBuilder Font(Action<FontBuilder> action)
    {
        _scaleTitle.Font = new ChartFont();
        action(new FontBuilder(_scaleTitle.Font));
        return this;
    }
    public ScaleTitleBuilder Padding(int padding) { _scaleTitle.Padding = new Padding(padding); return this; }
    public ScaleTitleBuilder Padding(Action<PaddingBuilder> action)
    {
        _scaleTitle.Padding = new Padding();
        action(new PaddingBuilder(_scaleTitle.Padding));
        return this;
    }
}

public class TicksBuilder
{
    private readonly Ticks _scaleTicks;

    internal TicksBuilder(Scale scale)
    {
        scale.Ticks = _scaleTicks = new Ticks();
    }

    public TicksBuilder BackdropColor(string color) { _scaleTicks.BackdropColor = color; return this; }
    public TicksBuilder BackdropColor(Color color) { _scaleTicks.BackdropColor = color.ToCssColorString(); return this; }
    public TicksBuilder BackdropPadding(int padding) { _scaleTicks.BackdropPadding = new Padding(padding); return this; }
    public TicksBuilder BackdropPadding(Action<PaddingBuilder> action)
    {
        _scaleTicks.BackdropPadding = new Padding();
        action(new PaddingBuilder(_scaleTicks.BackdropPadding));
        return this;
    }
    public TicksBuilder Callback(string callback) { _scaleTicks.Callback = callback; return this; }
    public TicksBuilder Display(bool display) { _scaleTicks.Display = display; return this; }
    public TicksBuilder Color(string color) { _scaleTicks.Color = color; return this; }
    public TicksBuilder Color(Color color) { _scaleTicks.Color = color.ToCssColorString(); return this; }
    public TicksBuilder Font(Action<FontBuilder> action)
    {
        _scaleTicks.Font = new ChartFont();
        action(new FontBuilder(_scaleTicks.Font));
        return this;
    }
    public TicksBuilder Major(bool enabled) { _scaleTicks.Major = new TicksMajor { Enabled = enabled }; return this; }
    public TicksBuilder Padding(int padding) { _scaleTicks.Padding = padding; return this; }
    public TicksBuilder ShowLabelBackdrop(bool show) { _scaleTicks.ShowLabelBackdrop = show; return this; }
    public TicksBuilder TextStrokeColor(string color) { _scaleTicks.TextStrokeColor = color; return this; }
    public TicksBuilder TextStrokeColor(Color color) { _scaleTicks.TextStrokeColor = color.ToCssColorString(); return this; }
    public TicksBuilder TextStrokeWidth(int width) { _scaleTicks.TextStrokeWidth = width; return this; }
    public TicksBuilder Z(int z) { _scaleTicks.Z = z; return this; }
    public TicksBuilder Align(TicksAlign align) { _scaleTicks.Align = align; return this; }
    public TicksBuilder CrossAlign(TicksCrossAlign align) { _scaleTicks.CrossAlign = align; return this; }
    public TicksBuilder SampleSize(int size) { _scaleTicks.SampleSize = size; return this; }
    public TicksBuilder AutoSkip(bool autoSkip) { _scaleTicks.AutoSkip = autoSkip; return this; }
    public TicksBuilder AutoSkipPadding(int padding) { _scaleTicks.AutoSkipPadding = padding; return this; }
    public TicksBuilder IncludeBounds(bool includeBounds) { _scaleTicks.IncludeBounds = includeBounds; return this; }
    public TicksBuilder LabelOffset(int offset) { _scaleTicks.LabelOffset = offset; return this; }
    public TicksBuilder MaxRotation(int maxRotation) { _scaleTicks.MaxRotation = maxRotation; return this; }
    public TicksBuilder MinRotation(int minRotation) { _scaleTicks.MinRotation = minRotation; return this; }
    public TicksBuilder Mirror(bool mirror) { _scaleTicks.Mirror = mirror; return this; }
    public TicksBuilder MaxTicksLimit(int maxTicksLimit) { _scaleTicks.MaxTicksLimit = maxTicksLimit; return this; }
}

public class ScaleCallbackBuilder
{
    private readonly Scale _scale;

    internal ScaleCallbackBuilder(Scale scale)
    {
        _scale = scale;
    }

    public ScaleCallbackBuilder BeforeUpdate(string functionName) { _scale.BeforeUpdate = functionName; return this; }
    public ScaleCallbackBuilder AfterUpdate(string functionName) { _scale.AfterUpdate = functionName; return this; }
    public ScaleCallbackBuilder BeforeSetDimensions(string functionName) { _scale.BeforeSetDimensions = functionName; return this; }
    public ScaleCallbackBuilder AfterSetDimensions(string functionName) { _scale.AfterSetDimensions = functionName; return this; }
    public ScaleCallbackBuilder BeforeDataLimits(string functionName) { _scale.BeforeDataLimits = functionName; return this; }
    public ScaleCallbackBuilder AfterDataLimits(string functionName) { _scale.AfterDataLimits = functionName; return this; }
    public ScaleCallbackBuilder BeforeBuildTicks(string functionName) { _scale.BeforeBuildTicks = functionName; return this; }
    public ScaleCallbackBuilder AfterBuildTicks(string functionName) { _scale.AfterBuildTicks = functionName; return this; }
    public ScaleCallbackBuilder BeforeTickToLabelConversion(string functionName) { _scale.BeforeTickToLabelConversion = functionName; return this; }
    public ScaleCallbackBuilder AfterTickToLabelConversion(string functionName) { _scale.AfterTickToLabelConversion = functionName; return this; }
    public ScaleCallbackBuilder BeforeCalculateLabelRotation(string functionName) { _scale.BeforeCalculateLabelRotation = functionName; return this; }
    public ScaleCallbackBuilder AfterCalculateLabelRotation(string functionName) { _scale.AfterCalculateLabelRotation = functionName; return this; }
    public ScaleCallbackBuilder BeforeFit(string functionName) { _scale.BeforeFit = functionName; return this; }
    public ScaleCallbackBuilder AfterFit(string functionName) { _scale.AfterFit = functionName; return this; }
}
