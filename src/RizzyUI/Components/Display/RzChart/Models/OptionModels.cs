
namespace RizzyUI.Charts;

/// <summary>
/// Configuration for chart behavior and appearance.
/// </summary>
public class Options
{
    /// <summary> If true, resizes the chart canvas when its container does. </summary>
    public bool? Responsive { get; set; }
    /// <summary> If true, maintains the original aspect ratio (width / height) when resizing. </summary>
    public bool? MaintainAspectRatio { get; set; }
    /// <summary> Canvas aspect ratio (width / height). </summary>
    public int? AspectRatio { get; set; }
    /// <summary> JavaScript function name called when a resize occurs. </summary>
    public string? OnResize { get; set; }
    /// <summary> JavaScript function name called when hover events fire. </summary>
    public string? OnHover { get; set; }
    /// <summary> JavaScript function name called when a click event is registered. </summary>
    public string? OnClick { get; set; }
    /// <summary> Browser events that the chart should listen to. </summary>
    public ChartEvent[]? Events { get; set; }
    /// <summary> Delay in ms before updating elements after a resize. </summary>
    public int? ResizeDelay { get; set; }
    /// <summary> BCP 47 locale tag for formatting. </summary>
    public string? Locale { get; set; }
    /// <summary> Configuration for data parsing. </summary>
    public object? Parsing { get; set; }
    /// <summary> Global animation settings. </summary>
    public Animation? Animation { get; set; }
    /// <summary> Configuration for plugins. </summary>
    public Plugins? Plugins { get; set; }
    /// <summary> Configuration for chart padding. </summary>
    public Layout? Layout { get; set; }
    /// <summary> Interaction settings for hover and tooltips. </summary>
    public Interaction? Interaction { get; set; }
    /// <summary> Default settings for chart elements. </summary>
    public Elements? Elements { get; set; }
    /// <summary> Axis/scale configuration. </summary>
    public Dictionary<string, Scale>? Scales { get; set; }
    /// <summary> Named animation configurations for specific properties. </summary>
    public Dictionary<string, Animation>? Animations { get; set; }
}

/// <summary>
/// Defines animation properties for elements.
/// </summary>
public class Animation
{
    /// <summary> Duration in milliseconds. </summary>
    public int? Duration { get; set; }
    /// <summary> Easing function. </summary>
    public AnimationEasing? Easing { get; set; }
    /// <summary> Delay before starting animation. </summary>
    public int? Delay { get; set; }
    /// <summary> If true, loops endlessly. </summary>
    public bool? Loop { get; set; }
    /// <summary> JavaScript function name called on progress. </summary>
    public string? OnProgress { get; set; }
    /// <summary> JavaScript function name called on completion. </summary>
    public string? OnComplete { get; set; }
    /// <summary> Start value for the animation. </summary>
    public object? From { get; set; }
    /// <summary> End value for the animation. </summary>
    public object? To { get; set; }
}

/// <summary>
/// Font configuration for chart text.
/// </summary>
public class ChartFont
{
    /// <summary> Font family. </summary>
    public string? Family { get; set; }
    /// <summary> Size in pixels. </summary>
    public double? Size { get; set; }
    /// <summary> Font style (italic, normal). </summary>
    public string? Style { get; set; }
    /// <summary> Font weight (bold, normal, or numeric). </summary>
    public object? Weight { get; set; }
    /// <summary> Line height. </summary>
    public object? LineHeight { get; set; }
}

/// <summary>
/// Configures user interaction with chart elements.
/// </summary>
public class Interaction
{
    /// <summary> Interaction mode (index, nearest, point, etc). </summary>
    public InteractionMode? Mode { get; set; }
    /// <summary> If true, interaction only applies if mouse intersects an item. </summary>
    public bool? Intersect { get; set; }
    /// <summary> Axis used for distance calculation. </summary>
    public Axis? Axis { get; set; }
    /// <summary> If true, includes points outside the chart area. </summary>
    public bool? IncludeInvisible { get; set; }
}

/// <summary>
/// Configures chart layout properties.
/// </summary>
public class Layout
{
    /// <summary> If true, applies automatic padding for drawing elements. </summary>
    public bool? AutoPadding { get; set; }
    /// <summary> Outer padding around the chart area. </summary>
    public Padding? Padding { get; set; }
}

/// <summary>
/// Simple padding object used to define spacing around various chart elements.
/// </summary>
public class Padding
{
    /// <summary>
    /// Gets or sets the padding on the left side in pixels.
    /// </summary>
    public int? Left { get; set; }

    /// <summary>
    /// Gets or sets the padding on the right side in pixels.
    /// </summary>
    public int? Right { get; set; }

    /// <summary>
    /// Gets or sets the padding on the top side in pixels.
    /// </summary>
    public int? Top { get; set; }

    /// <summary>
    /// Gets or sets the padding on the bottom side in pixels.
    /// </summary>
    public int? Bottom { get; set; }

    /// <summary>
    /// Initializes a new instance of the <see cref="Padding"/> class.
    /// </summary>
    public Padding() { }

    /// <summary>
    /// Initializes a new instance of the <see cref="Padding"/> class with uniform spacing on all sides.
    /// </summary>
    /// <param name="all">The number of pixels to apply to all four sides.</param>
    public Padding(int all)
    {
        Left = Right = Top = Bottom = all;
    }
}