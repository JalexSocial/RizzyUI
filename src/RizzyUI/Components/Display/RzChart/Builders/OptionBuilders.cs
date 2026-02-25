
namespace RizzyUI.Charts;

/// <summary>
/// Builder for configuring global chart options such as layout, animations, and interactions.
/// </summary>
public class OptionsBuilder
{
    private readonly Options _options;

    internal OptionsBuilder(Options options)
    {
        _options = options;
    }

    /// <summary>
    /// Resizes the chart canvas when its container does.
    /// </summary>
    public OptionsBuilder Responsive(bool responsive) { _options.Responsive = responsive; return this; }

    /// <summary>
    /// Maintain the original canvas aspect ratio (width / height) when resizing. 
    /// Set to false to allow the chart to fill a specific container height.
    /// </summary>
    public OptionsBuilder MaintainAspectRatio(bool maintainAspectRatio) { _options.MaintainAspectRatio = maintainAspectRatio; return this; }

    /// <summary>
    /// Sets the canvas aspect ratio. Default is 2 for most charts, 1 for radial charts.
    /// </summary>
    public OptionsBuilder AspectRatio(int aspectRatio) { _options.AspectRatio = aspectRatio; return this; }

    /// <summary>
    /// Registers a global JavaScript function name called when a resize occurs.
    /// </summary>
    public OptionsBuilder OnResize(string onResize) { _options.OnResize = onResize; return this; }

    /// <summary>
    /// Registers a global JavaScript function name called when any events fire over the chart area.
    /// </summary>
    public OptionsBuilder OnHover(string onHover) { _options.OnHover = onHover; return this; }

    /// <summary>
    /// Defines the browser events that the chart should listen to (e.g. click, mousemove).
    /// </summary>
    public OptionsBuilder Events(params ChartEvent[] events) { _options.Events = events; return this; }

    /// <summary>
    /// Registers a global JavaScript function name called when a click event is registered.
    /// </summary>
    public OptionsBuilder OnClick(string onClick) { _options.OnClick = onClick; return this; }

    /// <summary>
    /// Delay the resize update by the given amount of milliseconds.
    /// </summary>
    public OptionsBuilder ResizeDelay(int delay) { _options.ResizeDelay = delay; return this; }

    /// <summary>
    /// Sets the BCP 47 language tag for number and date formatting.
    /// </summary>
    public OptionsBuilder Locale(string locale) { _options.Locale = locale; return this; }

    /// <summary>
    /// Configures plugin options like Legend, Title, and Tooltips.
    /// </summary>
    public OptionsBuilder Plugins(Action<PluginsBuilder> action)
    {
        _options.Plugins = new Plugins();
        action(new PluginsBuilder(_options.Plugins));
        return this;
    }

    /// <summary>
    /// Configures the chart layout, including padding.
    /// </summary>
    public OptionsBuilder Layout(Action<LayoutBuilder> action)
    {
        _options.Layout = new Layout();
        action(new LayoutBuilder(_options.Layout));
        return this;
    }

    /// <summary>
    /// Configures core animation settings for the chart.
    /// </summary>
    public OptionsBuilder Animation(Action<AnimationBuilder> action)
    {
        _options.Animation = new Animation();
        action(new AnimationBuilder(_options.Animation));
        return this;
    }

    /// <summary>
    /// Configures how users interact with the chart (hover, tooltips).
    /// </summary>
    public OptionsBuilder Interaction(Action<InteractionBuilder> action)
    {
        _options.Interaction = new Interaction();
        action(new InteractionBuilder(_options.Interaction));
        return this;
    }

    /// <summary>
    /// Configures the axes/scales for the chart.
    /// </summary>
    public OptionsBuilder Scales(Action<ScaleBuilder> action)
    {
        _options.Scales = new Dictionary<string, Scale>();
        action(new ScaleBuilder(_options.Scales));
        return this;
    }

    /// <summary>
    /// Configures property-specific animations.
    /// </summary>
    public OptionsBuilder Animations(Action<AnimationBuilder> action)
    {
        _options.Animations = new Dictionary<string, Animation>();
        action(new AnimationBuilder(_options.Animations));
        return this;
    }

