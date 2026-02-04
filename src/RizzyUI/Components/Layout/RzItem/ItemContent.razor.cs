
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// The main content area of an <see cref="RzItem"/>, typically containing <see cref="ItemTitle"/> and <see cref="ItemDescription"/>.
/// </summary>
public partial class ItemContent : RzComponent<ItemContent.Slots>
{
    /// <summary>
    /// Defines the default styling for the ItemContent component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none"
    );

    /// <summary>
    /// Gets or sets the content to be rendered.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.ItemContent;

    /// <summary>
    /// Defines the slots available for styling in the ItemContent component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}