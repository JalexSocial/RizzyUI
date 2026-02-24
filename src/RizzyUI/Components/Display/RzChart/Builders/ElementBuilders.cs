
namespace RizzyUI.Charts;

/// <summary>
/// Builder for configuring global defaults for chart elements (arcs, lines, points, bars).
/// Elements options apply to all datasets unless overridden at the dataset level.
/// </summary>
public class ElementsBuilder
{
    private readonly Elements _elements;

    internal ElementsBuilder(Elements elements)
    {
        _elements = elements;
    }

    /// <summary>
    /// Configures global defaults for point elements, used in Line, Radar, and Bubble charts.
    /// </summary>
    public PointElementBuilder Point()
    {
        _elements.Point = new PointElement();
        return new PointElementBuilder(_elements.Point);
    }

    /// <summary>
    /// Configures global defaults for line elements, used in Line and Radar charts.
    /// </summary>
    public LineElementBuilder Line()
    {
        _elements.Line = new LineElement();
        return new LineElementBuilder(_elements.Line);
    }

    /// <summary>
    /// Configures global defaults for bar elements, used in Bar charts.
    /// </summary>
    public BarElementBuilder Bar()
    {
        _elements.Bar = new BarElement();
        return new BarElementBuilder(_elements.Bar);
    }

    /// <summary>
    /// Configures global defaults for arc elements, used in Pie, Doughnut, and Polar Area charts.
    /// </summary>
    public ArcElementBuilder Arc()
    {
        _elements.Arc = new ArcElement();
        return new ArcElementBuilder(_elements.Arc);
    }
}

/// <summary>
/// Base class for configuring common element properties like background and border.
/// </summary>
public abstract class BaseElementBuilder<T> where T : BaseElementBuilder<T>
{
    private readonly BaseElement _baseElement;

    internal BaseElementBuilder(BaseElement baseElement)
    {
        _baseElement = baseElement;
    }

    /// <summary>
    /// Sets the global default background color for the element.
    /// </summary>
    public T BackgroundColor(string color) { _baseElement.BackgroundColor = color; return (T)this; }

    /// <summary>
    /// Sets the global default background color using a <see cref="Color"/> token.
    /// </summary>
    public T BackgroundColor(Color color) { _baseElement.BackgroundColor = color.ToCssColorString(); return (T)this; }

    /// <summary>
    /// Sets an array of background colors for the elements.
    /// </summary>
    public T BackgroundColors(params string[] colors) { _baseElement.BackgroundColor = colors; return (T)this; }

    /// <summary>
    /// Sets an array of background colors using <see cref="Color"/> tokens.
    /// </summary>
    public T BackgroundColors(params Color[] colors) { _baseElement.BackgroundColor = colors.Select(c => c.ToCssColorString()).ToArray(); return (T)this; }

    /// <summary>
    /// Sets the default width of the border line in pixels.
    /// </summary>
    public T BorderWidth(int width) { _baseElement.BorderWidth = width; return (T)this; }

    /// <summary>
    /// Sets the global default color of the border.
    /// </summary>
    public T BorderColor(string color) { _baseElement.BorderColor = color; return (T)this; }

    /// <summary>
    /// Sets the default border color using a <see cref="Color"/> token.
    /// </summary>
    public T BorderColor(Color color) { _baseElement.BorderColor = color.ToCssColorString(); return (T)this; }

    /// <summary>
    /// Sets an array of border colors for the elements.
    /// </summary>
    public T BorderColors(params string[] colors) { _baseElement.BorderColor = colors; return (T)this; }

    /// <summary>
    /// Sets an array of border colors using <see cref="Color"/> tokens.
    /// </summary>
    public T BorderColors(params Color[] colors) { _baseElement.BorderColor = colors.Select(c => c.ToCssColorString()).ToArray(); return (T)this; }
}

/// <summary>
/// Builder for configuring global point element defaults.
/// </summary>
public class PointElementBuilder : BaseElementBuilder<PointElementBuilder>
{
    private readonly PointElement _pointElement;

    internal PointElementBuilder(PointElement pointElement) : base(pointElement)
    {
        _pointElement = pointElement;
    }

    /// <summary>
    /// Sets the default point radius in pixels.
    /// </summary>
    public PointElementBuilder Radius(int radius) { _pointElement.Radius = radius; return this; }

    /// <summary>
    /// Enables or disables point styling.
    /// </summary>
    public PointElementBuilder PointStyle(bool enabled) { _pointElement.PointStyle = enabled; return this; }

    /// <summary>
    /// Sets the default shape for point markers.
    /// </summary>
    public PointElementBuilder PointStyle(PointStyle style) { _pointElement.PointStyle = style; return this; }

    /// <summary>
    /// Sets the default point rotation in degrees.
    /// </summary>
    public PointElementBuilder Rotation(int rotation) { _pointElement.Rotation = rotation; return this; }

    /// <summary>
    /// Sets the default extra radius added to point radius for hit detection.
    /// </summary>
    public PointElementBuilder HitRadius(int radius) { _pointElement.HitRadius = radius; return this; }

    /// <summary>
    /// Sets the default point radius when hovered.
    /// </summary>
    public PointElementBuilder HoverRadius(int radius) { _pointElement.HoverRadius = radius; return this; }

    /// <summary>
    /// Sets the default point border width when hovered.
    /// </summary>
    public PointElementBuilder HoverBorderWidth(int width) { _pointElement.HoverBorderWidth = width; return this; }
}

/// <summary>
/// Builder for configuring global line element defaults.
/// </summary>
public class LineElementBuilder : BaseElementBuilder<LineElementBuilder>
{
    private readonly LineElement _lineElement;