    /// <summary>
    /// Configures global defaults for all elements (point, line, bar, arc).
    /// </summary>
    public OptionsBuilder Elements(Action<ElementsBuilder> action)
    {
        _options.Elements = new Elements();
        action(new ElementsBuilder(_options.Elements));
        return this;
    }

    /// <summary>
    /// Enables or disables automatic data parsing.
    /// </summary>
    public OptionsBuilder Parsing(bool enabled) { _options.Parsing = enabled; return this; }

    /// <summary>
    /// Sets the data key for parsing objects.
    /// </summary>
    public OptionsBuilder Parsing(string key) { _options.Parsing = new Parsing { Key = key }; return this; }

    /// <summary>
    /// Sets specific data keys for X and Y axis parsing.
    /// </summary>
    public OptionsBuilder Parsing(string xAxisKey, string yAxisKey) { _options.Parsing = new Parsing { XAxisKey = xAxisKey, YAxisKey = yAxisKey }; return this; }
}

/// <summary>
/// Builder for configuring animation behaviors.
/// </summary>
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
        _animation = new Animation();
    }

    /// <summary>
    /// Starts configuration for a specific named animation property.
    /// </summary>
    public AnimationBuilder Animation(string animation)
    {
        if (_animations == null) throw new InvalidOperationException("Cannot add named animation unless building an Animations dictionary.");
        _animation = new Animation();
        _animations.Add(animation, _animation);
        return this;
    }

    /// <summary>
    /// Duration of the animation in milliseconds.
    /// </summary>
    public AnimationBuilder Duration(int duration) { _animation.Duration = duration; return this; }

    /// <summary>
    /// The easing function used for the animation.
    /// </summary>
    public AnimationBuilder Easing(AnimationEasing easing) { _animation.Easing = easing; return this; }

    /// <summary>
    /// Delay before starting the animation in milliseconds.
    /// </summary>
    public AnimationBuilder Delay(int delay) { _animation.Delay = delay; return this; }

    /// <summary>
    /// If true, the animation loops endlessly.
    /// </summary>
    public AnimationBuilder Loop(bool loop) { _animation.Loop = loop; return this; }

    /// <summary>
    /// JavaScript function name called on each step of the animation.
    /// </summary>
    public AnimationBuilder OnProgress(string onProgress) { _animation.OnProgress = onProgress; return this; }

    /// <summary>
    /// JavaScript function name called when the animation is complete.
    /// </summary>
    public AnimationBuilder OnComplete(string onComplete) { _animation.OnComplete = onComplete; return this; }

    /// <summary>
    /// Start value for the animation.
    /// </summary>
    public AnimationBuilder From(bool from) { _animation.From = from; return this; }
    /// <summary>
    /// Start value for the animation.
    /// </summary>
    public AnimationBuilder From(int from) { _animation.From = from; return this; }
    /// <summary>
    /// Start value for the animation.
    /// </summary>
    public AnimationBuilder From(string from) { _animation.From = from; return this; }
    /// <summary>
    /// End value for the animation.
    /// </summary>
    public AnimationBuilder To(bool to) { _animation.To = to; return this; }
    /// <summary>
    /// End value for the animation.
    /// </summary>
    public AnimationBuilder To(int to) { _animation.To = to; return this; }
    /// <summary>
    /// End value for the animation.
    /// </summary>
    public AnimationBuilder To(string to) { _animation.To = to; return this; }
}

/// <summary>
/// Builder for configuring font styles.
/// </summary>
public class FontBuilder
{
    private readonly ChartFont _font;

    internal FontBuilder(ChartFont font)
    {
        _font = font;
    }

    /// <summary>
    /// Sets the font family.
    /// </summary>
    public FontBuilder Family(string family) { _font.Family = family; return this; }

    /// <summary>
    /// Sets the font size in pixels.
    /// </summary>
    public FontBuilder Size(double size) { _font.Size = size; return this; }

    /// <summary>
    /// Sets the font style (e.g. 'italic', 'normal').
    /// </summary>
    public FontBuilder Style(string style) { _font.Style = style; return this; }

    /// <summary>
    /// Sets the font weight using a semantic value.
    /// </summary>
    public FontBuilder Weight(FontWeight weight) { _font.Weight = ChartJsEnumMapper.ToChartJsString(weight); return this; }

