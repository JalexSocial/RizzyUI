
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace RizzyUI.Charts;

/// <summary>
/// Determines how the ends of line segments are joined.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum JoinStyle
{
    /// <summary> Corner is sharp. </summary>
    [EnumMember(Value = "miter")] Miter,
    /// <summary> Corner is rounded. </summary>
    [EnumMember(Value = "round")] Round,
    /// <summary> Corner is flattened. </summary>
    [EnumMember(Value = "bevel")] Bevel
}

/// <summary>
/// Shapes used for point markers on line, radar, and scatter charts.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum PointStyle
{
    [EnumMember(Value = "circle")] Circle,
    [EnumMember(Value = "cross")] Cross,
    [EnumMember(Value = "crossRot")] CrossRot,
    [EnumMember(Value = "dash")] Dash,
    [EnumMember(Value = "line")] Line,
    [EnumMember(Value = "rect")] Rect,
    [EnumMember(Value = "rectRounded")] RectRounded,
    [EnumMember(Value = "rectRot")] RectRot,
    [EnumMember(Value = "star")] Star,
    [EnumMember(Value = "triangle")] Triangle,
}

/// <summary>
/// Standard easing functions for chart animations.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum AnimationEasing
{
    [EnumMember(Value = "linear")] Linear,
    [EnumMember(Value = "easeInQuad")] EaseInQuad,
    [EnumMember(Value = "easeOutQuad")] EaseOutQuad,
    [EnumMember(Value = "easeInOutQuad")] EaseInOutQuad,
    [EnumMember(Value = "easeInCubic")] EaseInCubic,
    [EnumMember(Value = "easeOutCubic")] EaseOutCubic,
    [EnumMember(Value = "easeInOutCubic")] EaseInOutCubic,
    [EnumMember(Value = "easeInQuart")] EaseInQuart,
    [EnumMember(Value = "easeOutQuart")] EaseOutQuart,
    [EnumMember(Value = "easeInOutQuart")] EaseInOutQuart,
    [EnumMember(Value = "easeInQuint")] EaseInQuint,
    [EnumMember(Value = "easeOutQuint")] EaseOutQuint,
    [EnumMember(Value = "easeInOutQuint")] EaseInOutQuint,
    [EnumMember(Value = "easeInSine")] EaseInSine,
    [EnumMember(Value = "easeOutSine")] EaseOutSine,
    [EnumMember(Value = "easeInOutSine")] EaseInOutSine,
    [EnumMember(Value = "easeInExpo")] EaseInExpo,
    [EnumMember(Value = "easeOutExpo")] EaseOutExpo,
    [EnumMember(Value = "easeInOutExpo")] EaseInOutExpo,
    [EnumMember(Value = "easeInCirc")] EaseInCirc,
    [EnumMember(Value = "easeOutCirc")] EaseOutCirc,
    [EnumMember(Value = "easeInOutCirc")] EaseInOutCirc,
    [EnumMember(Value = "easeInElastic")] EaseInElastic,
    [EnumMember(Value = "easeOutElastic")] EaseOutElastic,
    [EnumMember(Value = "easeInOutElastic")] EaseInOutElastic,
    [EnumMember(Value = "easeInBack")] EaseInBack,
    [EnumMember(Value = "easeOutBack")] EaseOutBack,
    [EnumMember(Value = "easeInOutBack")] EaseInOutBack,
    [EnumMember(Value = "easeInBounce")] EaseInBounce,
    [EnumMember(Value = "easeOutBounce")] EaseOutBounce,
    [EnumMember(Value = "easeInOutBounce")] EaseInOutBounce,
}

/// <summary>
/// Alignment options for titles and subtitles.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum TitleAlign
{
    [EnumMember(Value = "center")] Center,
    [EnumMember(Value = "start")] Start,
    [EnumMember(Value = "end")] End
}

/// <summary>
/// Alignment options for the chart legend.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum LegendAlign
{
    [EnumMember(Value = "center")] Center,
    [EnumMember(Value = "start")] Start,
    [EnumMember(Value = "end")] End
}

/// <summary>
/// Text alignment for labels and tooltips.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum TextAlign
{
    [EnumMember(Value = "center")] Center,
    [EnumMember(Value = "left")] Left,
    [EnumMember(Value = "right")] Right
}

/// <summary>
/// Positioning for chart titles.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum TitlePosition
{
    [EnumMember(Value = "top")] Top,
    [EnumMember(Value = "left")] Left,
    [EnumMember(Value = "bottom")] Bottom
}

/// <summary>
/// Font weight options for chart typography.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum FontWeight
{
    [EnumMember(Value = "normal")] Normal,
    [EnumMember(Value = "bold")] Bold,
    [EnumMember(Value = "lighter")] Lighter,
    [EnumMember(Value = "bolder")] Bolder
}

/// <summary>
/// Positioning for the chart legend.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum LegendPosition
{
    [EnumMember(Value = "top")] Top,
    [EnumMember(Value = "left")] Left,
    [EnumMember(Value = "bottom")] Bottom,
    [EnumMember(Value = "right")] Right,
    /// <summary> Legend is placed inside the chart drawing area. </summary>
    [EnumMember(Value = "chartArea")] ChartArea
}

