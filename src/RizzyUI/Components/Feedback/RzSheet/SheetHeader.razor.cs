
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A container for the header content of a <see cref="SheetContent"/>, typically containing a <see cref="SheetTitle"/> and <see cref="SheetDescription"/>.
/// </summary>
public partial class SheetHeader : RzComponent<SheetHeader.Slots>
{
    /// <summary>
    /// Defines the default styling for the SheetHeader component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex flex-col gap-1.5 p-4 text-center sm:text-left"
    );

    /// <summary>
    /// Gets or sets the content to be rendered inside the header.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SheetHeader;

    /// <summary>
    /// Defines the slots available for styling in the SheetHeader component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}