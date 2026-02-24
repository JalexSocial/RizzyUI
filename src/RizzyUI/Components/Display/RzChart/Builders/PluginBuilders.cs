
#pragma warning disable CS1591
namespace RizzyUI.Charts;

public class PluginsBuilder
{
    private readonly Plugins _plugins;

    internal PluginsBuilder(Plugins plugins)
    {
        _plugins = plugins;
    }

    public PluginsBuilder Title(Action<TitleBuilder> action)
    {
        _plugins.Title = new Title();
        action(new TitleBuilder(_plugins.Title));
        return this;
    }

    public PluginsBuilder Subtitle(Action<TitleBuilder> action)
    {
        _plugins.Subtitle = new Title();
        action(new TitleBuilder(_plugins.Subtitle));
        return this;
    }

    public PluginsBuilder Legend(Action<LegendBuilder> action)
    {
        _plugins.Legend = new Legend();
        action(new LegendBuilder(_plugins.Legend));
        return this;
    }

    public PluginsBuilder Tooltip(Action<TooltipBuilder> action)
    {
        _plugins.Tooltip = new ToolTip();
        action(new TooltipBuilder(_plugins.Tooltip));
        return this;
    }

    public PluginsBuilder Colors(Action<ColorsBuilder> action)
    {
        _plugins.Colors = new Colors();
        action(new ColorsBuilder(_plugins.Colors));
        return this;
    }

    public PluginsBuilder Decimation(Action<DecimationBuilder> action)
    {
        _plugins.Decimation = new Decimation();
        action(new DecimationBuilder(_plugins.Decimation));
        return this;
    }

    public PluginsBuilder Filler(Action<FillerBuilder> action)
    {
        _plugins.Filler = new Filler();
        action(new FillerBuilder(_plugins.Filler));
        return this;
    }
}

public class TitleBuilder
{
    private readonly Title _title;

    internal TitleBuilder(Title title)
    {
        _title = title;
    }

    public TitleBuilder Align(TitleAlign align) { _title.Align = align; return this; }
    public TitleBuilder Color(string color) { _title.Color = color; return this; }
    public TitleBuilder Color(Color color) { _title.Color = color.ToCssColorString(); return this; }
    public TitleBuilder Display(bool display) { _title.Display = display; return this; }
    public TitleBuilder FullSize(bool fullSize) { _title.FullSize = fullSize; return this; }
    public TitleBuilder Position(TitlePosition position) { _title.Position = position; return this; }
    public TitleBuilder Font(Action<FontBuilder> action)
    {
        _title.Font = new ChartFont();
        action(new FontBuilder(_title.Font));
        return this;
    }
    public TitleBuilder Padding(int padding) { _title.Padding = new Padding(padding); return this; }
    public TitleBuilder Padding(Action<PaddingBuilder> action)
    {
        _title.Padding = new Padding();
        action(new PaddingBuilder(_title.Padding));
        return this;
    }
    public TitleBuilder Text(string text) { _title.Text = text; return this; }
    public TitleBuilder Text(params string[] text) { _title.Text = text; return this; }
}

public class LegendBuilder
{
    private readonly Legend _legend;

    internal LegendBuilder(Legend legend)
    {
        _legend = legend;
    }

    public LegendBuilder Display(bool display) { _legend.Display = display; return this; }
    public LegendBuilder Position(LegendPosition position) { _legend.Position = position; return this; }
    public LegendBuilder Align(LegendAlign align) { _legend.Align = align; return this; }
    public LegendBuilder MaxHeight(int maxHeight) { _legend.MaxHeight = maxHeight; return this; }
    public LegendBuilder MaxWidth(int maxWidth) { _legend.MaxWidth = maxWidth; return this; }
    public LegendBuilder FullSize(bool fullSize) { _legend.FullSize = fullSize; return this; }
    public LegendBuilder OnClick(string onClick) { _legend.OnClick = onClick; return this; }
    public LegendBuilder OnHover(string onHover) { _legend.OnHover = onHover; return this; }
    public LegendBuilder OnLeave(string onLeave) { _legend.OnLeave = onLeave; return this; }
    public LegendBuilder Reverse(bool reverse) { _legend.Reverse = reverse; return this; }
    public LegendBuilder Labels(Action<LabelsBuilder> action)
    {
        _legend.Labels = new Labels();
        action(new LabelsBuilder(_legend.Labels));
        return this;
    }
    public LegendBuilder Rtl(bool rtl) { _legend.Rtl = rtl; return this; }
    public LegendBuilder TextDirection(string textDirection) { _legend.TextDirection = textDirection; return this; }
    public LegendBuilder Title(Action<LegendTitleBuilder> action)
    {
        _legend.Title = new LegendTitle();
        action(new LegendTitleBuilder(_legend.Title));
        return this;
    }
}

