
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using RizzyUI.TailwindVariants;

namespace RizzyUI;

/// <summary>
/// A container for the footer content of a <see cref="DialogContent"/>, typically for action buttons.
/// </summary>
public partial class DialogFooter : RzComponent<DialogFooter.Slots>
{
    /// <summary>
    /// Defines the default styling for the DialogFooter component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
    );

    /// <summary>
    /// Gets or sets the content to be rendered inside the footer.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.DialogFooter;

    /// <summary>
    /// Defines the slots available for styling in the DialogFooter component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}