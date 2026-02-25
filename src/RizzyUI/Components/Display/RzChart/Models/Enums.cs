
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace RizzyUI.Charts;

/// <summary>
/// Determines how the ends of line segments are joined.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum JoinStyle
{
    /// <summary> Corner is sharp (mitered). </summary>
    [EnumMember(Value = "miter")] Miter,
    /// <summary> Corner is rounded. </summary>
    [EnumMember(Value = "round")] Round,
    /// <summary> Corner is flattened (beveled). </summary>
    [EnumMember(Value = "bevel")] Bevel
}

/// <summary>
/// Shapes used for point markers on line, radar, and scatter charts.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum PointStyle
{
    /// <summary> A solid circle marker. </summary>
    [EnumMember(Value = "circle")] Circle,
    /// <summary> A plus-shaped cross marker. </summary>
    [EnumMember(Value = "cross")] Cross,
    /// <summary> An 'X' shaped cross marker. </summary>
    [EnumMember(Value = "crossRot")] CrossRot,
    /// <summary> A horizontal dash marker. </summary>
    [EnumMember(Value = "dash")] Dash,
    /// <summary> A horizontal line marker. </summary>
    [EnumMember(Value = "line")] Line,
    /// <summary> A solid rectangle marker. </summary>
    [EnumMember(Value = "rect")] Rect,
    /// <summary> A rectangle marker with rounded corners. </summary>
    [EnumMember(Value = "rectRounded")] RectRounded,
    /// <summary> A rotated rectangle (diamond) marker. </summary>
    [EnumMember(Value = "rectRot")] RectRot,
    /// <summary> A five-pointed star marker. </summary>
    [EnumMember(Value = "star")] Star,
    /// <summary> A triangle marker. </summary>
    [EnumMember(Value = "triangle")] Triangle,
}

/// <summary>
/// Standard easing functions for chart animations.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum AnimationEasing
{
    /// <summary> Constant speed animation. </summary>
    [EnumMember(Value = "linear")] Linear,
    /// <summary> Quadratic acceleration (start slow, speed up). </summary>
    [EnumMember(Value = "easeInQuad")] EaseInQuad,
    /// <summary> Quadratic deceleration (start fast, slow down). </summary>
    [EnumMember(Value = "easeOutQuad")] EaseOutQuad,
    /// <summary> Quadratic acceleration/deceleration. </summary>
    [EnumMember(Value = "easeInOutQuad")] EaseInOutQuad,
    /// <summary> Cubic acceleration. </summary>
    [EnumMember(Value = "easeInCubic")] EaseInCubic,
    /// <summary> Cubic deceleration. </summary>
    [EnumMember(Value = "easeOutCubic")] EaseOutCubic,
    /// <summary> Cubic acceleration/deceleration. </summary>
    [EnumMember(Value = "easeInOutCubic")] EaseInOutCubic,
    /// <summary> Quartic acceleration. </summary>
    [EnumMember(Value = "easeInQuart")] EaseInQuart,
    /// <summary> Quartic deceleration. </summary>
    [EnumMember(Value = "easeOutQuart")] EaseOutQuart,
    /// <summary> Quartic acceleration/deceleration. </summary>
    [EnumMember(Value = "easeInOutQuart")] EaseInOutQuart,
    /// <summary> Quintic acceleration. </summary>
    [EnumMember(Value = "easeInQuint")] EaseInQuint,
    /// <summary> Quintic deceleration. </summary>
    [EnumMember(Value = "easeOutQuint")] EaseOutQuint,
    /// <summary> Quintic acceleration/deceleration. </summary>
    [EnumMember(Value = "easeInOutQuint")] EaseInOutQuint,
    /// <summary> Sinusoidal acceleration. </summary>
    [EnumMember(Value = "easeInSine")] EaseInSine,
    /// <summary> Sinusoidal deceleration. </summary>
    [EnumMember(Value = "easeOutSine")] EaseOutSine,
    /// <summary> Sinusoidal acceleration/deceleration. </summary>
    [EnumMember(Value = "easeInOutSine")] EaseInOutSine,
    /// <summary> Exponential acceleration. </summary>
    [EnumMember(Value = "easeInExpo")] EaseInExpo,
    /// <summary> Exponential deceleration. </summary>
    [EnumMember(Value = "easeOutExpo")] EaseOutExpo,
    /// <summary> Exponential acceleration/deceleration. </summary>
    [EnumMember(Value = "easeInOutExpo")] EaseInOutExpo,
    /// <summary> Circular acceleration. </summary>
    [EnumMember(Value = "easeInCirc")] EaseInCirc,
    /// <summary> Circular deceleration. </summary>
    [EnumMember(Value = "easeOutCirc")] EaseOutCirc,
    /// <summary> Circular acceleration/deceleration. </summary>
    [EnumMember(Value = "easeInOutCirc")] EaseInOutCirc,
    /// <summary> Elastic acceleration (overshoots slightly at start). </summary>
    [EnumMember(Value = "easeInElastic")] EaseInElastic,
    /// <summary> Elastic deceleration (overshoots slightly at end). </summary>
    [EnumMember(Value = "easeOutElastic")] EaseOutElastic,
    /// <summary> Elastic acceleration/deceleration. </summary>
    [EnumMember(Value = "easeInOutElastic")] EaseInOutElastic,
    /// <summary> Backwards acceleration (pulls back before moving forward). </summary>
    [EnumMember(Value = "easeInBack")] EaseInBack,
    /// <summary> Backwards deceleration (overshoots end before settling). </summary>
    [EnumMember(Value = "easeOutBack")] EaseOutBack,
    /// <summary> Backwards acceleration/deceleration. </summary>
    [EnumMember(Value = "easeInOutBack")] EaseInOutBack,
    /// <summary> Bouncing acceleration. </summary>
    [EnumMember(Value = "easeInBounce")] EaseInBounce,
    /// <summary> Bouncing deceleration. </summary>
    [EnumMember(Value = "easeOutBounce")] EaseOutBounce,
    /// <summary> Bouncing acceleration/deceleration. </summary>
    [EnumMember(Value = "easeInOutBounce")] EaseInOutBounce,
}

