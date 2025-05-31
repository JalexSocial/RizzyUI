
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
        "inline-flex items-center justify-center bg-muted text-foreground w-full h-full"; // Matches kitchen sink fallback span

    /// <inheritdoc/>
    public override string PlaceholderContainer =>
        "inline-flex items-center justify-center bg-muted text-muted-foreground w-full h-full"; // Similar to initials, but icon color might differ

    /// <inheritdoc/>
    public override string PlaceholderIcon => "inline-block"; // Size applied dynamically by RzAvatarStyles
}