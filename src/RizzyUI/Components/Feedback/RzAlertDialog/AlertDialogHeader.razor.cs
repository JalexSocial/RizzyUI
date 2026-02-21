using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Header container for <see cref="RzAlertDialog"/> content.
/// </summary>
public partial class AlertDialogHeader : RzComponent<AlertDialogHeader.Slots>
{
    /// <summary>
    /// Defines the default styling for the AlertDialogHeader component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(@base: "flex flex-col gap-2 text-center sm:text-left");

    /// <summary>
    /// Gets or sets the content rendered inside the header.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "div";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.AlertDialogHeader;

    /// <summary>
    /// Defines the slots available for styling in the AlertDialogHeader component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Base slot for the header container.
        /// </summary>
        [Slot("alert-dialog-header")]
        public string? Base { get; set; }
    }
}
