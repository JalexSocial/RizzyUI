
// src/RizzyUI/Components/Display/RzAvatar/Styling/DefaultAvatarImageStyles.cs
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the <see cref="AvatarImage"/> component.
/// </summary>
public class DefaultAvatarImageStyles : RzStylesBase.AvatarImageStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultAvatarImageStyles"/> class.
    /// </summary>
    /// <param name="theme">The theme instance to use for styling.</param>
    public DefaultAvatarImageStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc/>
    public override string Image => "inline-block aspect-square object-cover w-full h-full"; // Matches kitchen sink img styles
}