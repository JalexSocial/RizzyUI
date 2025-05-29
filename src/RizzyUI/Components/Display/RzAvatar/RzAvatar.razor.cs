
// src/RizzyUI/Components/Display/RzAvatar/RzAvatar.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A container component for displaying an avatar. It coordinates child components 
/// <see cref="AvatarImage"/> and <see cref="AvatarFallback"/> to render an image or a fallback representation.
/// It also serves as an anchor for an optional <see cref="RzIndicator"/> child component.
/// Styling for the container (shape, size, border) is determined by its parameters and the active <see cref="RzTheme"/>.
/// </summary>
public partial class RzAvatar : RzComponent
{
    private bool _hasImage;

    /// <summary>
    /// Gets or sets the shape of the avatar. Defaults to <see cref="AvatarShape.Circle"/>.
    /// </summary>
    [Parameter] public AvatarShape Shape { get; set; } = AvatarShape.Circle;

    /// <summary>
    /// Gets or sets the size of the avatar. Defaults to <see cref="Size.Medium"/>.
    /// </summary>
    [Parameter] public Size Size { get; set; } = Size.Medium;

    /// <summary>
    /// Gets or sets a value indicating whether the avatar has a border.
    /// Note: Default themes may not include border styling; custom themes or classes might be needed.
    /// </summary>
    [Parameter] public bool Border { get; set; }

    /// <summary>
    /// Gets or sets the ARIA label for the avatar container.
    /// If not set, a default localized label "Avatar" will be used.
    /// </summary>
    [Parameter] public string? AriaLabel { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered inside the avatar container. 
    /// This typically includes an <see cref="AvatarImage"/>, an <see cref="AvatarFallback"/>,
    /// and optionally an <see cref="RzIndicator"/>.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets a value indicating whether a child <see cref="AvatarImage"/> with a valid source is present.
    /// This is used by <see cref="AvatarFallback"/> to determine if it should render.
    /// </summary>
    internal bool HasImage => _hasImage;

    /// <summary>
    /// Gets the effective ARIA label, using the provided <see cref="AriaLabel"/> or a localized default.
    /// </summary>
    internal string EffectiveAriaLabel => AriaLabel ?? Localizer["RzAvatar.DefaultAriaLabel"];

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        AriaLabel ??= Localizer["RzAvatar.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzAvatar.DefaultAriaLabel"];
    }

    /// <summary>
    /// Internal method called by <see cref="AvatarImage"/> to update the image status.
    /// </summary>
    /// <param name="hasImage">True if the AvatarImage has a valid source, false otherwise.</param>
    internal void SetImageStatus(bool hasImage)
    {
        if (_hasImage != hasImage)
        {
            _hasImage = hasImage;
            StateHasChanged(); 
        }
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        var s = Theme.RzAvatar; 
        return TwMerge.Merge(
            AdditionalAttributes,
            s.Container,
            s.GetSizeCss(Size),
            s.GetShapeCss(Shape),
            Border ? s.Border : null
        );
    }
}