/// <summary>
/// Modes for user interaction and tooltip display.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum InteractionMode
{
    /// <summary> Finds items that intersect the point. </summary>
    [EnumMember(Value = "point")] Point,
    /// <summary> Gets the item nearest to the point. </summary>
    [EnumMember(Value = "nearest")] Nearest,
    /// <summary> Finds items at the same index in all datasets. </summary>
    [EnumMember(Value = "index")] Index,
    /// <summary> Finds items in the same dataset. </summary>
    [EnumMember(Value = "dataset")] Dataset,
    /// <summary> Returns all items that would intersect based on the X coordinate. </summary>
    [EnumMember(Value = "x")] X,
    /// <summary> Returns all items that would intersect based on the Y coordinate. </summary>
    [EnumMember(Value = "y")] Y
}

/// <summary>
/// Positioner modes for the tooltip box.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum TooltipPosition
{
    /// <summary> Places the tooltip at the average position of all items. </summary>
    [EnumMember(Value = "average")] Average,
    /// <summary> Places the tooltip at the position of the nearest element. </summary>
    [EnumMember(Value = "nearest")] Nearest
}

/// <summary>
/// Interaction axes.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum Axis
{
    [EnumMember(Value = "x")] X,
    [EnumMember(Value = "y")] Y,
    [EnumMember(Value = "xy")] XY,
    [EnumMember(Value = "r")] R
}

/// <summary>
/// Native events that trigger chart interactions.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum ChartEvent
{
    [EnumMember(Value = "mousemove")] Mousemove,
    [EnumMember(Value = "mouseout")] Mouseout,
    [EnumMember(Value = "click")] Click,
    [EnumMember(Value = "touchstart")] Touchstart
}

/// <summary>
/// Strategy for determining scale boundaries.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum Bounds
{
    /// <summary> Ticks are fully visible, data outside is truncated. </summary>
    [EnumMember(Value = "ticks")] Ticks,
    /// <summary> Data is fully visible, labels outside are removed. </summary>
    [EnumMember(Value = "data")] Data
}

/// <summary>
/// Fixed positions for axes relative to the chart area.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum AxisPosition
{
    [EnumMember(Value = "top")] Top,
    [EnumMember(Value = "left")] Left,
    [EnumMember(Value = "bottom")] Bottom,
    [EnumMember(Value = "right")] Right,
    [EnumMember(Value = "center")] Center
}

/// <summary>
/// Algorithms for data downsampling.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum Algorithm
{
    /// <summary> Largest Triangle Three Bucket algorithm (preserves visual trends). </summary>
    [EnumMember(Value = "lttb")] Lttb,
    /// <summary> Preserves peak values in noisy signals. </summary>
    [EnumMember(Value = "min-max")] MinMax
}

/// <summary>
/// Line cap styles.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum CapStyle
{
    [EnumMember(Value = "butt")] Butt,
    [EnumMember(Value = "round")] Round,
    [EnumMember(Value = "square")] Square
}

/// <summary>
/// Border segments to skip when drawing a bar.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum Skipped
{
    [EnumMember(Value = "start")] Start,
    [EnumMember(Value = "end")] End,
    [EnumMember(Value = "middle")] Middle,
    [EnumMember(Value = "bottom")] Bottom,
    [EnumMember(Value = "left")] Left,
    [EnumMember(Value = "top")] Top,
    [EnumMember(Value = "right")] Right,
}

/// <summary>
/// Strategy for drawing borders around arcs.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum BorderAlign
{
    /// <summary> Borders of adjacent arcs will overlap. </summary>
    [EnumMember(Value = "center")] Center,
    /// <summary> Borders will not overlap. </summary>
    [EnumMember(Value = "inner")] Inner
}

/// <summary>
/// Defines which axis represents the categorical index.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum IndexAxis
{
    /// <summary> X-axis is the index (Vertical bars). </summary>
    [EnumMember(Value = "x")] X,
    /// <summary> Y-axis is the index (Horizontal bars). </summary>
    [EnumMember(Value = "y")] Y
}

/// <summary>
/// Phases of the render cycle when plugin hooks can be drawn.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum DrawTime
{
    [EnumMember(Value = "beforeDraw")] BeforeDraw,
    [EnumMember(Value = "beforeDatasetDraw")] BeforeDatasetDraw,
    [EnumMember(Value = "beforeDatasetsDraw")] BeforeDatasetsDraw
}

/// <summary>
/// Alignment options for scale ticks.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum TicksAlign
{
    [EnumMember(Value = "start")] Start,
    [EnumMember(Value = "center")] Center,
    [EnumMember(Value = "end")] End,
    /// <summary> Start-align first tick, end-align last tick. </summary>
    [EnumMember(Value = "inner")] Inner
}

/// <summary>
/// Perpendicular alignment for ticks relative to the axis line.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum TicksCrossAlign
{
    [EnumMember(Value = "near")] Near,
    [EnumMember(Value = "center")] Center,
    [EnumMember(Value = "far")] Far
}

/// <summary>
/// Interpolation mode used for drawing lines.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum InterpolationMode
{
    [EnumMember(Value = "default")] Default,
    /// <summary> Preserves monotonicity of data points (no overshoot). </summary>
    [EnumMember(Value = "monotone")] Monotone
}