public class LabelsBuilder
{
    private readonly Labels _labels;

    internal LabelsBuilder(Labels labels)
    {
        _labels = labels;
    }

    public LabelsBuilder BoxWidth(int width) { _labels.BoxWidth = width; return this; }
    public LabelsBuilder BoxHeight(int height) { _labels.BoxHeight = height; return this; }
    public LabelsBuilder Color(string color) { _labels.Color = color; return this; }
    public LabelsBuilder Color(Color color) { _labels.Color = color.ToCssColorString(); return this; }
    public LabelsBuilder Font(Action<FontBuilder> action)
    {
        _labels.Font = new ChartFont();
        action(new FontBuilder(_labels.Font));
        return this;
    }
    public LabelsBuilder Padding(int padding) { _labels.Padding = padding; return this; }
    public LabelsBuilder GenerateLabels(string function) { _labels.GenerateLabels = function; return this; }
    public LabelsBuilder Filter(string function) { _labels.Filter = function; return this; }
    public LabelsBuilder Sort(string function) { _labels.Sort = function; return this; }
    public LabelsBuilder PointStyle(PointStyle pointStyle) { _labels.PointStyle = pointStyle; return this; }
    public LabelsBuilder TextAlign(TextAlign textAlign) { _labels.TextAlign = textAlign; return this; }
    public LabelsBuilder UsePointStyle(bool usePointStyle) { _labels.UsePointStyle = usePointStyle; return this; }
    public LabelsBuilder PointStyleWidth(int width) { _labels.PointStyleWidth = width; return this; }
    public LabelsBuilder UseBorderRadius(bool useBorderRadius) { _labels.UseBorderRadius = useBorderRadius; return this; }
    public LabelsBuilder BorderRadius(double borderRadius) { _labels.BorderRadius = borderRadius; return this; }
}

public class LegendTitleBuilder
{
    private readonly LegendTitle _legendTitle;

    internal LegendTitleBuilder(LegendTitle legendTitle)
    {
        _legendTitle = legendTitle;
    }

    public LegendTitleBuilder Color(string color) { _legendTitle.Color = color; return this; }
    public LegendTitleBuilder Color(Color color) { _legendTitle.Color = color.ToCssColorString(); return this; }
    public LegendTitleBuilder Display(bool display) { _legendTitle.Display = display; return this; }
    public LegendTitleBuilder Font(Action<FontBuilder> action)
    {
        _legendTitle.Font = new ChartFont();
        action(new FontBuilder(_legendTitle.Font));
        return this;
    }
    public LegendTitleBuilder Padding(int padding) { _legendTitle.Padding = new Padding(padding); return this; }
    public LegendTitleBuilder Padding(Action<PaddingBuilder> action)
    {
        _legendTitle.Padding = new Padding();
        action(new PaddingBuilder(_legendTitle.Padding));
        return this;
    }
    public LegendTitleBuilder Text(string text) { _legendTitle.Text = text; return this; }
}

public class TooltipBuilder
{
    private readonly ToolTip _toolTip;

    internal TooltipBuilder(ToolTip toolTip)
    {
        _toolTip = toolTip;
    }

