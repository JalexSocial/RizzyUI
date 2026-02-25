
namespace RizzyUI.Charts;

/// <summary>
/// Builder for configuring Chart.js plugins like Legend, Title, and Tooltips.
/// </summary>
public class PluginsBuilder
{
    private readonly Plugins _plugins;

    internal PluginsBuilder(Plugins plugins)
    {
        _plugins = plugins;
    }

    /// <summary>
    /// Configures the main chart title.
    /// </summary>
    public PluginsBuilder Title(Action<TitleBuilder> action)
    {
        _plugins.Title = new Title();
        action(new TitleBuilder(_plugins.Title));
        return this;
    }

    /// <summary>
    /// Configures the secondary chart subtitle.
    /// </summary>
    public PluginsBuilder Subtitle(Action<TitleBuilder> action)
    {
        _plugins.Subtitle = new Title();
        action(new TitleBuilder(_plugins.Subtitle));
        return this;
    }

    /// <summary>
    /// Configures the chart legend, which identifies datasets.
    /// </summary>
    public PluginsBuilder Legend(Action<LegendBuilder> action)
    {
        _plugins.Legend = new Legend();
        action(new LegendBuilder(_plugins.Legend));
        return this;
    }

    /// <summary>
    /// Configures tooltips that appear when hovering over data elements.
    /// </summary>
    public PluginsBuilder Tooltip(Action<TooltipBuilder> action)
    {
        _plugins.Tooltip = new ToolTip();
        action(new TooltipBuilder(_plugins.Tooltip));
        return this;
    }

    /// <summary>
    /// Configures the built-in Colors plugin for automatic color assignment.
    /// </summary>
    public PluginsBuilder Colors(Action<ColorsBuilder> action)
    {
        _plugins.Colors = new Colors();
        action(new ColorsBuilder(_plugins.Colors));
        return this;
    }

    /// <summary>
    /// Configures data decimation to improve performance with large datasets.
    /// </summary>
    public PluginsBuilder Decimation(Action<DecimationBuilder> action)
    {
        _plugins.Decimation = new Decimation();
        action(new DecimationBuilder(_plugins.Decimation));
        return this;
    }

    /// <summary>
    /// Configures area fill propagation and drawing behavior.
    /// </summary>
    public PluginsBuilder Filler(Action<FillerBuilder> action)
    {
        _plugins.Filler = new Filler();
        action(new FillerBuilder(_plugins.Filler));
        return this;
    }
}

/// <summary>
/// Builder for chart titles and subtitles.
/// </summary>
public class TitleBuilder
{
    private readonly Title _title;

    internal TitleBuilder(Title title)
    {
        _title = title;
    }

    /// <summary> Alignment of the title ('start', 'center', 'end'). </summary>
    public TitleBuilder Align(TitleAlign align) { _title.Align = align; return this; }
    /// <summary> Color of the title text. </summary>
    public TitleBuilder Color(string color) { _title.Color = color; return this; }
    /// <summary> Color of the title text using a Color token. </summary>
    public TitleBuilder Color(Color color) { _title.Color = color.ToCssColorString(); return this; }
    /// <summary> If true, the title is displayed. </summary>
    public TitleBuilder Display(bool display) { _title.Display = display; return this; }
    /// <summary> If true, the title box takes the full width/height of the canvas. </summary>
    public TitleBuilder FullSize(bool fullSize) { _title.FullSize = fullSize; return this; }
    /// <summary> Position of the title relative to the chart area. </summary>
    public TitleBuilder Position(TitlePosition position) { _title.Position = position; return this; }
    /// <summary> Configures the font for the title. </summary>
    public TitleBuilder Font(Action<FontBuilder> action)
    {
        _title.Font = new ChartFont();
        action(new FontBuilder(_title.Font));
        return this;
    }
    /// <summary> Uniform padding around the title in pixels. </summary>
    public TitleBuilder Padding(int padding) { _title.Padding = new Padding(padding); return this; }
    /// <summary> Granular padding around the title. </summary>
    public TitleBuilder Padding(Action<PaddingBuilder> action)
    {
        _title.Padding = new Padding();
        action(new PaddingBuilder(_title.Padding));
        return this;
    }
    /// <summary> The text for the title. </summary>
    public TitleBuilder Text(string text) { _title.Text = text; return this; }
    /// <summary> Multiline text for the title. </summary>
    public TitleBuilder Text(params string[] text) { _title.Text = text; return this; }
}

