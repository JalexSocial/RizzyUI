
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A container for grouping a list of <see cref="RzItem"/> components.
/// </summary>
public partial class RzItemGroup : RzComponent<RzItemGroup.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzItemGroup component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "group/item-group flex flex-col"
    );

    /// <summary>
    /// Gets or sets the content of the item group, which should be a series of <see cref="RzItem"/> components.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzItemGroup;

    /// <summary>
    /// Defines the slots available for styling in the RzItemGroup component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}