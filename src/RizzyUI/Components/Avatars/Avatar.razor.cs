﻿using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Renders a user avatar, supporting image sources, initials fallback, and optional status indicators with customizable shape and size.
/// </summary>
public partial class Avatar : RizzyComponent
{
    /// <summary>
    /// Base CSS classes applied to the root element of the avatar component.
    /// </summary>
    private static readonly string BaseStyle = "relative inline-block aspect-square object-cover";

    /// <summary>
    /// Stores the initials to be displayed when no image source is provided.
    /// </summary>
    private string _initials = string.Empty;

    /// <summary>
    /// Gets or sets the source URL of the avatar image.
    /// </summary>
    [Parameter]
    public string ImageSource { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the display name associated with the avatar.
    /// </summary>
    [Parameter]
    public string DisplayName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the initials to display when no image is provided.
    /// Only the first two characters are used and are converted to uppercase.
    /// </summary>
    [Parameter]
#pragma warning disable BL0007
    public string Initials
#pragma warning restore BL0007
    {
        get => _initials;
        set => _initials = value.Length > 2 ? value.Substring(0, 2).ToUpper() : value.ToUpper();
    }

    /// <summary>
    /// Gets or sets the shape of the avatar. Defaults to a circle.
    /// </summary>
    [Parameter]
    public AvatarShape Shape { get; set; } = AvatarShape.Circle;

    /// <summary>
    /// Gets or sets the size of the avatar. Defaults to medium.
    /// </summary>
    [Parameter]
    public Size Size { get; set; } = Size.Medium;

    /// <summary>
    /// Gets or sets a value indicating whether the status indicator is visible.
    /// </summary>
    [Parameter]
    public bool IndicatorVisible { get; set; } = false;

    /// <summary>
    /// Gets or sets the accent color of the status indicator. Defaults to Emerald.
    /// </summary>
    [Parameter]
    public AccentColor IndicatorColor { get; set; } = AccentColor.Emerald;

    /// <summary>
    /// Gets or sets a value indicating whether the avatar has a border.
    /// </summary>
    [Parameter]
    public bool Border { get; set; } = false;

    /// <summary>
    /// Gets the alternate text for the avatar image, used for accessibility.
    /// </summary>
    private string AlternateText => string.IsNullOrEmpty(DisplayName) ? "User Avatar" : $"{DisplayName}";

    /// <summary>
    /// Computes the root CSS classes for the avatar component by merging base styles and size-specific classes.
    /// </summary>
    /// <returns>A string containing the merged CSS classes.</returns>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, BaseStyle, _variantsizes[Size]);
    }

    /// <summary>
    /// Dictionary mapping avatar shapes to their corresponding CSS classes.
    /// </summary>
    private static readonly Dictionary<AvatarShape, string> _variantShapes = new Dictionary<AvatarShape, string>()
    {
        { AvatarShape.Circle, "rounded-full" },
        { AvatarShape.Square, "rounded-lg" }
    };

    /// <summary>
    /// Dictionary mapping sizes to their corresponding CSS classes for the avatar.
    /// </summary>
    private static readonly Dictionary<Size, string> _variantsizes = new Dictionary<Size, string>()
    {
        { Size.ExtraSmall, "size-6" },
        { Size.Small, "size-8" },
        { Size.Medium, "size-10" },
        { Size.Large, "size-14" },
        { Size.ExtraLarge, "size-20" },
    };

    /// <summary>
    /// Dictionary mapping sizes to their corresponding CSS classes for initials text.
    /// </summary>
    private static readonly Dictionary<Size, string> _initialsSizes = new Dictionary<Size, string>()
    {
        { Size.ExtraSmall, "text-sm" },
        { Size.Small, "" },
        { Size.Medium, "" },
        { Size.Large, "text-2xl" },
        { Size.ExtraLarge, "text-4xl" },
    };

    /// <summary>
    /// Dictionary mapping sizes to their corresponding CSS classes for placeholder SVG.
    /// </summary>
    private static readonly Dictionary<Size, string> _placeholderSizes = new Dictionary<Size, string>()
    {
        { Size.ExtraSmall, "size-4" },
        { Size.Small, "size-5" },
        { Size.Medium, "size-6" },
        { Size.Large, "size-8" },
        { Size.ExtraLarge, "size-10" },
    };

    /// <summary>
    /// Dictionary mapping sizes to their corresponding CSS classes for the status indicator.
    /// </summary>
    private static readonly Dictionary<Size, string> _indicatorSizes = new Dictionary<Size, string>()
    {
        { Size.ExtraSmall, "size-3" },
        { Size.Small, "size-3" },
        { Size.Medium, "size-3" },
        { Size.Large, "size-4" },
        { Size.ExtraLarge, "size-5" },
    };
}
