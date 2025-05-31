
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
        "relative inline-flex items-center justify-center shrink-0 aspect-square object-cover overflow-hidden align-middle"; // Added align-middle and shrink-0

    /// <inheritdoc/>
    public override string Border => "border-2 border-background ring-2 ring-border"; // Example border style, kitchen sink uses ring for stacked avatars

    /// <inheritdoc/>
    public override string GetShapeCss(AvatarShape shape)
    {
        return shape switch
        {
            AvatarShape.Circle => "rounded-full",
            AvatarShape.Square => "rounded-lg", // Kitchen sink uses rounded-lg for square-ish avatars
            _ => "rounded-full"
        };
    }

    /// <inheritdoc/>
    public override string GetSizeCss(Size size)
    {
        // These classes apply to the RzAvatar container itself
        // Mapping to kitchen sink's `size-*` utilities
        return size switch
        {
            Size.ExtraSmall => "size-6", // Assuming kitchen sink might have this or similar
            Size.Small => "size-8",      // Matches kitchen sink's size-8
            Size.Medium => "size-10",    // Common medium size
            Size.Large => "size-12",     // Matches kitchen sink's size-12
            Size.ExtraLarge => "size-16", // Larger size
            _ => GetSizeCss(Size.Medium)
        };
    }

    /// <inheritdoc/>
    public override string GetInitialsSizeCss(Size size)
    {
        // This will be used by AvatarFallback when rendering initials
        // Font size should scale with avatar size
        return size switch
        {
            Size.ExtraSmall => "text-xs",
            Size.Small => "text-sm",
            Size.Medium => "text-base", // e.g., for size-10 avatar
            Size.Large => "text-lg",   // e.g., for size-12 avatar
            Size.ExtraLarge => "text-xl", // e.g., for size-16 avatar
            _ => GetInitialsSizeCss(Size.Medium)
        };
    }

    /// <inheritdoc/>
    public override string GetPlaceholderSizeCss(Size size)
    {
        // This will be used by AvatarFallback for the default SVG placeholder icon
        // Icon size should scale appropriately within the avatar
        return size switch
        {
            Size.ExtraSmall => "size-3/5", // Proportionate to container
            Size.Small => "size-3/5",
            Size.Medium => "size-3/5",
            Size.Large => "size-3/5",
            Size.ExtraLarge => "size-3/5",
            _ => GetPlaceholderSizeCss(Size.Medium)
        };
    }
}