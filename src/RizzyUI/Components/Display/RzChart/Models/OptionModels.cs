
#pragma warning disable CS1591
namespace RizzyUI.Charts;


public class Options
{
    public bool? Responsive { get; set; }
    public bool? MaintainAspectRatio { get; set; }
    public int? AspectRatio { get; set; }
    public string? OnResize { get; set; }
    public string? OnHover { get; set; }
    public string? OnClick { get; set; }
    public ChartEvent[]? Events { get; set; }
    public int? ResizeDelay { get; set; }
    public string? Locale { get; set; }
    public object? Parsing { get; set; }
    public Animation? Animation { get; set; }
    public Plugins? Plugins { get; set; }
    public Layout? Layout { get; set; }
    public Interaction? Interaction { get; set; }
    public Elements? Elements { get; set; }
    public Dictionary<string, Scale>? Scales { get; set; }
    public Dictionary<string, Animation>? Animations { get; set; }
}

public class Animation
{
    public int? Duration { get; set; }
    public AnimationEasing? Easing { get; set; }
    public int? Delay { get; set; }
    public bool? Loop { get; set; }
    public string? OnProgress { get; set; }
    public string? OnComplete { get; set; }
    public object? From { get; set; }
    public object? To { get; set; }
}

public class ChartFont
{
    public string? Family { get; set; }
    public double? Size { get; set; }
    public string? Style { get; set; }
    public object? Weight { get; set; }
    public object? LineHeight { get; set; }
}

public class Interaction
{
    public InteractionMode? Mode { get; set; }
    public bool? Intersect { get; set; }
    public Axis? Axis { get; set; }
    public bool? IncludeInvisible { get; set; }
}

public class Layout
{
    public bool? AutoPadding { get; set; }
    public Padding? Padding { get; set; }
}

public class Padding
{
    public int? Left { get; set; }
    public int? Right { get; set; }
    public int? Top { get; set; }
    public int? Bottom { get; set; }

    public Padding() { }

    public Padding(int all)
    {
        Left = Right = Top = Bottom = all;
    }
}