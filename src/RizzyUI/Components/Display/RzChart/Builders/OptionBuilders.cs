
#pragma warning disable CS1591
namespace RizzyUI.Charts;

public class OptionsBuilder
{
    private readonly Options _options;

    internal OptionsBuilder(Options options)
    {
        _options = options;
    }

    public OptionsBuilder Responsive(bool responsive) { _options.Responsive = responsive; return this; }
    public OptionsBuilder MaintainAspectRatio(bool maintainAspectRatio) { _options.MaintainAspectRatio = maintainAspectRatio; return this; }
    public OptionsBuilder AspectRatio(int aspectRatio) { _options.AspectRatio = aspectRatio; return this; }
    public OptionsBuilder OnResize(string onResize) { _options.OnResize = onResize; return this; }
    public OptionsBuilder OnHover(string onHover) { _options.OnHover = onHover; return this; }
    public OptionsBuilder Events(params ChartEvent[] events) { _options.Events = events; return this; }
    public OptionsBuilder OnClick(string onClick) { _options.OnClick = onClick; return this; }
    public OptionsBuilder ResizeDelay(int delay) { _options.ResizeDelay = delay; return this; }
    public OptionsBuilder Locale(string locale) { _options.Locale = locale; return this; }
    
    public OptionsBuilder Plugins(Action<PluginsBuilder> action)
    {
        _options.Plugins = new Plugins();
        action(new PluginsBuilder(_options.Plugins));
        return this;
    }

    public OptionsBuilder Layout(Action<LayoutBuilder> action)
    {
        _options.Layout = new Layout();
        action(new LayoutBuilder(_options.Layout));
        return this;
    }

    public OptionsBuilder Animation(Action<AnimationBuilder> action)
    {
        _options.Animation = new Animation();
        action(new AnimationBuilder(_options.Animation));
        return this;
    }

    public OptionsBuilder Interaction(Action<InteractionBuilder> action)
    {
        _options.Interaction = new Interaction();
        action(new InteractionBuilder(_options.Interaction));
        return this;
    }

    public OptionsBuilder Scales(Action<ScaleBuilder> action)
    {
        _options.Scales = new Dictionary<string, Scale>();
        action(new ScaleBuilder(_options.Scales));
        return this;
    }

    public OptionsBuilder Animations(Action<AnimationBuilder> action)
    {
        _options.Animations = new Dictionary<string, Animation>();
        action(new AnimationBuilder(_options.Animations));
        return this;
    }

    public OptionsBuilder Elements(Action<ElementsBuilder> action)
    {
        _options.Elements = new Elements();
        action(new ElementsBuilder(_options.Elements));
        return this;
    }

    public OptionsBuilder Parsing(bool enabled) { _options.Parsing = enabled; return this; }
    public OptionsBuilder Parsing(string key) { _options.Parsing = new Parsing { Key = key }; return this; }
    public OptionsBuilder Parsing(string xAxisKey, string yAxisKey) { _options.Parsing = new Parsing { XAxisKey = xAxisKey, YAxisKey = yAxisKey }; return this; }
}

public class AnimationBuilder
{
    private Animation _animation;
    private readonly Dictionary<string, Animation>? _animations;

    internal AnimationBuilder(Animation animation)
    {
        _animation = animation;
    }

    internal AnimationBuilder(Dictionary<string, Animation> animations)
    {
        _animations = animations;
        _animation = new Animation(); // Fallback to avoid null ref if unused
    }

    public AnimationBuilder Animation(string animation)
    {
        if (_animations == null) throw new InvalidOperationException("Cannot add named animation unless building an Animations dictionary.");
        _animation = new Animation();
        _animations.Add(animation, _animation);
        return this;
    }

    public AnimationBuilder Duration(int duration) { _animation.Duration = duration; return this; }
    public AnimationBuilder Easing(AnimationEasing easing) { _animation.Easing = easing; return this; }
    public AnimationBuilder Delay(int delay) { _animation.Delay = delay; return this; }
    public AnimationBuilder Loop(bool loop) { _animation.Loop = loop; return this; }
    public AnimationBuilder OnProgress(string onProgress) { _animation.OnProgress = onProgress; return this; }
    public AnimationBuilder OnComplete(string onComplete) { _animation.OnComplete = onComplete; return this; }
    public AnimationBuilder From(bool from) { _animation.From = from; return this; }
    public AnimationBuilder From(int from) { _animation.From = from; return this; }
    public AnimationBuilder From(string from) { _animation.From = from; return this; }
    public AnimationBuilder To(bool to) { _animation.To = to; return this; }
    public AnimationBuilder To(int to) { _animation.To = to; return this; }
    public AnimationBuilder To(string to) { _animation.To = to; return this; }
}

public class FontBuilder
{
    private readonly ChartFont _font;

    internal FontBuilder(ChartFont font)
    {
        _font = font;
    }

