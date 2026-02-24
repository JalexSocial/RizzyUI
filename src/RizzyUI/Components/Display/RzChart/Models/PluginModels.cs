
namespace RizzyUI.Charts;

/// <summary>
/// Container for various Chart.js plugin configurations.
/// </summary>
public class Plugins
{
    /// <summary> Dataset legend. </summary>
    public Legend? Legend { get; set; }
    /// <summary> Main title. </summary>
    public Title? Title { get; set; }
    /// <summary> Secondary subtitle. </summary>
    public Title? Subtitle { get; set; }
    /// <summary> Hover tooltips. </summary>
    public ToolTip? Tooltip { get; set; }
    /// <summary> Automatic color palette. </summary>
    public Colors? Colors { get; set; }
    /// <summary> Data downsampling. </summary>
    public Decimation? Decimation { get; set; }
    /// <summary> Area fill configuration. </summary>
    public Filler? Filler { get; set; }
}

/// <summary>
/// Built-in colors plugin settings.
/// </summary>
public class Colors
{
    /// <summary> If true, automatic color assignment is enabled. </summary>
    public bool? Enabled { get; set; }
    /// <summary> If true, overrides any colors already defined on the dataset. </summary>
    public bool? ForceOverride { get; set; }
}

/// <summary>
/// Built-in decimation plugin settings.
/// </summary>
public class Decimation
{
    /// <summary> If true, decimation is enabled. </summary>
    public bool? Enabled { get; set; }
    /// <summary> Algorithm type ('lttb', 'min-max'). </summary>
    public Algorithm? Algorithm { get; set; }
    /// <summary> Max number of samples for LTTB. </summary>
    public int? Samples { get; set; }
    /// <summary> Point count threshold for decimation. </summary>
    public int? Threshold { get; set; }
}

/// <summary>
/// Built-in filler plugin settings.
/// </summary>
public class Filler
{
    /// <summary> If true, fill area will be recursively extended to the visible target. </summary>
    public bool? Propagate { get; set; }
    /// <summary> Phase of the cycle to draw the fill. </summary>
    public DrawTime? DrawTime { get; set; }
}

/// <summary>
/// Configuration for title and subtitle elements.
/// </summary>
public class Title
{
    /// <summary> Text alignment. </summary>
    public TitleAlign? Align { get; set; }
    /// <summary> Text color. </summary>
    public string? Color { get; set; }
    /// <summary> If true, title is visible. </summary>
    public bool? Display { get; set; }
    /// <summary> If true, title takes full canvas width/height. </summary>
    public bool? FullSize { get; set; }
    /// <summary> Edge position. </summary>
    public TitlePosition? Position { get; set; }
    /// <summary> Text font style. </summary>
    public ChartFont? Font { get; set; }
    /// <summary> Title padding. </summary>
    public Padding? Padding { get; set; }
    /// <summary> Title text content. </summary>
    public object? Text { get; set; }
}

/// <summary>
/// Settings for the title of the legend box.
/// </summary>
public class LegendTitle
{
    public string? Color { get; set; }
    public bool? Display { get; set; }
    public ChartFont? Font { get; set; }
    public Padding? Padding { get; set; }
    public string? Text { get; set; }
}

/// <summary>
/// Configuration for labels within the legend.
/// </summary>
public class Labels
{
    /// <summary> Width of identifying colored box. </summary>
    public int? BoxWidth { get; set; }
    /// <summary> Height of identifying colored box. </summary>
    public int? BoxHeight { get; set; }
    /// <summary> Text color. </summary>
    public string? Color { get; set; }
    /// <summary> Font style. </summary>
    public ChartFont? Font { get; set; }
    /// <summary> Padding between rows. </summary>
    public int? Padding { get; set; }
    /// <summary> Custom label generation function. </summary>
    public string? GenerateLabels { get; set; }
    /// <summary> Label filtering function. </summary>
    public string? Filter { get; set; }
    /// <summary> Label sorting function. </summary>
    public string? Sort { get; set; }
    /// <summary> Marker shape style. </summary>
    public PointStyle? PointStyle { get; set; }
    /// <summary> Text alignment. </summary>
    public TextAlign? TextAlign { get; set; }
    /// <summary> Use point style shape in legend. </summary>
    public bool? UsePointStyle { get; set; }
    /// <summary> Point style width. </summary>
    public int? PointStyleWidth { get; set; }
    /// <summary> If true, colored box uses dataset border radius. </summary>
    public bool? UseBorderRadius { get; set; }
    /// <summary> Colored box border radius. </summary>
    public double? BorderRadius { get; set; }
}