/// <summary>
/// Builder for configuring the chart legend.
/// </summary>
public class LegendBuilder
{
    private readonly Legend _legend;

    internal LegendBuilder(Legend legend)
    {
        _legend = legend;
    }

    /// <summary> If true, the legend is displayed. </summary>
    public LegendBuilder Display(bool display) { _legend.Display = display; return this; }
    /// <summary> Position of the legend ('top', 'left', 'bottom', 'right', 'chartArea'). </summary>
    public LegendBuilder Position(LegendPosition position) { _legend.Position = position; return this; }
    /// <summary> Alignment of the legend ('start', 'center', 'end'). </summary>
    public LegendBuilder Align(LegendAlign align) { _legend.Align = align; return this; }
    /// <summary> Maximum height of the legend box in pixels. </summary>
    public LegendBuilder MaxHeight(int maxHeight) { _legend.MaxHeight = maxHeight; return this; }
    /// <summary> Maximum width of the legend box in pixels. </summary>
    public LegendBuilder MaxWidth(int maxWidth) { _legend.MaxWidth = maxWidth; return this; }
    /// <summary> If true, the legend box takes the full width/height of the canvas. </summary>
    public LegendBuilder FullSize(bool fullSize) { _legend.FullSize = fullSize; return this; }
    /// <summary> JavaScript function name called when a click event is registered on a label. </summary>
    public LegendBuilder OnClick(string onClick) { _legend.OnClick = onClick; return this; }
    /// <summary> JavaScript function name called when a mousemove event is registered over a label. </summary>
    public LegendBuilder OnHover(string onHover) { _legend.OnHover = onHover; return this; }
    /// <summary> JavaScript function name called when a mousemove event leaves a label. </summary>
    public LegendBuilder OnLeave(string onLeave) { _legend.OnLeave = onLeave; return this; }
    /// <summary> Legend will show datasets in reverse order. </summary>
    public LegendBuilder Reverse(bool reverse) { _legend.Reverse = reverse; return this; }
    /// <summary> Configures the styling of labels within the legend. </summary>
    public LegendBuilder Labels(Action<LabelsBuilder> action)
    {
        _legend.Labels = new Labels();
        action(new LabelsBuilder(_legend.Labels));
        return this;
    }
    /// <summary> Render the legend from right to left. </summary>
    public LegendBuilder Rtl(bool rtl) { _legend.Rtl = rtl; return this; }
    /// <summary> Forces a specific text direction ('rtl' or 'ltr'). </summary>
    public LegendBuilder TextDirection(string textDirection) { _legend.TextDirection = textDirection; return this; }
    /// <summary> Configures an optional title for the legend box. </summary>
    public LegendBuilder Title(Action<LegendTitleBuilder> action)
    {
        _legend.Title = new LegendTitle();
        action(new LegendTitleBuilder(_legend.Title));
        return this;
    }
}

/// <summary>
/// Builder for configuring legend labels.
/// </summary>
public class LabelsBuilder
{
    private readonly Labels _labels;

    internal LabelsBuilder(Labels labels)
    {
        _labels = labels;
    }