    public TooltipBuilder Enabled(bool enabled) { _toolTip.Enabled = enabled; return this; }
    public TooltipBuilder External(string external) { _toolTip.External = external; return this; }
    public TooltipBuilder Mode(string mode) { _toolTip.Mode = mode; return this; }
    public TooltipBuilder Intersect(bool intersect) { _toolTip.Intersect = intersect; return this; }
    public TooltipBuilder Position(TooltipPosition position) { _toolTip.Position = position.ToString().ToLowerInvariant(); return this; }
    public TooltipBuilder Position(string position) { _toolTip.Position = position; return this; }
    public TooltipBuilder Callbacks(Action<CallbacksBuilder> action)
    {
        _toolTip.Callbacks = new Callbacks();
        action(new CallbacksBuilder(_toolTip.Callbacks));
        return this;
    }
    public TooltipBuilder ItemSort(string itemSort) { _toolTip.ItemSort = itemSort; return this; }
    public TooltipBuilder Filter(string filter) { _toolTip.Filter = filter; return this; }
    public TooltipBuilder BackgroundColor(string color) { _toolTip.BackgroundColor = color; return this; }
    public TooltipBuilder BackgroundColor(Color color) { _toolTip.BackgroundColor = color.ToCssColorString(); return this; }
    public TooltipBuilder TitleColor(string color) { _toolTip.TitleColor = color; return this; }
    public TooltipBuilder TitleColor(Color color) { _toolTip.TitleColor = color.ToCssColorString(); return this; }
    public TooltipBuilder TitleFont(Action<FontBuilder> action)
    {
        _toolTip.TitleFont = new ChartFont();
        action(new FontBuilder(_toolTip.TitleFont));
        return this;
    }
    public TooltipBuilder TitleAlign(TextAlign align) { _toolTip.TitleAlign = align; return this; }
    public TooltipBuilder TitleSpacing(int spacing) { _toolTip.TitleSpacing = spacing; return this; }
    public TooltipBuilder TitleMarginBottom(int marginBottom) { _toolTip.TitleMarginBottom = marginBottom; return this; }
    public TooltipBuilder BodyColor(string color) { _toolTip.BodyColor = color; return this; }
    public TooltipBuilder BodyColor(Color color) { _toolTip.BodyColor = color.ToCssColorString(); return this; }
    public TooltipBuilder BodyFont(Action<FontBuilder> action)
    {
        _toolTip.BodyFont = new ChartFont();
        action(new FontBuilder(_toolTip.BodyFont));
        return this;
    }
    public TooltipBuilder BodyAlign(TextAlign align) { _toolTip.BodyAlign = align; return this; }
    public TooltipBuilder BodySpacing(int spacing) { _toolTip.BodySpacing = spacing; return this; }
    public TooltipBuilder FooterColor(string color) { _toolTip.FooterColor = color; return this; }
    public TooltipBuilder FooterColor(Color color) { _toolTip.FooterColor = color.ToCssColorString(); return this; }
    public TooltipBuilder FooterFont(Action<FontBuilder> action)
    {
        _toolTip.FooterFont = new ChartFont();
        action(new FontBuilder(_toolTip.FooterFont));
        return this;
    }
    public TooltipBuilder FooterAlign(TextAlign align) { _toolTip.FooterAlign = align; return this; }
    public TooltipBuilder FooterSpacing(int spacing) { _toolTip.FooterSpacing = spacing; return this; }
    public TooltipBuilder FooterMarginTop(int margin) { _toolTip.FooterMarginTop = margin; return this; }
    public TooltipBuilder Padding(int padding) { _toolTip.Padding = new Padding(padding); return this; }
    public TooltipBuilder Padding(Action<PaddingBuilder> action)
    {
        _toolTip.Padding = new Padding();
        action(new PaddingBuilder(_toolTip.Padding));
        return this;
    }
    public TooltipBuilder CaretPadding(int padding) { _toolTip.CaretPadding = padding; return this; }
    public TooltipBuilder CaretSize(int size) { _toolTip.CaretSize = size; return this; }
    public TooltipBuilder CornerRadius(int radius) { _toolTip.CornerRadius = radius; return this; }
    public TooltipBuilder MultiKeyBackground(string color) { _toolTip.MultiKeyBackground = color; return this; }
    public TooltipBuilder MultiKeyBackground(Color color) { _toolTip.MultiKeyBackground = color.ToCssColorString(); return this; }
    public TooltipBuilder DisplayColors(bool displayColors) { _toolTip.DisplayColors = displayColors; return this; }
    public TooltipBuilder BoxWidth(int width) { _toolTip.BoxWidth = width; return this; }
    public TooltipBuilder BoxHeight(int height) { _toolTip.BoxHeight = height; return this; }
    public TooltipBuilder BoxPadding(int padding) { _toolTip.BoxPadding = padding; return this; }
    public TooltipBuilder UsePointStyle(bool usePointStyle) { _toolTip.UsePointStyle = usePointStyle; return this; }
    public TooltipBuilder BorderColor(string color) { _toolTip.BorderColor = color; return this; }
    public TooltipBuilder BorderColor(Color color) { _toolTip.BorderColor = color.ToCssColorString(); return this; }
    public TooltipBuilder BorderWidth(int width) { _toolTip.BorderWidth = width; return this; }
    public TooltipBuilder Rtl(bool rtl) { _toolTip.Rtl = rtl; return this; }
    public TooltipBuilder TextDirection(string direction) { _toolTip.TextDirection = direction; return this; }
    public TooltipBuilder XAlign(string align) { _toolTip.XAlign = align; return this; }
    public TooltipBuilder YAlign(string align) { _toolTip.YAlign = align; return this; }
}

