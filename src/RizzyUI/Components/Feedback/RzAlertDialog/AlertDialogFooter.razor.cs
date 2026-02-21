using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Footer container for action controls in an alert dialog.
/// </summary>
public partial class AlertDialogFooter : RzComponent<AlertDialogFooter.Slots>
{
    /// <summary>
    /// Defines the default styling for the AlertDialogFooter component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(@base: "flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2");

    /// <summary>
    /// Gets or sets the parent <see cref="RzAlertDialog"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzAlertDialog? ParentAlertDialog { get; set; }

    /// <summary>
    /// Gets or sets the content rendered in the footer.
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
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.AlertDialogFooter;

    /// <summary>
    /// Defines slots available for styling in <see cref="AlertDialogFooter"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Base slot for the footer container.
        /// </summary>
        [Slot("alert-dialog-footer")]
        public string? Base { get; set; }
    }
}
