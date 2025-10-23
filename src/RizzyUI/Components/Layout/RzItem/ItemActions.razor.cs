
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A container for action elements, like buttons, within an <see cref="RzItem"/>.
/// </summary>
public partial class ItemActions : RzComponent<ItemActions.Slots>
{
    /// <summary>
    /// Defines the default styling for the ItemActions component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex items-center gap-2"
    );

    /// <summary>
    /// Gets or sets the content to be rendered, typically one or more buttons.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.ItemActions;

    /// <summary>
    /// Defines the slots available for styling in the ItemActions component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}