    /// <summary> Width of the colored box identifying the dataset. </summary>
    public LabelsBuilder BoxWidth(int width) { _labels.BoxWidth = width; return this; }
    /// <summary> Height of the colored box. Defaults to font size. </summary>
    public LabelsBuilder BoxHeight(int height) { _labels.BoxHeight = height; return this; }
    /// <summary> Color of the label text and strikethrough. </summary>
    public LabelsBuilder Color(string color) { _labels.Color = color; return this; }
    /// <summary> Color using a <see cref="RizzyUI.Color"/> token. </summary>
    public LabelsBuilder Color(Color color) { _labels.Color = color.ToCssColorString(); return this; }
    /// <summary> Configures the font for the labels. </summary>
    public LabelsBuilder Font(Action<FontBuilder> action)
    {
        _labels.Font = new ChartFont();
        action(new FontBuilder(_labels.Font));
        return this;
    }
    /// <summary> Padding between rows of colored boxes. </summary>
    public LabelsBuilder Padding(int padding) { _labels.Padding = padding; return this; }
    /// <summary> JavaScript function name to generate custom legend items. </summary>
    public LabelsBuilder GenerateLabels(string function) { _labels.GenerateLabels = function; return this; }
    /// <summary> JavaScript function name to filter items out of the legend. </summary>
    public LabelsBuilder Filter(string function) { _labels.Filter = function; return this; }
    /// <summary> JavaScript function name to sort legend items. </summary>
    public LabelsBuilder Sort(string function) { _labels.Sort = function; return this; }
    /// <summary> Shape of the colored box identifying the dataset. </summary>
    public LabelsBuilder PointStyle(PointStyle pointStyle) { _labels.PointStyle = pointStyle; return this; }
    /// <summary> Text alignment ('left', 'center', 'right'). </summary>
    public LabelsBuilder TextAlign(TextAlign textAlign) { _labels.TextAlign = textAlign; return this; }
    /// <summary> Label style will match the point style of the dataset. </summary>
    public LabelsBuilder UsePointStyle(bool usePointStyle) { _labels.UsePointStyle = usePointStyle; return this; }
    /// <summary> Explicit width of the point style in the legend. </summary>
    public LabelsBuilder PointStyleWidth(int width) { _labels.PointStyleWidth = width; return this; }
    /// <summary> Label border radius will match the dataset element border radius. </summary>
    public LabelsBuilder UseBorderRadius(bool useBorderRadius) { _labels.UseBorderRadius = useBorderRadius; return this; }
    /// <summary> Explicit border radius for the legend colored box. </summary>
    public LabelsBuilder BorderRadius(double borderRadius) { _labels.BorderRadius = borderRadius; return this; }
}

/// <summary>
/// Builder for configuring the tooltip appearance and behavior.
/// </summary>
public class TooltipBuilder
{
    private readonly ToolTip _toolTip;

    internal TooltipBuilder(ToolTip toolTip)
    {
        _toolTip = toolTip;
    }