public class CallbacksBuilder
{
    private readonly Callbacks _callbacks;

    internal CallbacksBuilder(Callbacks callbacks)
    {
        _callbacks = callbacks;
    }

    public CallbacksBuilder BeforeTitle(string functionName) { _callbacks.BeforeTitle = functionName; return this; }
    public CallbacksBuilder Title(string functionName) { _callbacks.Title = functionName; return this; }
    public CallbacksBuilder AfterTitle(string functionName) { _callbacks.AfterTitle = functionName; return this; }
    public CallbacksBuilder BeforeBody(string functionName) { _callbacks.BeforeBody = functionName; return this; }
    public CallbacksBuilder BeforeLabel(string functionName) { _callbacks.BeforeLabel = functionName; return this; }
    public CallbacksBuilder Label(string functionName) { _callbacks.Label = functionName; return this; }
    public CallbacksBuilder LabelColor(string functionName) { _callbacks.LabelColor = functionName; return this; }
    public CallbacksBuilder LabelTextColor(string functionName) { _callbacks.LabelTextColor = functionName; return this; }
    public CallbacksBuilder LabelPointStyle(string functionName) { _callbacks.LabelPointStyle = functionName; return this; }
    public CallbacksBuilder AfterLabel(string functionName) { _callbacks.AfterLabel = functionName; return this; }
    public CallbacksBuilder AfterBody(string functionName) { _callbacks.AfterBody = functionName; return this; }
    public CallbacksBuilder BeforeFooter(string functionName) { _callbacks.BeforeFooter = functionName; return this; }
    public CallbacksBuilder Footer(string functionName) { _callbacks.Footer = functionName; return this; }
    public CallbacksBuilder AfterFooter(string functionName) { _callbacks.AfterFooter = functionName; return this; }
}

public class ColorsBuilder
{
    private readonly Colors _colors;

    internal ColorsBuilder(Colors colors)
    {
        _colors = colors;
    }

    public ColorsBuilder Enabled(bool enabled) { _colors.Enabled = enabled; return this; }
    public ColorsBuilder ForceOverride(bool forceOverride) { _colors.ForceOverride = forceOverride; return this; }
}

public class DecimationBuilder
{
    private readonly Decimation _decimation;

    internal DecimationBuilder(Decimation decimation)
    {
        _decimation = decimation;
    }

    public DecimationBuilder Enabled(bool enabled) { _decimation.Enabled = enabled; return this; }
    public DecimationBuilder Algorithm(Algorithm algorithm) { _decimation.Algorithm = algorithm; return this; }
    public DecimationBuilder Samples(int samples) { _decimation.Samples = samples; return this; }
    public DecimationBuilder Threshold(int threshold) { _decimation.Threshold = threshold; return this; }
}

public class FillerBuilder
{
    private readonly Filler _filler;

    internal FillerBuilder(Filler filler)
    {
        _filler = filler;
    }

    public FillerBuilder Propagate(bool propagate) { _filler.Propagate = propagate; return this; }
    public FillerBuilder DrawTime(DrawTime drawTime) { _filler.DrawTime = drawTime; return this; }
}