/// <summary>
/// Alignment options for titles and subtitles.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum TitleAlign
{
    /// <summary> Center the title text. </summary>
    [EnumMember(Value = "center")] Center,
    /// <summary> Align the title to the start (Left in LTR). </summary>
    [EnumMember(Value = "start")] Start,
    /// <summary> Align the title to the end (Right in LTR). </summary>
    [EnumMember(Value = "end")] End
}

/// <summary>
/// Alignment options for the chart legend.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum LegendAlign
{
    /// <summary> Center the legend within the allotted space. </summary>
    [EnumMember(Value = "center")] Center,
    /// <summary> Align the legend to the start of the axis. </summary>
    [EnumMember(Value = "start")] Start,
    /// <summary> Align the legend to the end of the axis. </summary>
    [EnumMember(Value = "end")] End
}

/// <summary>
/// Text alignment for labels and tooltips.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum TextAlign
{
    /// <summary> Center the text block. </summary>
    [EnumMember(Value = "center")] Center,
    /// <summary> Left align the text block. </summary>
    [EnumMember(Value = "left")] Left,
    /// <summary> Right align the text block. </summary>
    [EnumMember(Value = "right")] Right
}

/// <summary>
/// Positioning for chart titles.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum TitlePosition
{
    /// <summary> Position the title at the top of the chart. </summary>
    [EnumMember(Value = "top")] Top,
    /// <summary> Position the title on the left side of the chart. </summary>
    [EnumMember(Value = "left")] Left,
    /// <summary> Position the title at the bottom of the chart. </summary>
    [EnumMember(Value = "bottom")] Bottom
}

/// <summary>
/// Font weight options for chart typography.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum FontWeight
{
    /// <summary> Standard font weight (400). </summary>
    [EnumMember(Value = "normal")] Normal,
    /// <summary> Bold font weight (700). </summary>
    [EnumMember(Value = "bold")] Bold,
    /// <summary> Lighter weight than normal. </summary>
    [EnumMember(Value = "lighter")] Lighter,
    /// <summary> Heavier weight than bold. </summary>
    [EnumMember(Value = "bolder")] Bolder
}