    /// <summary> Enables or disables on-canvas tooltips. </summary>
    public TooltipBuilder Enabled(bool enabled) { _toolTip.Enabled = enabled; return this; }
    /// <summary> JavaScript function name for rendering a completely custom HTML tooltip. </summary>
    public TooltipBuilder External(string external) { _toolTip.External = external; return this; }
    /// <summary> Interaction mode (e.g. 'index', 'point'). </summary>
    public TooltipBuilder Mode(string mode) { _toolTip.Mode = mode; return this; }
    /// <summary> If true, tooltip only appears when the mouse intersects an element. </summary>
    public TooltipBuilder Intersect(bool intersect) { _toolTip.Intersect = intersect; return this; }
    /// <summary> Positioning mode ('average', 'nearest'). </summary>
    public TooltipBuilder Position(TooltipPosition position) { _toolTip.Position = position.ToString().ToLowerInvariant(); return this; }
    /// <summary> Positioning mode using a string (allows custom positioner names). </summary>
    public TooltipBuilder Position(string position) { _toolTip.Position = position; return this; }
    /// <summary> Configures callback functions to provide custom text in the tooltip sections. </summary>
    public TooltipBuilder Callbacks(Action<CallbacksBuilder> action)
    {
        _toolTip.Callbacks = new Callbacks();
        action(new CallbacksBuilder(_toolTip.Callbacks));
        return this;
    }
    /// <summary> JavaScript function name to sort tooltip items. </summary>
    public TooltipBuilder ItemSort(string itemSort) { _toolTip.ItemSort = itemSort; return this; }
    /// <summary> JavaScript function name to filter tooltip items. </summary>
    public TooltipBuilder Filter(string filter) { _toolTip.Filter = filter; return this; }
    /// <summary> Background color of the tooltip box. </summary>
    public TooltipBuilder BackgroundColor(string color) { _toolTip.BackgroundColor = color; return this; }
    /// <summary> Background color using a <see cref="Color"/> token. </summary>
    public TooltipBuilder BackgroundColor(Color color) { _toolTip.BackgroundColor = color.ToCssColorString(); return this; }
    /// <summary> Color of the title text. </summary>
    public TooltipBuilder TitleColor(string color) { _toolTip.TitleColor = color; return this; }
    /// <summary> Title color using a <see cref="Color"/> token. </summary>
    public TooltipBuilder TitleColor(Color color) { _toolTip.TitleColor = color.ToCssColorString(); return this; }
    /// <summary> Configures the font for the title. </summary>
    public TooltipBuilder TitleFont(Action<FontBuilder> action)
    {
        _toolTip.TitleFont = new ChartFont();
        action(new FontBuilder(_toolTip.TitleFont));
        return this;
    }
    /// <summary> Title text alignment. </summary>
    public TooltipBuilder TitleAlign(TextAlign align) { _toolTip.TitleAlign = align; return this; }
    /// <summary> Spacing to add between title lines. </summary>
    public TooltipBuilder TitleSpacing(int spacing) { _toolTip.TitleSpacing = spacing; return this; }
    /// <summary> Margin to add on the bottom of the title section. </summary>
    public TooltipBuilder TitleMarginBottom(int marginBottom) { _toolTip.TitleMarginBottom = marginBottom; return this; }
    /// <summary> Color of the body text. </summary>
    public TooltipBuilder BodyColor(string color) { _toolTip.BodyColor = color; return this; }
    /// <summary> Body color using a <see cref="Color"/> token. </summary>
    public TooltipBuilder BodyColor(Color color) { _toolTip.BodyColor = color.ToCssColorString(); return this; }
    /// <summary> Configures the font for the body. </summary>
    public TooltipBuilder BodyFont(Action<FontBuilder> action)
    {
        _toolTip.BodyFont = new ChartFont();
        action(new FontBuilder(_toolTip.BodyFont));
        return this;
    }
    /// <summary> Body text alignment. </summary>
    public TooltipBuilder BodyAlign(TextAlign align) { _toolTip.BodyAlign = align; return this; }
    /// <summary> Spacing to add between each tooltip item. </summary>
    public TooltipBuilder BodySpacing(int spacing) { _toolTip.BodySpacing = spacing; return this; }
    /// <summary> Color of the footer text. </summary>
    public TooltipBuilder FooterColor(string color) { _toolTip.FooterColor = color; return this; }
    /// <summary> Footer color using a <see cref="Color"/> token. </summary>
    public TooltipBuilder FooterColor(Color color) { _toolTip.FooterColor = color.ToCssColorString(); return this; }
    /// <summary> Configures the font for the footer. </summary>
    public TooltipBuilder FooterFont(Action<FontBuilder> action)
    {
        _toolTip.FooterFont = new ChartFont();
        action(new FontBuilder(_toolTip.FooterFont));
        return this;
    }
    /// <summary> Footer text alignment. </summary>
    public TooltipBuilder FooterAlign(TextAlign align) { _toolTip.FooterAlign = align; return this; }
    /// <summary> Spacing to add between footer lines. </summary>
    public TooltipBuilder FooterSpacing(int spacing) { _toolTip.FooterSpacing = spacing; return this; }
    /// <summary> Margin to add before drawing the footer. </summary>
    public TooltipBuilder FooterMarginTop(int margin) { _toolTip.FooterMarginTop = margin; return this; }
    /// <summary> Uniform padding inside the tooltip box. </summary>
    public TooltipBuilder Padding(int padding) { _toolTip.Padding = new Padding(padding); return this; }
    /// <summary> Granular padding inside the tooltip box. </summary>
    public TooltipBuilder Padding(Action<PaddingBuilder> action)
    {
        _toolTip.Padding = new Padding();
        action(new PaddingBuilder(_toolTip.Padding));
        return this;
    }
    /// <summary> Distance to move the end of the tooltip arrow away from the tooltip point. </summary>
    public TooltipBuilder CaretPadding(int padding) { _toolTip.CaretPadding = padding; return this; }
    /// <summary> Size of the tooltip arrow in pixels. </summary>
    public TooltipBuilder CaretSize(int size) { _toolTip.CaretSize = size; return this; }
    /// <summary> Radius of tooltip box corner curves. </summary>
    public TooltipBuilder CornerRadius(int radius) { _toolTip.CornerRadius = radius; return this; }
    /// <summary> Color to draw behind colored boxes when multiple items are in the tooltip. </summary>
    public TooltipBuilder MultiKeyBackground(string color) { _toolTip.MultiKeyBackground = color; return this; }
    /// <summary> Multi-key color using a <see cref="Color"/> token. </summary>
    public TooltipBuilder MultiKeyBackground(Color color) { _toolTip.MultiKeyBackground = color.ToCssColorString(); return this; }
    /// <summary> If true, color boxes are shown in the tooltip. </summary>
    public TooltipBuilder DisplayColors(bool displayColors) { _toolTip.DisplayColors = displayColors; return this; }
    /// <summary> Width of the colored box identifier. </summary>
    public TooltipBuilder BoxWidth(int width) { _toolTip.BoxWidth = width; return this; }
    /// <summary> Height of the colored box identifier. </summary>
    public TooltipBuilder BoxHeight(int height) { _toolTip.BoxHeight = height; return this; }
    /// <summary> Padding between the colored box and the text. </summary>
    public TooltipBuilder BoxPadding(int padding) { _toolTip.BoxPadding = padding; return this; }
    /// <summary> Use the dataset's point style shape instead of a colored square. </summary>
    public TooltipBuilder UsePointStyle(bool usePointStyle) { _toolTip.UsePointStyle = usePointStyle; return this; }
    /// <summary> Color of the tooltip box border. </summary>
    public TooltipBuilder BorderColor(string color) { _toolTip.BorderColor = color; return this; }
    /// <summary> Border color using a <see cref="Color"/> token. </summary>
    public TooltipBuilder BorderColor(Color color) { _toolTip.BorderColor = color.ToCssColorString(); return this; }
    /// <summary> Size of the tooltip box border. </summary>
    public TooltipBuilder BorderWidth(int width) { _toolTip.BorderWidth = width; return this; }
    /// <summary> Render the tooltip from right to left. </summary>
    public TooltipBuilder Rtl(bool rtl) { _toolTip.Rtl = rtl; return this; }
    /// <summary> Forces a specific text direction. </summary>
    public TooltipBuilder TextDirection(string direction) { _toolTip.TextDirection = direction; return this; }
    /// <summary> Forced alignment of the tooltip caret in X direction ('left', 'center', 'right'). </summary>
    public TooltipBuilder XAlign(string align) { _toolTip.XAlign = align; return this; }
    /// <summary> Forced alignment of the tooltip caret in Y direction ('top', 'center', 'bottom'). </summary>
    public TooltipBuilder YAlign(string align) { _toolTip.YAlign = align; return this; }
}

