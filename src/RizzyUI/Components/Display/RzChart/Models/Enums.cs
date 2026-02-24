using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace RizzyUI.Charts;


[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum JoinStyle
{
    [EnumMember(Value = "miter")] Miter,
    [EnumMember(Value = "round")] Round,
    [EnumMember(Value = "bevel")] Bevel
}

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

[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum TitleAlign
{
    [EnumMember(Value = "center")] Center,
    [EnumMember(Value = "start")] Start,
    [EnumMember(Value = "end")] End
}

[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum LegendAlign
{
    [EnumMember(Value = "center")] Center,
    [EnumMember(Value = "start")] Start,
    [EnumMember(Value = "end")] End
}

[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum TextAlign
{
    [EnumMember(Value = "center")] Center,
    [EnumMember(Value = "left")] Left,
    [EnumMember(Value = "right")] Right
}

[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum TitlePosition
{
    [EnumMember(Value = "top")] Top,
    [EnumMember(Value = "left")] Left,
    [EnumMember(Value = "bottom")] Bottom
}

[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum FontWeight
{
    [EnumMember(Value = "normal")] Normal,
    [EnumMember(Value = "bold")] Bold,
    [EnumMember(Value = "lighter")] Lighter,
    [EnumMember(Value = "bolder")] Bolder
}

[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum LegendPosition
{
    [EnumMember(Value = "top")] Top,
    [EnumMember(Value = "left")] Left,
    [EnumMember(Value = "bottom")] Bottom,
    [EnumMember(Value = "right")] Right,
    [EnumMember(Value = "chartArea")] ChartArea
}

[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum InteractionMode
{
    [EnumMember(Value = "point")] Point,
    [EnumMember(Value = "nearest")] Nearest,
    [EnumMember(Value = "index")] Index,
    [EnumMember(Value = "dataset")] Dataset,
    [EnumMember(Value = "x")] X,
    [EnumMember(Value = "y")] Y
}

[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum TooltipPosition
{
    [EnumMember(Value = "average")] Average,
    [EnumMember(Value = "nearest")] Nearest
}

[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum Axis
{
    [EnumMember(Value = "x")] X,
    [EnumMember(Value = "y")] Y,
    [EnumMember(Value = "xy")] XY,
    [EnumMember(Value = "r")] R
}

[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum ChartEvent
{
    [EnumMember(Value = "mousemove")] Mousemove,
    [EnumMember(Value = "mouseout")] Mouseout,
    [EnumMember(Value = "click")] Click,
    [EnumMember(Value = "touchstart")] Touchstart
}

[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum Bounds
{
    [EnumMember(Value = "ticks")] Ticks,
    [EnumMember(Value = "data")] Data
}

[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum AxisPosition
{
    [EnumMember(Value = "top")] Top,
    [EnumMember(Value = "left")] Left,
    [EnumMember(Value = "bottom")] Bottom,
    [EnumMember(Value = "right")] Right,
    [EnumMember(Value = "center")] Center
}

[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum Algorithm
{
    [EnumMember(Value = "lttb")] Lttb,
    [EnumMember(Value = "min-max")] MinMax
}

[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum CapStyle
{
    [EnumMember(Value = "butt")] Butt,
    [EnumMember(Value = "round")] Round,
    [EnumMember(Value = "square")] Square
}

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

[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum BorderAlign
{
    [EnumMember(Value = "center")] Center,
    [EnumMember(Value = "inner")] Inner
}

[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum IndexAxis
{
    [EnumMember(Value = "x")] X,
    [EnumMember(Value = "y")] Y
}

[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum DrawTime
{
    [EnumMember(Value = "beforeDraw")] BeforeDraw,
    [EnumMember(Value = "beforeDatasetDraw")] BeforeDatasetDraw,
    [EnumMember(Value = "beforeDatasetsDraw")] BeforeDatasetsDraw
}

[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum TicksAlign
{
    [EnumMember(Value = "start")] Start,
    [EnumMember(Value = "center")] Center,
    [EnumMember(Value = "end")] End,
    [EnumMember(Value = "inner")] Inner
}

[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum TicksCrossAlign
{
    [EnumMember(Value = "near")] Near,
    [EnumMember(Value = "center")] Center,
    [EnumMember(Value = "far")] Far
}

[JsonConverter(typeof(ChartJsEnumConverterFactory))]
public enum InterpolationMode
{
    [EnumMember(Value = "default")] Default,
    [EnumMember(Value = "monotone")] Monotone
}