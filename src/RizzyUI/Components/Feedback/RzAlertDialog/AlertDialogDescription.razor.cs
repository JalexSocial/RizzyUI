using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Description text for an alert dialog.
/// </summary>
public partial class AlertDialogDescription : RzComponent<AlertDialogDescription.Slots>
{
    /// <summary>
    /// Defines the default styling for the AlertDialogDescription component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(@base: "text-sm text-muted-foreground");

    /// <summary>
    /// Gets or sets the parent <see cref="RzAlertDialog"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzAlertDialog? ParentAlertDialog { get; set; }

    /// <summary>
    /// Gets or sets the description content.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "p";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.AlertDialogDescription;

    /// <summary>
    /// Defines slots available for styling in <see cref="AlertDialogDescription"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Base slot for the description element.
        /// </summary>
        [Slot("alert-dialog-description")]
        public string? Base { get; set; }
    }
}