    internal LineElementBuilder(LineElement lineElement) : base(lineElement)
    {
        _lineElement = lineElement;
    }

    /// <summary>
    /// Sets the default Bezier curve tension. 0 is a straight line.
    /// </summary>
    public LineElementBuilder Tension(double tension) { _lineElement.Tension = tension; return this; }

    /// <summary>
    /// Sets the default cap style of the line.
    /// </summary>
    public LineElementBuilder BorderCapStyle(CapStyle capStyle) { _lineElement.BorderCapStyle = capStyle; return this; }

    /// <summary>
    /// Sets the default dash pattern for the line.
    /// </summary>
    public LineElementBuilder BorderDash(params int[] dash) { _lineElement.BorderDash = dash; return this; }

    /// <summary>
    /// Sets the default offset for line dashes.
    /// </summary>
    public LineElementBuilder BorderDashOffset(double offset) { _lineElement.BorderDashOffset = offset; return this; }

    /// <summary>
    /// Sets the default join style for the line.
    /// </summary>
    public LineElementBuilder BorderJoinStyle(JoinStyle joinStyle) { _lineElement.BorderJoinStyle = joinStyle; return this; }

    /// <summary>
    /// If true, keeps Bezier control points inside the chart area.
    /// </summary>
    public LineElementBuilder CapBezierPoints(bool capBezierPoints) { _lineElement.CapBezierPoints = capBezierPoints; return this; }

    /// <summary>
    /// Sets the default interpolation mode (e.g. 'default', 'monotone').
    /// </summary>
    public LineElementBuilder CubicInterpolationMode(string mode) { _lineElement.CubicInterpolationMode = mode; return this; }

    /// <summary>
    /// Sets whether the area under the line is filled.
    /// </summary>
    public LineElementBuilder Fill(bool fill) { _lineElement.Fill = fill; return this; }

    /// <summary>
    /// Sets the named fill boundary for the line area.
    /// </summary>
    public LineElementBuilder Fill(string fill) { _lineElement.Fill = fill; return this; }

    /// <summary>
    /// If true, the line is shown as a stepped line.
    /// </summary>
    public LineElementBuilder Stepped(bool stepped) { _lineElement.Stepped = stepped; return this; }
}

/// <summary>
/// Builder for configuring global bar element defaults.
/// </summary>
public class BarElementBuilder : BaseElementBuilder<BarElementBuilder>
{
    private readonly BarElement _barElement;

    internal BarElementBuilder(BarElement barElement) : base(barElement)
    {
        _barElement = barElement;
    }

    /// <summary>
    /// Disables all bar borders.
    /// </summary>
    public BarElementBuilder BorderSkipped(bool enabled) { _barElement.BorderSkipped = enabled; return this; }

    /// <summary>
    /// Sets which edge to skip when drawing the bar border.
    /// </summary>
    public BarElementBuilder BorderSkipped(Skipped skipped) { _barElement.BorderSkipped = skipped; return this; }

    /// <summary>
    /// Sets the default border radius for the bars in pixels.
    /// </summary>
    public BarElementBuilder BorderRadius(int radius) { _barElement.BorderRadius = radius; return this; }

    /// <summary>
    /// Configures the default border radius per-corner.
    /// </summary>
    public BarElementBuilder BorderRadius(Action<BorderRadiusBuilder> action)
    {
        _barElement.BorderRadius = new BorderRadius();
        action(new BorderRadiusBuilder((BorderRadius)_barElement.BorderRadius));
        return this;
    }

    /// <summary>
    /// Automatically calculates inflation to hide artifacts between bars.
    /// </summary>
    public BarElementBuilder InflateAmount() { _barElement.InflateAmount = "auto"; return this; }

    /// <summary>
    /// Sets the pixel amount to inflate bars by when drawing.
    /// </summary>
    public BarElementBuilder InflateAmount(int amount) { _barElement.InflateAmount = amount; return this; }

    /// <summary>
    /// Sets the default point style for bar datasets in the legend.
    /// </summary>
    public BarElementBuilder PointStyle(PointStyle style) { _barElement.PointStyle = style; return this; }
}

/// <summary>
/// Builder for configuring global arc element defaults.
/// </summary>
public class ArcElementBuilder : BaseElementBuilder<ArcElementBuilder>
{
    private readonly ArcElement _arcElement;

    internal ArcElementBuilder(ArcElement arcElement) : base(arcElement)
    {
        _arcElement = arcElement;
    }

    /// <summary>
    /// Sets the default sweep angle for arcs in degrees.
    /// </summary>
    public ArcElementBuilder Angle(int angle) { _arcElement.Angle = angle; return this; }

    /// <summary>
    /// Sets the default border alignment (center or inner).
    /// </summary>
    public ArcElementBuilder BorderAlign(BorderAlign align) { _arcElement.BorderAlign = align; return this; }

    /// <summary>
    /// Sets the default dash pattern for arc borders.
    /// </summary>
    public ArcElementBuilder BorderDash(params int[] borderDash) { _arcElement.BorderDash = borderDash; return this; }

    /// <summary>
    /// Sets the default dash offset for arc borders.
    /// </summary>
    public ArcElementBuilder BorderDashOffset(double offset) { _arcElement.BorderDashOffset = offset; return this; }

    /// <summary>
    /// Sets the default join style for arc borders.
    /// </summary>
    public ArcElementBuilder BorderJoinStyle(JoinStyle joinStyle) { _arcElement.BorderJoinStyle = joinStyle; return this; }

    /// <summary>
    /// If false, the arc will be drawn flat instead of curved.
    /// </summary>
    public ArcElementBuilder Circular(bool circular) { _arcElement.Circular = circular; return this; }
}