    public FontBuilder Family(string family) { _font.Family = family; return this; }
    public FontBuilder Size(double size) { _font.Size = size; return this; }
    public FontBuilder Style(string style) { _font.Style = style; return this; }
    public FontBuilder Weight(FontWeight weight) { _font.Weight = weight.ToString().ToLowerInvariant(); return this; }
    public FontBuilder Weight(int weight) { _font.Weight = weight; return this; }
    public FontBuilder LineHeight(string lineHeight) { _font.LineHeight = lineHeight; return this; }
    public FontBuilder LineHeight(double lineHeight) { _font.LineHeight = lineHeight; return this; }
}

public class InteractionBuilder
{
    private readonly Interaction _interaction;

    internal InteractionBuilder(Interaction interaction)
    {
        _interaction = interaction;
    }

    public InteractionBuilder Mode(InteractionMode mode) { _interaction.Mode = mode; return this; }
    public InteractionBuilder Intersect(bool intersect) { _interaction.Intersect = intersect; return this; }
    public InteractionBuilder Axis(Axis axis) { _interaction.Axis = axis; return this; }
    public InteractionBuilder IncludeInvisible(bool includeInvisible) { _interaction.IncludeInvisible = includeInvisible; return this; }
}

public class LayoutBuilder
{
    private readonly Layout _layout;

    internal LayoutBuilder(Layout layout)
    {
        _layout = layout;
    }

    public LayoutBuilder AutoPadding(bool autoPadding) { _layout.AutoPadding = autoPadding; return this; }
    public LayoutBuilder Padding(int padding) { _layout.Padding = new Padding(padding); return this; }
    public LayoutBuilder Padding(Action<PaddingBuilder> action)
    {
        _layout.Padding = new Padding();
        action(new PaddingBuilder(_layout.Padding));
        return this;
    }
}

public class PaddingBuilder
{
    private readonly Padding _padding;

    internal PaddingBuilder(Padding padding)
    {
        _padding = padding;
    }

    public PaddingBuilder Left(int left) { _padding.Left = left; return this; }
    public PaddingBuilder Right(int right) { _padding.Right = right; return this; }
    public PaddingBuilder Top(int top) { _padding.Top = top; return this; }
    public PaddingBuilder Bottom(int bottom) { _padding.Bottom = bottom; return this; }
    public PaddingBuilder X(int x) { _padding.Left = x; _padding.Right = x; return this; }
    public PaddingBuilder Y(int y) { _padding.Top = y; _padding.Bottom = y; return this; }
}

public class BorderRadiusBuilder
{
    private readonly BorderRadius _borderRadius;

    internal BorderRadiusBuilder(BorderRadius borderRadius)
    {
        _borderRadius = borderRadius;
    }

    public BorderRadiusBuilder TopLeft(int topLeft) { _borderRadius.TopLeft = topLeft; return this; }
    public BorderRadiusBuilder TopRight(int topRight) { _borderRadius.TopRight = topRight; return this; }
    public BorderRadiusBuilder BottomLeft(int bottomLeft) { _borderRadius.BottomLeft = bottomLeft; return this; }
    public BorderRadiusBuilder BottomRight(int bottomRight) { _borderRadius.BottomRight = bottomRight; return this; }
}

public class BorderWidthBuilder
{
    private readonly BorderWidth _borderWidth;

    internal BorderWidthBuilder(BorderWidth borderWidth)
    {
        _borderWidth = borderWidth;
    }

    public BorderWidthBuilder Left(int left) { _borderWidth.Left = left; return this; }
    public BorderWidthBuilder Right(int right) { _borderWidth.Right = right; return this; }
    public BorderWidthBuilder Top(int top) { _borderWidth.Top = top; return this; }
    public BorderWidthBuilder Bottom(int bottom) { _borderWidth.Bottom = bottom; return this; }
}

public class ClipBuilder
{
    private readonly Clip _clip;

    internal ClipBuilder(Clip clip)
    {
        _clip = clip;
    }

    public ClipBuilder Left(int left) { _clip.Left = left; return this; }
    public ClipBuilder Left(bool left) { _clip.Left = left; return this; }
    public ClipBuilder Right(int right) { _clip.Right = right; return this; }
    public ClipBuilder Right(bool right) { _clip.Right = right; return this; }
    public ClipBuilder Top(int top) { _clip.Top = top; return this; }
    public ClipBuilder Top(bool top) { _clip.Top = top; return this; }
    public ClipBuilder Bottom(int bottom) { _clip.Bottom = bottom; return this; }
    public ClipBuilder Bottom(bool bottom) { _clip.Bottom = bottom; return this; }
}

public class FillBuilder
{
    private readonly Fill _fill;

    internal FillBuilder(Fill fill)
    {
        _fill = fill;
    }

    public FillBuilder Value(int value) { _fill.Value = value; return this; }
    public FillBuilder Target(int target) { _fill.Target = target; return this; }
    public FillBuilder Target(string target) { _fill.Target = target; return this; }
    public FillBuilder Target(bool target) { _fill.Target = target; return this; }
    public FillBuilder Target(object target) { _fill.Target = target; return this; }
    public FillBuilder Above(string above) { _fill.Above = above; return this; }
    public FillBuilder Below(string below) { _fill.Below = below; return this; }
}