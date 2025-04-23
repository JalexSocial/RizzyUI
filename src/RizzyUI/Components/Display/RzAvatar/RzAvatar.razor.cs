
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Renders a user avatar, supporting image sources, initials fallback, and optional status indicators.
///     Styling and dimensions are determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzAvatar : RzComponent
{
    private string _initials = string.Empty;

    /// <summary> Gets or sets the source URL of the avatar image. </summary>
    [Parameter]
    public string ImageSource { get; set; } = string.Empty;

    /// <summary> Gets or sets the display name associated with the avatar (used for alt text). </summary>
    [Parameter]
    public string DisplayName { get; set; } = string.Empty;

    /// <summary> Gets or sets the initials to display when no image is provided (max 2 chars, uppercase). </summary>
    [Parameter]
#pragma warning disable BL0007
    public string Initials
#pragma warning restore BL0007
    {
        get => _initials;
        set => _initials = value != null && value.Length > 2
            ? value.Substring(0, 2).ToUpperInvariant()
            : (value ?? string.Empty).ToUpperInvariant();
    }

    /// <summary> Gets or sets the shape of the avatar. Defaults to Circle. </summary>
    [Parameter]
    public AvatarShape Shape { get; set; } = AvatarShape.Circle;

    /// <summary> Gets or sets the size of the avatar. Defaults to Medium. </summary>
    [Parameter]
    public Size Size { get; set; } = Size.Medium;

    /// <summary> Gets or sets a value indicating whether the status indicator is visible. </summary>
    [Parameter]
    public bool IndicatorVisible { get; set; }

    /// <summary> Gets or sets the accent color of the status indicator. Defaults to Emerald. </summary>
    [Parameter]
    public AccentColor IndicatorColor { get; set; } = AccentColor.Emerald;

    /// <summary>
    ///     Gets or sets a value indicating whether the avatar has a border (Currently not implemented in default
    ///     styles).
    /// </summary>
    [Parameter]
    public bool Border { get; set; } // Note: Border styling needs explicit addition if desired

    /// <summary> Gets the alternate text for the avatar image, used for accessibility. </summary>
    private string AlternateText => string.IsNullOrEmpty(DisplayName) ? "User Avatar" : $"{DisplayName}";

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzAvatar.Container ?? string.Empty, Theme.RzAvatar.GetSizeCss(Size));
    }
}