    /// <summary>
    /// Sets the font weight using a numeric value (e.g. 400, 700).
    /// </summary>
    public FontBuilder Weight(int weight) { _font.Weight = weight; return this; }

    /// <summary>
    /// Sets the line height as a string (e.g. '1.2', '24px').
    /// </summary>
    public FontBuilder LineHeight(string lineHeight) { _font.LineHeight = lineHeight; return this; }

    /// <summary>
    /// Sets the line height as a multiplier of the font size.
    /// </summary>
    public FontBuilder LineHeight(double lineHeight) { _font.LineHeight = lineHeight; return this; }
}

/// <summary>
/// Builder for configuring chart interaction behavior.
/// </summary>
public class InteractionBuilder
{
    private readonly Interaction _interaction;

    internal InteractionBuilder(Interaction interaction)
    {
        _interaction = interaction;
    }

    /// <summary>
    /// Sets which elements appear in the interaction (e.g. 'nearest', 'index').
    /// </summary>
    public InteractionBuilder Mode(InteractionMode mode) { _interaction.Mode = mode; return this; }

    /// <summary>
    /// If true, the interaction mode only applies when the mouse position intersects an item.
    /// </summary>
    public InteractionBuilder Intersect(bool intersect) { _interaction.Intersect = intersect; return this; }

    /// <summary>
    /// Defines which directions are used in calculating distances.
    /// </summary>
    public InteractionBuilder Axis(Axis axis) { _interaction.Axis = axis; return this; }

    /// <summary>
    /// If true, points outside the chart area are included in interactions.
    /// </summary>
    public InteractionBuilder IncludeInvisible(bool includeInvisible) { _interaction.IncludeInvisible = includeInvisible; return this; }
}

/// <summary>
/// Builder for configuring chart layout.
/// </summary>
public class LayoutBuilder
{
    private readonly Layout _layout;

    internal LayoutBuilder(Layout layout)
    {
        _layout = layout;
    }

    /// <summary>
    /// If true, applies automatic padding so visible elements are completely drawn.
    /// </summary>
    public LayoutBuilder AutoPadding(bool autoPadding) { _layout.AutoPadding = autoPadding; return this; }

    /// <summary>
    /// Sets uniform padding for all sides in pixels.
    /// </summary>
    public LayoutBuilder Padding(int padding) { _layout.Padding = new Padding(padding); return this; }

    /// <summary>
    /// Configures granular padding for each side.
    /// </summary>
    public LayoutBuilder Padding(Action<PaddingBuilder> action)
    {
        _layout.Padding = new Padding();
        action(new PaddingBuilder(_layout.Padding));
        return this;
    }
}

/// <summary>
/// Builder for configuring granular padding.
/// </summary>
public class PaddingBuilder
{
    private readonly Padding _padding;

    internal PaddingBuilder(Padding padding)
    {
        _padding = padding;
    }

    /// <summary> Left padding in pixels. </summary>
    public PaddingBuilder Left(int left) { _padding.Left = left; return this; }
    /// <summary> Right padding in pixels. </summary>
    public PaddingBuilder Right(int right) { _padding.Right = right; return this; }
    /// <summary> Top padding in pixels. </summary>
    public PaddingBuilder Top(int top) { _padding.Top = top; return this; }
    /// <summary> Bottom padding in pixels. </summary>
    public PaddingBuilder Bottom(int bottom) { _padding.Bottom = bottom; return this; }
    /// <summary> Sets both left and right padding to the same value. </summary>
    public PaddingBuilder X(int x) { _padding.Left = x; _padding.Right = x; return this; }
    /// <summary> Sets both top and bottom padding to the same value. </summary>
    public PaddingBuilder Y(int y) { _padding.Top = y; _padding.Bottom = y; return this; }
}

/// <summary>
/// Builder for configuring border radius on rectangles.
/// </summary>
public class BorderRadiusBuilder
{
    private readonly BorderRadius _borderRadius;

    internal BorderRadiusBuilder(BorderRadius borderRadius)
    {
        _borderRadius = borderRadius;
    }

