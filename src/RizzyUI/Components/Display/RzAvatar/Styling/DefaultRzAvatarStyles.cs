
// src/RizzyUI/Components/Display/RzAvatar/Styling/DefaultRzAvatarStyles.cs
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the <see cref="RzAvatar"/> container component.
/// </summary>
public class DefaultRzAvatarStyles : RzStylesBase.RzAvatarStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzAvatarStyles"/> class.
    /// </summary>
    /// <param name="theme">The theme instance to use for styling.</param>
    public DefaultRzAvatarStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc/>
    public override string Container =>
        "relative inline-block aspect-square object-cover overflow-hidden"; // Added overflow-hidden

    /// <inheritdoc/>
    public override string Border => "border-2 border-outline dark:border-outline-dark"; // Example border style

    /// <inheritdoc/>
    public override string GetShapeCss(AvatarShape shape)
    {
        return shape switch
        {
            AvatarShape.Circle => "rounded-full",
            AvatarShape.Square => "rounded-theme", // Use theme's border radius
            _ => "rounded-full"
        };
    }

    /// <inheritdoc/>
    public override string GetSizeCss(Size size)
    {
        // These classes apply to the RzAvatar container itself
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

    /// <inheritdoc/>
    public override string GetInitialsSizeCss(Size size)
    {
        // This will be used by AvatarFallback when rendering initials
        return size switch
        {
            Size.ExtraSmall => "text-xs",
            Size.Small => "text-sm",
            Size.Medium => "text-base",
            Size.Large => "text-2xl",
            Size.ExtraLarge => "text-4xl",
            _ => GetInitialsSizeCss(Size.Medium)
        };
    }

    /// <inheritdoc/>
    public override string GetPlaceholderSizeCss(Size size)
    {
        // This will be used by AvatarFallback for the default SVG placeholder icon
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
}