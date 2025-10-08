
// src/RizzyUI/Components/Layout/RzItem/RzItem.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A flexible container for displaying content in a list item format, with support for various styles and sizes.
/// </summary>
public partial class RzItem : RzAsChildComponent
{
    /// <summary>
    /// Gets or sets the content to be rendered inside the item.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the visual variant of the item.
    /// Defaults to <see cref="ItemVariant.Default"/>.
    /// </summary>
    [Parameter]
    public ItemVariant Variant { get; set; } = ItemVariant.Default;

    /// <summary>
    /// Gets or sets the size of the item, affecting padding and gap.
    /// Defaults to <see cref="Size.Medium"/> (which maps to 'default' in styling).
    /// </summary>
    [Parameter]
    public Size Size { get; set; } = Size.Medium;

    /// <inheritdoc/>
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc/>
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(AdditionalAttributes ?? new(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = Id,
            ["class"] = RootClass(),
            ["data-slot"] = "item",
            ["data-variant"] = Variant.ToString().ToLowerInvariant(),
            ["data-size"] = Size == Size.Small ? "sm" : "default"
        };
        return attributes;
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        var styles = Theme.RzItem;
        return TwMerge.Merge(
            AdditionalAttributes,
            styles.ItemBase,
            styles.GetVariantCss(Variant),
            styles.GetSizeCss(Size)
        );
    }
}