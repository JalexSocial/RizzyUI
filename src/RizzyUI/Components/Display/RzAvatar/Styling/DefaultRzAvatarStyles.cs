namespace RizzyUI;

/// <summary>
///     Provides the default styles for the RzAvatar component.
/// </summary>
public class DefaultRzAvatarStyles : RzStylesBase.RzAvatarStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzAvatarStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance to use for styling.</param>
    public DefaultRzAvatarStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container =>
        "relative inline-block aspect-square object-cover"; // Base container styles, size added separately

    /// <inheritdoc />
    public override string Indicator =>
        "border-2 absolute right-0 top-0 rounded-full border-surface"; // Base indicator styles, size and color added separately

    /// <inheritdoc />
    public override string Image => "inline-block aspect-square"; // Base image styles, size and shape added separately

    /// <inheritdoc />
    public override string InitialsContainer =>
        "inline-flex items-center justify-center bg-surface-alt text-on-surface-muted dark:bg-surface-alt dark:text-on-surface-muted"; // Base initials container styles, size and shape added separately

    /// <inheritdoc />
    public override string PlaceholderContainer =>
        "inline-flex items-center justify-center bg-surface-alt text-outline dark:bg-surface-alt dark:text-outline"; // Base placeholder styles, size and shape added separately

    /// <inheritdoc />
    public override string PlaceholderIcon => "inline-block"; // Base placeholder icon styles, size added separately

    /// <inheritdoc />
    public override string GetShapeCss(AvatarShape shape)
    {
        return shape switch
        {
            AvatarShape.Circle => "rounded-full", // Use theme token for full roundness
            AvatarShape.Square => "rounded-theme",
            _ => "rounded-full"
        };
    }

    /// <inheritdoc />
    public override string GetSizeCss(Size size)
    {
        return size switch
        {
            Size.ExtraSmall => "size-6",
            Size.Small => "size-8",
            Size.Medium => "size-10",
            Size.Large => "size-14",
            Size.ExtraLarge => "size-20",
            _ => GetSizeCss(Size.Medium)
        };
    }

    /// <inheritdoc />
    public override string GetInitialsSizeCss(Size size)
    {
        return size switch
        {
            Size.ExtraSmall => "text-xs", // Adjusted from original text-sm for better fit
            Size.Small => "text-sm",
            Size.Medium => "text-base", // Adjusted from original empty
            Size.Large => "text-2xl",
            Size.ExtraLarge => "text-4xl",
            _ => GetInitialsSizeCss(Size.Medium)
        };
    }

    /// <inheritdoc />
    public override string GetPlaceholderSizeCss(Size size)
    {
        return size switch
        {
            Size.ExtraSmall => "size-4",
            Size.Small => "size-5",
            Size.Medium => "size-6",
            Size.Large => "size-8",
            Size.ExtraLarge => "size-10",
            _ => GetPlaceholderSizeCss(Size.Medium)
        };
    }

    /// <inheritdoc />
    public override string GetIndicatorSizeCss(Size size)
    {
        return size switch
        {
            Size.ExtraSmall => "size-3",
            Size.Small => "size-3",
            Size.Medium => "size-3",
            Size.Large => "size-4",
            Size.ExtraLarge => "size-5",
            _ => GetIndicatorSizeCss(Size.Medium)
        };
    }

    /// <inheritdoc />
    public override string GetIndicatorColorCss(AccentColor color)
    {
        return color.ToLightBackgroundClass() + " " + color.ToDarkBackgroundClass();
    }
}