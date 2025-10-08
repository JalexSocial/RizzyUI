
// src/RizzyUI/Components/Layout/RzItem/ItemMedia.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A container for media elements like icons or images within an <see cref="RzItem"/>.
/// </summary>
public partial class ItemMedia : RzComponent
{
    /// <summary>
    /// Gets or sets the content of the media container.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the visual variant of the media container.
    /// Defaults to <see cref="ItemMediaVariant.Default"/>.
    /// </summary>
    [Parameter]
    public ItemMediaVariant Variant { get; set; } = ItemMediaVariant.Default;

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        var styles = Theme.ItemMedia;
        return TwMerge.Merge(
            AdditionalAttributes,
            styles.MediaBase,
            styles.GetVariantCss(Variant)
        );
    }
}