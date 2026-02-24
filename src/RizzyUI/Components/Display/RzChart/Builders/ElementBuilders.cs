
#pragma warning disable CS1591
namespace RizzyUI.Charts;

public class ElementsBuilder
{
    private readonly Elements _elements;

    internal ElementsBuilder(Elements elements)
    {
        _elements = elements;
    }

    public PointElementBuilder Point()
    {
        _elements.Point = new PointElement();
        return new PointElementBuilder(_elements.Point);
    }

    public LineElementBuilder Line()
    {
        _elements.Line = new LineElement();
        return new LineElementBuilder(_elements.Line);
    }

    public BarElementBuilder Bar()
    {
        _elements.Bar = new BarElement();
        return new BarElementBuilder(_elements.Bar);
    }

    public ArcElementBuilder Arc()
    {
        _elements.Arc = new ArcElement();
        return new ArcElementBuilder(_elements.Arc);
    }
}

public abstract class BaseElementBuilder<T> where T : BaseElementBuilder<T>
{
    private readonly BaseElement _baseElement;

    internal BaseElementBuilder(BaseElement baseElement)
    {
        _baseElement = baseElement;
    }

    public T BackgroundColor(string color) { _baseElement.BackgroundColor = color; return (T)this; }
    public T BackgroundColor(Color color) { _baseElement.BackgroundColor = color.ToCssColorString(); return (T)this; }
    public T BackgroundColors(params string[] colors) { _baseElement.BackgroundColor = colors; return (T)this; }
    public T BackgroundColors(params Color[] colors) { _baseElement.BackgroundColor = colors.Select(c => c.ToCssColorString()).ToArray(); return (T)this; }
    public T BorderWidth(int width) { _baseElement.BorderWidth = width; return (T)this; }
    public T BorderColor(string color) { _baseElement.BorderColor = color; return (T)this; }
    public T BorderColor(Color color) { _baseElement.BorderColor = color.ToCssColorString(); return (T)this; }
    public T BorderColors(params string[] colors) { _baseElement.BorderColor = colors; return (T)this; }
    public T BorderColors(params Color[] colors) { _baseElement.BorderColor = colors.Select(c => c.ToCssColorString()).ToArray(); return (T)this; }
}

public class PointElementBuilder : BaseElementBuilder<PointElementBuilder>
{
    private readonly PointElement _pointElement;

    internal PointElementBuilder(PointElement pointElement) : base(pointElement)
    {
        _pointElement = pointElement;
    }

    public PointElementBuilder Radius(int radius) { _pointElement.Radius = radius; return this; }
    public PointElementBuilder PointStyle(bool enabled) { _pointElement.PointStyle = enabled; return this; }
    public PointElementBuilder PointStyle(PointStyle style) { _pointElement.PointStyle = style; return this; }
    public PointElementBuilder Rotation(int rotation) { _pointElement.Rotation = rotation; return this; }
    public PointElementBuilder HitRadius(int radius) { _pointElement.HitRadius = radius; return this; }
    public PointElementBuilder HoverRadius(int radius) { _pointElement.HoverRadius = radius; return this; }
    public PointElementBuilder HoverBorderWidth(int width) { _pointElement.HoverBorderWidth = width; return this; }
}

public class LineElementBuilder : BaseElementBuilder<LineElementBuilder>
{
    private readonly LineElement _lineElement;

    internal LineElementBuilder(LineElement lineElement) : base(lineElement)
    {
        _lineElement = lineElement;
    }

    public LineElementBuilder Tension(double tension) { _lineElement.Tension = tension; return this; }
    public LineElementBuilder BorderCapStyle(CapStyle capStyle) { _lineElement.BorderCapStyle = capStyle; return this; }
    public LineElementBuilder BorderDash(params int[] dash) { _lineElement.BorderDash = dash; return this; }
    public LineElementBuilder BorderDashOffset(double offset) { _lineElement.BorderDashOffset = offset; return this; }
    public LineElementBuilder BorderJoinStyle(JoinStyle joinStyle) { _lineElement.BorderJoinStyle = joinStyle; return this; }
    public LineElementBuilder CapBezierPoints(bool capBezierPoints) { _lineElement.CapBezierPoints = capBezierPoints; return this; }
    public LineElementBuilder CubicInterpolationMode(string mode) { _lineElement.CubicInterpolationMode = mode; return this; }
    public LineElementBuilder Fill(bool fill) { _lineElement.Fill = fill; return this; }
    public LineElementBuilder Fill(string fill) { _lineElement.Fill = fill; return this; }
    public LineElementBuilder Stepped(bool stepped) { _lineElement.Stepped = stepped; return this; }
}

public class BarElementBuilder : BaseElementBuilder<BarElementBuilder>
{
    private readonly BarElement _barElement;

    internal BarElementBuilder(BarElement barElement) : base(barElement)
    {
        _barElement = barElement;
    }

    public BarElementBuilder BorderSkipped(bool enabled) { _barElement.BorderSkipped = enabled; return this; }
    public BarElementBuilder BorderSkipped(Skipped skipped) { _barElement.BorderSkipped = skipped; return this; }
    public BarElementBuilder BorderRadius(int radius) { _barElement.BorderRadius = radius; return this; }
    public BarElementBuilder BorderRadius(Action<BorderRadiusBuilder> action)
    {
        _barElement.BorderRadius = new BorderRadius();
        action(new BorderRadiusBuilder((BorderRadius)_barElement.BorderRadius));
        return this;
    }
    public BarElementBuilder InflateAmount() { _barElement.InflateAmount = "auto"; return this; }
    public BarElementBuilder InflateAmount(int amount) { _barElement.InflateAmount = amount; return this; }
    public BarElementBuilder PointStyle(PointStyle style) { _barElement.PointStyle = style; return this; }
}

public class ArcElementBuilder : BaseElementBuilder<ArcElementBuilder>
{
    private readonly ArcElement _arcElement;

    internal ArcElementBuilder(ArcElement arcElement) : base(arcElement)
    {
        _arcElement = arcElement;
    }

    public ArcElementBuilder Angle(int angle) { _arcElement.Angle = angle; return this; }
    public ArcElementBuilder BorderAlign(BorderAlign align) { _arcElement.BorderAlign = align; return this; }
    public ArcElementBuilder BorderDash(params int[] borderDash) { _arcElement.BorderDash = borderDash; return this; }
    public ArcElementBuilder BorderDashOffset(double offset) { _arcElement.BorderDashOffset = offset; return this; }
    public ArcElementBuilder BorderJoinStyle(JoinStyle joinStyle) { _arcElement.BorderJoinStyle = joinStyle; return this; }
    public ArcElementBuilder Circular(bool circular) { _arcElement.Circular = circular; return this; }
}
