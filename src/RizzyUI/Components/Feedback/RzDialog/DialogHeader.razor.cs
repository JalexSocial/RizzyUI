
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using RizzyUI.TailwindVariants;

namespace RizzyUI;

/// <summary>
/// A container for the header content of a <see cref="DialogContent"/>, typically containing a <see cref="DialogTitle"/> and <see cref="DialogDescription"/>.
/// </summary>
public partial class DialogHeader : RzComponent<DialogHeader.Slots>
{
    /// <summary>
    /// Defines the default styling for the DialogHeader component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex flex-col gap-2 text-center sm:text-left"
    );

    /// <summary>
    /// Gets or sets the content to be rendered inside the header.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.DialogHeader;

    /// <summary>
    /// Defines the slots available for styling in the DialogHeader component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}