/// <summary>
/// Builder for configuring tooltip callback functions to customize text content.
/// </summary>
public class CallbacksBuilder
{
    private readonly Callbacks _callbacks;

    internal CallbacksBuilder(Callbacks callbacks)
    {
        _callbacks = callbacks;
    }

    /// <summary> Text to render before the title. </summary>
    public CallbacksBuilder BeforeTitle(string functionName) { _callbacks.BeforeTitle = functionName; return this; }
    /// <summary> Text to render as the title. </summary>
    public CallbacksBuilder Title(string functionName) { _callbacks.Title = functionName; return this; }
    /// <summary> Text to render after the title. </summary>
    public CallbacksBuilder AfterTitle(string functionName) { _callbacks.AfterTitle = functionName; return this; }
    /// <summary> Text to render before the body section. </summary>
    public CallbacksBuilder BeforeBody(string functionName) { _callbacks.BeforeBody = functionName; return this; }
    /// <summary> Text to render before an individual label. </summary>
    public CallbacksBuilder BeforeLabel(string functionName) { _callbacks.BeforeLabel = functionName; return this; }
    /// <summary> Text to render for an individual item. </summary>
    public CallbacksBuilder Label(string functionName) { _callbacks.Label = functionName; return this; }
    /// <summary> Function to return colors for the tooltip box. </summary>
    public CallbacksBuilder LabelColor(string functionName) { _callbacks.LabelColor = functionName; return this; }
    /// <summary> Function to return the text color for the label. </summary>
    public CallbacksBuilder LabelTextColor(string functionName) { _callbacks.LabelTextColor = functionName; return this; }
    /// <summary> Function to return the point style for the item. </summary>
    public CallbacksBuilder LabelPointStyle(string functionName) { _callbacks.LabelPointStyle = functionName; return this; }
    /// <summary> Text to render after an individual label. </summary>
    public CallbacksBuilder AfterLabel(string functionName) { _callbacks.AfterLabel = functionName; return this; }
    /// <summary> Text to render after the body section. </summary>
    public CallbacksBuilder AfterBody(string functionName) { _callbacks.AfterBody = functionName; return this; }
    /// <summary> Text to render before the footer. </summary>
    public CallbacksBuilder BeforeFooter(string functionName) { _callbacks.BeforeFooter = functionName; return this; }
    /// <summary> Text to render as the footer. </summary>
    public CallbacksBuilder Footer(string functionName) { _callbacks.Footer = functionName; return this; }
    /// <summary> Text to render after the footer. </summary>
    public CallbacksBuilder AfterFooter(string functionName) { _callbacks.AfterFooter = functionName; return this; }
}

