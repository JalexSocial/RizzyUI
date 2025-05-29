
// src/RizzyUI/Components/Display/RzAvatar/AvatarImage.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents the image part of an <see cref="RzAvatar"/>. 
/// It renders an `<img>` tag if <see cref="ImageSource"/> is provided and valid.
/// This component must be a child of <see cref="RzAvatar"/>.
/// </summary>
public partial class AvatarImage : RzComponent
{
    private bool _renderImage;

    /// <summary>
    /// Gets or sets the parent <see cref="RzAvatar"/> component.
    /// </summary>
    [CascadingParameter]
    public RzAvatar? ParentAvatar { get; set; }

    /// <summary>
    /// Gets or sets the source URL for the avatar image.
    /// </summary>
    [Parameter] public string? ImageSource { get; set; }

    /// <summary>
    /// Gets or sets the alternate text for the avatar image, used for accessibility.
    /// If not provided, it will default to "User Avatar" or the parent RzAvatar's AriaLabel if available.
    /// </summary>
    [Parameter] public string? AlternateText { get; set; }

    /// <summary>
    /// Gets the effective alternate text for the image.
    /// </summary>
    protected string EffectiveAlternateText => AlternateText ?? ParentAvatar?.EffectiveAriaLabel ?? Localizer["RzAvatar.DefaultAriaLabel"];

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentAvatar == null)
        {
            throw new InvalidOperationException($"{nameof(AvatarImage)} must be used within an {nameof(RzAvatar)} component.");
        }
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        _renderImage = !string.IsNullOrWhiteSpace(ImageSource);
        ParentAvatar?.SetImageStatus(_renderImage);
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        if (!_renderImage || ParentAvatar == null) return null;

        var s = Theme.AvatarImage; // RzStylesBase.AvatarImageStylesBase
        // Get shape and size classes from parent RzAvatar's theme provider
        var parentAvatarStyles = Theme.RzAvatar; // RzStylesBase.RzAvatarStylesBase
        
        return TwMerge.Merge(
            AdditionalAttributes,
            s.Image,
            parentAvatarStyles.GetSizeCss(ParentAvatar.Size),
            parentAvatarStyles.GetShapeCss(ParentAvatar.Shape)
        );
    }
}