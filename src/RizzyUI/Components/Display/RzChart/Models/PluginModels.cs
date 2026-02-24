
#pragma warning disable CS1591
namespace RizzyUI.Charts;

public class Plugins
{
    public Legend? Legend { get; set; }
    public Title? Title { get; set; }
    public Title? Subtitle { get; set; }
    public ToolTip? Tooltip { get; set; }
    public Colors? Colors { get; set; }
    public Decimation? Decimation { get; set; }
    public Filler? Filler { get; set; }
}

public class Colors
{
    public bool? Enabled { get; set; }
    public bool? ForceOverride { get; set; }
}

public class Decimation
{
    public bool? Enabled { get; set; }
    public Algorithm? Algorithm { get; set; }
    public int? Samples { get; set; }
    public int? Threshold { get; set; }
}

public class Filler
{
    public bool? Propagate { get; set; }
    public DrawTime? DrawTime { get; set; }
}

public class Title
{
    public TitleAlign? Align { get; set; }
    public string? Color { get; set; }
    public bool? Display { get; set; }
    public bool? FullSize { get; set; }
    public TitlePosition? Position { get; set; }
    public ChartFont? Font { get; set; }
    public Padding? Padding { get; set; }
    public object? Text { get; set; }
}

public class LegendTitle
{
    public string? Color { get; set; }
    public bool? Display { get; set; }
    public ChartFont? Font { get; set; }
    public Padding? Padding { get; set; }
    public string? Text { get; set; }
}

public class Labels
{
    public int? BoxWidth { get; set; }
    public int? BoxHeight { get; set; }
    public string? Color { get; set; }
    public ChartFont? Font { get; set; }
    public int? Padding { get; set; }
    public string? GenerateLabels { get; set; }
    public string? Filter { get; set; }
    public string? Sort { get; set; }
    public PointStyle? PointStyle { get; set; }
    public TextAlign? TextAlign { get; set; }
    public bool? UsePointStyle { get; set; }
    public int? PointStyleWidth { get; set; }
    public bool? UseBorderRadius { get; set; }
    public double? BorderRadius { get; set; }
}

public class Legend
{
    public bool? Display { get; set; }
    public LegendPosition? Position { get; set; }
    public LegendAlign? Align { get; set; }
    public int? MaxHeight { get; set; }
    public int? MaxWidth { get; set; }
    public bool? FullSize { get; set; }
    public string? OnClick { get; set; }
    public string? OnHover { get; set; }
    public string? OnLeave { get; set; }
    public bool? Reverse { get; set; }
    public Labels? Labels { get; set; }
    public bool? Rtl { get; set; }
    public string? TextDirection { get; set; }
    public LegendTitle? Title { get; set; }
}

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

public class ToolTip
{
    public bool? Enabled { get; set; }
    public string? External { get; set; }
    public string? Mode { get; set; }
    public bool? Intersect { get; set; }
    public string? Position { get; set; }
    public Callbacks? Callbacks { get; set; }
    public string? ItemSort { get; set; }
    public string? Filter { get; set; }
    public string? BackgroundColor { get; set; }
    public string? TitleColor { get; set; }
    public ChartFont? TitleFont { get; set; }
    public TextAlign? TitleAlign { get; set; }
    public int? TitleSpacing { get; set; }
    public int? TitleMarginBottom { get; set; }
    public string? BodyColor { get; set; }
    public ChartFont? BodyFont { get; set; }
    public TextAlign? BodyAlign { get; set; }
    public int? BodySpacing { get; set; }
    public string? FooterColor { get; set; }
    public ChartFont? FooterFont { get; set; }
    public TextAlign? FooterAlign { get; set; }
    public int? FooterSpacing { get; set; }
    public int? FooterMarginTop { get; set; }
    public Padding? Padding { get; set; }
    public int? CaretPadding { get; set; }
    public int? CaretSize { get; set; }
    public int? CornerRadius { get; set; }
    public string? MultiKeyBackground { get; set; }
    public bool? DisplayColors { get; set; }
    public int? BoxWidth { get; set; }
    public int? BoxHeight { get; set; }
    public int? BoxPadding { get; set; }
    public bool? UsePointStyle { get; set; }
    public string? BorderColor { get; set; }
    public int? BorderWidth { get; set; }
    public bool? Rtl { get; set; }
    public string? TextDirection { get; set; }
    public string? XAlign { get; set; }
    public string? YAlign { get; set; }
}