/// <summary>
/// Builder for configuring data decimation (data downsampling).
/// </summary>
public class DecimationBuilder
{
    private readonly Decimation _decimation;

    internal DecimationBuilder(Decimation decimation)
    {
        _decimation = decimation;
    }

    /// <summary> Enables or disables decimation. </summary>
    public DecimationBuilder Enabled(bool enabled) { _decimation.Enabled = enabled; return this; }
    /// <summary> Decimation algorithm to use ('lttb', 'min-max'). </summary>
    public DecimationBuilder Algorithm(Algorithm algorithm) { _decimation.Algorithm = algorithm; return this; }
    /// <summary> Number of samples in the output dataset for 'lttb'. </summary>
    public DecimationBuilder Samples(int samples) { _decimation.Samples = samples; return this; }
    /// <summary> Point count at which decimation is triggered. </summary>
    public DecimationBuilder Threshold(int threshold) { _decimation.Threshold = threshold; return this; }
}

/// <summary>
/// Provides a fluent API for configuring the built-in Colors plugin in Chart.js.
/// The Colors plugin automatically cycles through a default color palette for datasets.
/// </summary>
public class ColorsBuilder
{
    private readonly Colors _colors;

    internal ColorsBuilder(Colors colors)
    {
        _colors = colors;
    }

    /// <summary>
    /// Sets whether the colors plugin is enabled. 
    /// When using the UMD version of Chart.js, this plugin is enabled by default.
    /// </summary>
    /// <param name="enabled">True to enable automatic coloring, false to disable.</param>
    /// <returns>The builder instance for chaining.</returns>
    public ColorsBuilder Enabled(bool enabled) { _colors.Enabled = enabled; return this; }

    /// <summary>
    /// Sets whether the colors plugin should always override existing dataset colors.
    /// This is particularly useful for dynamic datasets added at runtime where you want 
    /// the plugin to manage the palette regardless of initial settings.
    /// </summary>
    /// <param name="forceOverride">True to force the plugin to always color datasets.</param>
    /// <returns>The builder instance for chaining.</returns>
    public ColorsBuilder ForceOverride(bool forceOverride) { _colors.ForceOverride = forceOverride; return this; }
}