    /// <summary> Top-left corner radius in pixels. </summary>
    public BorderRadiusBuilder TopLeft(int topLeft) { _borderRadius.TopLeft = topLeft; return this; }
    /// <summary> Top-right corner radius in pixels. </summary>
    public BorderRadiusBuilder TopRight(int topRight) { _borderRadius.TopRight = topRight; return this; }
    /// <summary> Bottom-left corner radius in pixels. </summary>
    public BorderRadiusBuilder BottomLeft(int bottomLeft) { _borderRadius.BottomLeft = bottomLeft; return this; }
    /// <summary> Bottom-right corner radius in pixels. </summary>
    public BorderRadiusBuilder BottomRight(int bottomRight) { _borderRadius.BottomRight = bottomRight; return this; }
}

/// <summary>
/// Builder for configuring specific border widths.
/// </summary>
public class BorderWidthBuilder
{
    private readonly BorderWidth _borderWidth;

    internal BorderWidthBuilder(BorderWidth borderWidth)
    {
        _borderWidth = borderWidth;
    }

    /// <summary> Left border width in pixels. </summary>
    public BorderWidthBuilder Left(int left) { _borderWidth.Left = left; return this; }
    /// <summary> Right border width in pixels. </summary>
    public BorderWidthBuilder Right(int right) { _borderWidth.Right = right; return this; }
    /// <summary> Top border width in pixels. </summary>
    public BorderWidthBuilder Top(int top) { _borderWidth.Top = top; return this; }
    /// <summary> Bottom border width in pixels. </summary>
    public BorderWidthBuilder Bottom(int bottom) { _borderWidth.Bottom = bottom; return this; }
}

/// <summary>
/// Builder for configuring how datasets are clipped.
/// </summary>
public class ClipBuilder
{
    private readonly Clip _clip;

    internal ClipBuilder(Clip clip)
    {
        _clip = clip;
    }

    /// <summary> Left clipping in pixels (positive = allow overflow). </summary>
    public ClipBuilder Left(int left) { _clip.Left = left; return this; }
    /// <summary> Enables/disables left clipping. </summary>
    public ClipBuilder Left(bool left) { _clip.Left = left; return this; }
    /// <summary> Right clipping in pixels. </summary>
    public ClipBuilder Right(int right) { _clip.Right = right; return this; }
    /// <summary> Enables/disables right clipping. </summary>
    public ClipBuilder Right(bool right) { _clip.Right = right; return this; }
    /// <summary> Top clipping in pixels. </summary>
    public ClipBuilder Top(int top) { _clip.Top = top; return this; }
    /// <summary> Enables/disables top clipping. </summary>
    public ClipBuilder Top(bool top) { _clip.Top = top; return this; }
    /// <summary> Bottom clipping in pixels. </summary>
    public ClipBuilder Bottom(int bottom) { _clip.Bottom = bottom; return this; }
    /// <summary> Enables/disables bottom clipping. </summary>
    public ClipBuilder Bottom(bool bottom) { _clip.Bottom = bottom; return this; }
}

/// <summary>
/// Builder for configuring area fill options for lines and radar charts.
/// </summary>
public class FillBuilder
{
    private readonly Fill _fill;

    internal FillBuilder(Fill fill)
    {
        _fill = fill;
    }

    /// <summary> Sets an absolute value for the fill boundary. </summary>
    public FillBuilder Value(int value) { _fill.Value = value; return this; }
    /// <summary> Sets the dataset index target for the fill. </summary>
    public FillBuilder Target(int target) { _fill.Target = target; return this; }
    /// <summary> Sets a named target boundary ('origin', 'start', 'end'). </summary>
    public FillBuilder Target(string target) { _fill.Target = target; return this; }
    /// <summary> Enables or disables filling. </summary>
    public FillBuilder Target(bool target) { _fill.Target = target; return this; }
    /// <summary> Sets a complex target object. </summary>
    public FillBuilder Target(object target) { _fill.Target = target; return this; }
    /// <summary> Fill color when the area is above the target. </summary>
    public FillBuilder Above(string above) { _fill.Above = above; return this; }
    /// <summary> Fill color when the area is below the target. </summary>
    public FillBuilder Below(string below) { _fill.Below = below; return this; }
}