/// <summary>
/// Positioning for the chart legend.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum LegendPosition
{
    /// <summary> Position the legend at the top of the chart. </summary>
    [EnumMember(Value = "top")] Top,
    /// <summary> Position the legend on the left side of the chart. </summary>
    [EnumMember(Value = "left")] Left,
    /// <summary> Position the legend at the bottom of the chart. </summary>
    [EnumMember(Value = "bottom")] Bottom,
    /// <summary> Position the legend on the right side of the chart. </summary>
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
    /// <summary> Finds all items that intersect the point. </summary>
    [EnumMember(Value = "point")] Point,
    /// <summary> Gets the item nearest to the point. Distance is calculated using the axis setting. </summary>
    [EnumMember(Value = "nearest")] Nearest,
    /// <summary> Finds items at the same index in all datasets. </summary>
    [EnumMember(Value = "index")] Index,
    /// <summary> Finds all items in the same dataset. </summary>
    [EnumMember(Value = "dataset")] Dataset,
    /// <summary> Returns all items that would intersect based on the X coordinate only. </summary>
    [EnumMember(Value = "x")] X,
    /// <summary> Returns all items that would intersect based on the Y coordinate only. </summary>
    [EnumMember(Value = "y")] Y
}

/// <summary>
/// Positioner modes for the tooltip box.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum TooltipPosition
{
    /// <summary> Places the tooltip at the average position of all items displayed in the tooltip. </summary>
    [EnumMember(Value = "average")] Average,
    /// <summary> Places the tooltip at the position of the element closest to the event position. </summary>
    [EnumMember(Value = "nearest")] Nearest
}

/// <summary>
/// Interaction axes used to define which directions are considered during distance calculation.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum Axis
{
    /// <summary> Consider distance along the X axis only. </summary>
    [EnumMember(Value = "x")] X,
    /// <summary> Consider distance along the Y axis only. </summary>
    [EnumMember(Value = "y")] Y,
    /// <summary> Consider distance along both the X and Y axes. </summary>
    [EnumMember(Value = "xy")] XY,
    /// <summary> Consider distance in radial coordinates. </summary>
    [EnumMember(Value = "r")] R
}

/// <summary>
/// Native events that trigger chart interactions.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum ChartEvent
{
    /// <summary> Triggers on mouse movement. </summary>
    [EnumMember(Value = "mousemove")] Mousemove,
    /// <summary> Triggers when the mouse leaves the canvas. </summary>
    [EnumMember(Value = "mouseout")] Mouseout,
    /// <summary> Triggers on mouse click. </summary>
    [EnumMember(Value = "click")] Click,
    /// <summary> Triggers on touch start. </summary>
    [EnumMember(Value = "touchstart")] Touchstart
}

/// <summary>
/// Strategy for determining scale boundaries when min/max are not explicitly set.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum Bounds
{
    /// <summary> Ensures ticks are fully visible. Data outside the last ticks is truncated. </summary>
    [EnumMember(Value = "ticks")] Ticks,
    /// <summary> Ensures data is fully visible. Labels outside the data range are removed. </summary>
    [EnumMember(Value = "data")] Data
}

/// <summary>
/// Fixed positions for axes relative to the chart area.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum AxisPosition
{
    /// <summary> Position the axis at the top edge. </summary>
    [EnumMember(Value = "top")] Top,
    /// <summary> Position the axis at the left edge. </summary>
    [EnumMember(Value = "left")] Left,
    /// <summary> Position the axis at the bottom edge. </summary>
    [EnumMember(Value = "bottom")] Bottom,
    /// <summary> Position the axis at the right edge. </summary>
    [EnumMember(Value = "right")] Right,
    /// <summary> Position the axis at the center of the chart area. </summary>
    [EnumMember(Value = "center")] Center
}

/// <summary>
/// Algorithms for data downsampling provided by the Decimation plugin.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum Algorithm
{
    /// <summary> Largest Triangle Three Bucket algorithm. Significantly reduces points while preserving visual trends. </summary>
    [EnumMember(Value = "lttb")] Lttb,
    /// <summary> Min-Max decimation. Preserves peak values in noisy signals, requiring up to 4 points per pixel. </summary>
    [EnumMember(Value = "min-max")] MinMax
}

