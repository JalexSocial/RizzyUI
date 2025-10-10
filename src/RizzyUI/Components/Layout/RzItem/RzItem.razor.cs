
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A flexible container for displaying content in a list item format, with support for various styles and sizes.
/// </summary>
public partial class RzItem : RzAsChildComponent<RzItem.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzItem component.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "group/item flex items-center border border-transparent text-sm rounded-md transition-colors [a]:hover:bg-accent/50 [a]:transition-colors duration-100 flex-wrap outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        variants: new()
        {
            [i => ((RzItem)i).Variant] = new Variant<ItemVariant, Slots>
            {
                [ItemVariant.Outline] = "border-border",
                [ItemVariant.Muted] = "bg-muted/50",
                [ItemVariant.Default] = "bg-transparent"
            },
            [i => ((RzItem)i).Size] = new Variant<Size, Slots>
            {
                [Size.Small] = "py-3 px-4 gap-2.5",
                [Size.Medium] = "p-4 gap-4"
            }
        }
    );

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
    /// Defaults to <see cref="Size.Medium"/>.
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
            ["class"] = _slots.GetBase(),
            ["data-slot"] = "item",
            ["data-variant"] = Variant.ToString().ToLowerInvariant(),
            ["data-size"] = Size == Size.Small ? "sm" : "default"
        };
        return attributes;
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.RzItem;

    /// <summary>
    /// Defines the slots available for styling in the RzItem component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}