/// <summary>
/// Configuration for the chart legend.
/// </summary>
public class Legend
{
    /// <summary> If true, legend is shown. </summary>
    public bool? Display { get; set; }
    /// <summary> Position ('top', 'left', etc). </summary>
    public LegendPosition? Position { get; set; }
    /// <summary> Alignment ('start', 'center', 'end'). </summary>
    public LegendAlign? Align { get; set; }
    /// <summary> Max height in pixels. </summary>
    public int? MaxHeight { get; set; }
    /// <summary> Max width in pixels. </summary>
    public int? MaxWidth { get; set; }
    /// <summary> Takes full width/height. </summary>
    public bool? FullSize { get; set; }
    /// <summary> Click handler function name. </summary>
    public string? OnClick { get; set; }
    /// <summary> Hover handler function name. </summary>
    public string? OnHover { get; set; }
    /// <summary> Leave handler function name. </summary>
    public string? OnLeave { get; set; }
    /// <summary> Show datasets in reverse order. </summary>
    public bool? Reverse { get; set; }
    /// <summary> Label configuration. </summary>
    public Labels? Labels { get; set; }
    /// <summary> Right-to-left rendering. </summary>
    public bool? Rtl { get; set; }
    /// <summary> Forced text direction. </summary>
    public string? TextDirection { get; set; }
    /// <summary> Legend title settings. </summary>
    public LegendTitle? Title { get; set; }
}

/// <summary>
/// Configuration for tooltip callback functions.
/// </summary>
public class Callbacks
{
    public string? BeforeTitle { get; set; }
    public string? Title { get; set; }
    public string? AfterTitle { get; set; }
    public string? BeforeBody { get; set; }
    public string? BeforeLabel { get; set; }
    public string? Label { get; set; }
    public string? LabelColor { get; set; }
    public string? LabelTextColor { get; set; }
    public string? LabelPointStyle { get; set; }
    public string? AfterLabel { get; set; }
    public string? AfterBody { get; set; }
    public string? BeforeFooter { get; set; }
    public string? Footer { get; set; }
    public string? AfterFooter { get; set; }
}

/// <summary>
/// Configuration for on-canvas tooltips.
/// </summary>
public class ToolTip
{
    /// <summary> If true, tooltips are enabled. </summary>
    public bool? Enabled { get; set; }
    /// <summary> External rendering function name. </summary>
    public string? External { get; set; }
    /// <summary> Interaction mode. </summary>
    public string? Mode { get; set; }
    /// <summary> Tooltip only appears if mouse intersects item. </summary>
    public bool? Intersect { get; set; }
    /// <summary> Positioner mode. </summary>
    public string? Position { get; set; }
    /// <summary> Text callbacks. </summary>
    public Callbacks? Callbacks { get; set; }
    /// <summary> Item sorting function. </summary>
    public string? ItemSort { get; set; }
    /// <summary> Item filtering function. </summary>
    public string? Filter { get; set; }
    /// <summary> Background color of tooltip box. </summary>
    public string? BackgroundColor { get; set; }
    /// <summary> Title text color. </summary>
    public string? TitleColor { get; set; }
    /// <summary> Title font settings. </summary>
    public ChartFont? TitleFont { get; set; }
    /// <summary> Title text alignment. </summary>
    public TextAlign? TitleAlign { get; set; }
    /// <summary> Spacing between title lines. </summary>
    public int? TitleSpacing { get; set; }
    /// <summary> Bottom margin for title section. </summary>
    public int? TitleMarginBottom { get; set; }
    /// <summary> Body text color. </summary>
    public string? BodyColor { get; set; }
    /// <summary> Body font settings. </summary>
    public ChartFont? BodyFont { get; set; }
    /// <summary> Body text alignment. </summary>
    public TextAlign? BodyAlign { get; set; }
    /// <summary> Spacing between items. </summary>
    public int? BodySpacing { get; set; }
    /// <summary> Footer text color. </summary>
    public string? FooterColor { get; set; }
    /// <summary> Footer font settings. </summary>
    public ChartFont? FooterFont { get; set; }
    /// <summary> Footer text alignment. </summary>
    public TextAlign? FooterAlign { get; set; }
    /// <summary> Spacing between footer lines. </summary>
    public int? FooterSpacing { get; set; }
    /// <summary> Top margin for footer section. </summary>
    public int? FooterMarginTop { get; set; }
    /// <summary> Tooltip box padding. </summary>
    public Padding? Padding { get; set; }
    /// <summary> Arrow padding. </summary>
    public int? CaretPadding { get; set; }
    /// <summary> Arrow size. </summary>
    public int? CaretSize { get; set; }
    /// <summary> Corner radius. </summary>
    public int? CornerRadius { get; set; }
    /// <summary> Multi-key background color. </summary>
    public string? MultiKeyBackground { get; set; }
    /// <summary> Show color boxes. </summary>
    public bool? DisplayColors { get; set; }
    /// <summary> Identifier box width. </summary>
    public int? BoxWidth { get; set; }
    /// <summary> Identifier box height. </summary>
    public int? BoxHeight { get; set; }
    /// <summary> Spacing between box and text. </summary>
    public int? BoxPadding { get; set; }
    /// <summary> Use point styles instead of colored boxes. </summary>
    public bool? UsePointStyle { get; set; }
    /// <summary> Tooltip box border color. </summary>
    public string? BorderColor { get; set; }
    /// <summary> Tooltip box border width. </summary>
    public int? BorderWidth { get; set; }
    /// <summary> Right-to-left rendering. </summary>
    public bool? Rtl { get; set; }
    /// <summary> Forced text direction. </summary>
    public string? TextDirection { get; set; }
    /// <summary> Forced X-alignment for caret. </summary>
    public string? XAlign { get; set; }
    /// <summary> Forced Y-alignment for caret. </summary>
    public string? YAlign { get; set; }
}