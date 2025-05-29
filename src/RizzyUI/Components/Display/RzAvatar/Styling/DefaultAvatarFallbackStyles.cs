
// src/RizzyUI/Components/Display/RzAvatar/Styling/DefaultAvatarFallbackStyles.cs
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the <see cref="AvatarFallback"/> component.
/// </summary>
public class DefaultAvatarFallbackStyles : RzStylesBase.AvatarFallbackStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultAvatarFallbackStyles"/> class.
    /// </summary>
    /// <param name="theme">The theme instance to use for styling.</param>
    public DefaultAvatarFallbackStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc/>
    public override string InitialsContainer =>
        "inline-flex items-center justify-center bg-surface-alt text-on-surface-muted dark:bg-surface-alt dark:text-on-surface-muted w-full h-full";

    /// <inheritdoc/>
    public override string PlaceholderContainer =>
        "inline-flex items-center justify-center bg-surface-alt text-outline dark:bg-surface-alt dark:text-outline w-full h-full";

    /// <inheritdoc/>
    public override string PlaceholderIcon => "inline-block"; // Size applied dynamically
}