/// <summary>
/// Line cap styles defining how the ends of line segments are drawn.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum CapStyle
{
    /// <summary> The ends of lines are squared off at the endpoints. </summary>
    [EnumMember(Value = "butt")] Butt,
    /// <summary> The ends of lines are rounded. </summary>
    [EnumMember(Value = "round")] Round,
    /// <summary> The ends of lines are squared off by adding a box with width equal to the line width. </summary>
    [EnumMember(Value = "square")] Square
}

/// <summary>
/// Border segments to skip when drawing a bar. 'start' and 'end' are context-aware.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum Skipped
{
    /// <summary> Skip the starting border (usually bottom for vertical, left for horizontal). </summary>
    [EnumMember(Value = "start")] Start,
    /// <summary> Skip the ending border (usually top for vertical, right for horizontal). </summary>
    [EnumMember(Value = "end")] End,
    /// <summary> Skip the borders between bars in a stacked chart. </summary>
    [EnumMember(Value = "middle")] Middle,
    /// <summary> Explicitly skip the bottom border. </summary>
    [EnumMember(Value = "bottom")] Bottom,
    /// <summary> Explicitly skip the left border. </summary>
    [EnumMember(Value = "left")] Left,
    /// <summary> Explicitly skip the top border. </summary>
    [EnumMember(Value = "top")] Top,
    /// <summary> Explicitly skip the right border. </summary>
    [EnumMember(Value = "right")] Right,
}

/// <summary>
/// Strategy for drawing borders around arcs in polar area, doughnut, and pie charts.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum BorderAlign
{
    /// <summary> Borders of adjacent arcs will overlap. </summary>
    [EnumMember(Value = "center")] Center,
    /// <summary> Borders are drawn inside the arc, ensuring they do not overlap. </summary>
    [EnumMember(Value = "inner")] Inner
}

/// <summary>
/// Defines which axis represents the categorical index for the dataset.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum IndexAxis
{
    /// <summary> X-axis is the index axis (Default for vertical bars/lines). </summary>
    [EnumMember(Value = "x")] X,
    /// <summary> Y-axis is the index axis (Enables horizontal bars/lines). </summary>
    [EnumMember(Value = "y")] Y
}

/// <summary>
/// Phases of the render cycle when plugin hooks or filler areas can be drawn.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum DrawTime
{
    /// <summary> Draw before the entire chart is rendered. </summary>
    [EnumMember(Value = "beforeDraw")] BeforeDraw,
    /// <summary> Draw before a specific dataset is rendered. </summary>
    [EnumMember(Value = "beforeDatasetDraw")] BeforeDatasetDraw,
    /// <summary> Draw before all datasets are rendered. </summary>
    [EnumMember(Value = "beforeDatasetsDraw")] BeforeDatasetsDraw
}

/// <summary>
/// Alignment options for scale ticks relative to their grid lines.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum TicksAlign
{
    /// <summary> Align the tick label at the start. </summary>
    [EnumMember(Value = "start")] Start,
    /// <summary> Center the tick label on the grid line. </summary>
    [EnumMember(Value = "center")] Center,
    /// <summary> Align the tick label at the end. </summary>
    [EnumMember(Value = "end")] End,
    /// <summary> Align 'start' for the first tick and 'end' for the last tick. </summary>
    [EnumMember(Value = "inner")] Inner
}

/// <summary>
/// Perpendicular alignment for ticks relative to the axis line.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum TicksCrossAlign
{
    /// <summary> Align label near the axis. </summary>
    [EnumMember(Value = "near")] Near,
    /// <summary> Center label perpendicular to the axis. </summary>
    [EnumMember(Value = "center")] Center,
    /// <summary> Align label far from the axis. </summary>
    [EnumMember(Value = "far")] Far
}

/// <summary>
/// Interpolation mode used for drawing lines between data points.
/// </summary>
[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum InterpolationMode
{
    /// <summary> Weighted cubic interpolation for pleasant curves. </summary>
    [EnumMember(Value = "default")] Default,
    /// <summary> Monotone cubic interpolation. Preserves monotonicity and prevents overshoot between points. </summary>
    [EnumMember(Value = "monotone")] Monotone
}