/// <summary>
/// Provides a fluent API for configuring the Filler plugin in Chart.js.
/// The Filler plugin is used by line and radar charts to create area charts by filling the space
/// between datasets or between a dataset and a boundary.
/// </summary>
public class FillerBuilder
{
    private readonly Filler _filler;

    internal FillerBuilder(Filler filler)
    {
        _filler = filler;
    }

    /// <summary>
    /// Sets whether the fill area should be recursively extended to the next visible target 
    /// if the current target dataset is hidden.
    /// </summary>
    /// <param name="propagate">True to enable fill propagation, false to disable.</param>
    /// <returns>The builder instance for chaining.</returns>
    public FillerBuilder Propagate(bool propagate) { _filler.Propagate = propagate; return this; }

    /// <summary>
    /// Sets the draw time for the filler plugin, determining when the fill is rendered 
    /// relative to other chart elements.
    /// </summary>
    /// <param name="drawTime">The point in the render cycle to draw the fill.</param>
    /// <returns>The builder instance for chaining.</returns>
    public FillerBuilder DrawTime(DrawTime drawTime) { _filler.DrawTime = drawTime; return this; }
}

/// <summary>
/// Provides a fluent API for configuring the title section of the chart legend.
/// </summary>
public class LegendTitleBuilder
{
    private readonly LegendTitle _legendTitle;

    internal LegendTitleBuilder(LegendTitle legendTitle)
    {
        _legendTitle = legendTitle;
    }

    /// <summary>
    /// Sets the color of the legend title text using a CSS color string.
    /// </summary>
    /// <param name="color">A valid CSS color string (e.g., "hex", "rgb", "hsl").</param>
    /// <returns>The builder instance for chaining.</returns>
    public LegendTitleBuilder Color(string color) { _legendTitle.Color = color; return this; }

    /// <summary>
    /// Sets the color of the legend title text using a RizzyUI <see cref="RizzyUI.Color"/> object.
    /// </summary>
    /// <param name="color">The color to apply to the title text.</param>
    /// <returns>The builder instance for chaining.</returns>
    public LegendTitleBuilder Color(Color color) { _legendTitle.Color = color.ToCssColorString(); return this; }

    /// <summary>
    /// Sets whether the legend title is displayed.
    /// </summary>
    /// <param name="display">True to show the title, false to hide it.</param>
    /// <returns>The builder instance for chaining.</returns>
    public LegendTitleBuilder Display(bool display) { _legendTitle.Display = display; return this; }

    /// <summary>
    /// Configures the font properties for the legend title text.
    /// </summary>
    /// <param name="action">A delegate to configure the font using a <see cref="FontBuilder"/>.</param>
    /// <returns>The builder instance for chaining.</returns>
    public LegendTitleBuilder Font(Action<FontBuilder> action)
    {
        _legendTitle.Font = new ChartFont();
        action(new FontBuilder(_legendTitle.Font));
        return this;
    }

    /// <summary>
    /// Sets uniform padding in pixels around the legend title.
    /// </summary>
    /// <param name="padding">The number of pixels to apply as padding on all sides.</param>
    /// <returns>The builder instance for chaining.</returns>
    public LegendTitleBuilder Padding(int padding) { _legendTitle.Padding = new Padding(padding); return this; }

    /// <summary>
    /// Configures detailed padding for the legend title.
    /// </summary>
    /// <param name="action">A delegate to configure individual sides using a <see cref="PaddingBuilder"/>.</param>
    /// <returns>The builder instance for chaining.</returns>
    public LegendTitleBuilder Padding(Action<PaddingBuilder> action)
    {
        _legendTitle.Padding = new Padding();
        action(new PaddingBuilder(_legendTitle.Padding));
        return this;
    }

    /// <summary>
    /// Sets the text string to be displayed as the legend title.
    /// </summary>
    /// <param name="text">The title text.</param>
    /// <returns>The builder instance for chaining.</returns>
    public LegendTitleBuilder Text(string text) { _legendTitle.Text = text; return this; }
}