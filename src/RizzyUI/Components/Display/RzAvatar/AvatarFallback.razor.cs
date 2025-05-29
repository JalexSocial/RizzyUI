
// src/RizzyUI/Components/Display/RzAvatar/AvatarFallback.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents the fallback content for an <see cref="RzAvatar"/>, typically displaying initials or a generic placeholder.
/// This component renders only if a sibling <see cref="AvatarImage"/> does not have a valid image source.
/// It must be a child of <see cref="RzAvatar"/>.
/// </summary>
public partial class AvatarFallback : RzComponent
{
    private bool _shouldRender;
    private string _initialsContainerClass = string.Empty;
    private string _placeholderContainerClass = string.Empty;
    private string _placeholderIconClass = string.Empty;

    /// <summary>
    /// Gets or sets the parent <see cref="RzAvatar"/> component.
    /// </summary>
    [CascadingParameter]
    public RzAvatar? ParentAvatar { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered as fallback, typically initials.
    /// If null or empty, a default SVG placeholder icon will be rendered.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentAvatar == null)
        {
            throw new InvalidOperationException($"{nameof(AvatarFallback)} must be used within an {nameof(RzAvatar)} component.");
        }
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        _shouldRender = ParentAvatar != null && !ParentAvatar.HasImage;

        if (_shouldRender && ParentAvatar != null)
        {
            var fallbackStyles = Theme.AvatarFallback; // RzStylesBase.AvatarFallbackStylesBase
            var avatarStyles = Theme.RzAvatar; // RzStylesBase.RzAvatarStylesBase

            if (ChildContent != null) // Rendering initials or custom content
            {
                _initialsContainerClass = TwMerge.Merge(
                    fallbackStyles.InitialsContainer,
                    avatarStyles.GetSizeCss(ParentAvatar.Size),
                    avatarStyles.GetShapeCss(ParentAvatar.Shape),
                    avatarStyles.GetInitialsSizeCss(ParentAvatar.Size)
                );
            }
            else // Rendering default SVG placeholder
            {
                _placeholderContainerClass = TwMerge.Merge(
                    fallbackStyles.PlaceholderContainer,
                    avatarStyles.GetSizeCss(ParentAvatar.Size),
                    avatarStyles.GetShapeCss(ParentAvatar.Shape)
                );
                _placeholderIconClass = TwMerge.Merge(
                    fallbackStyles.PlaceholderIcon,
                    avatarStyles.GetPlaceholderSizeCss(ParentAvatar.Size)
                );
            }
        }
    }
    
    /// <inheritdoc/>
    protected override string? RootClass()
    {
        if (!_shouldRender) return null;
        
        // The root class will be either for initials or for the placeholder container
        return ChildContent != null ? _initialsContainerClass : _placeholderContainerClass;
    }
}