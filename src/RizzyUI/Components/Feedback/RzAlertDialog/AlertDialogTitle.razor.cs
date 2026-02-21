using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Title element for an alert dialog.
/// </summary>
public partial class AlertDialogTitle : RzComponent<AlertDialogTitle.Slots>
{
    /// <summary>
    /// Defines the default styling for the AlertDialogTitle component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(@base: "text-lg font-semibold");

    /// <summary>
    /// Gets or sets the parent <see cref="RzAlertDialog"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzAlertDialog? ParentAlertDialog { get; set; }

    /// <summary>
    /// Gets or sets the content rendered in the title.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "h2";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.AlertDialogTitle;

    /// <summary>
    /// Defines slots available for styling in <see cref="AlertDialogTitle"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Base slot for the title element.
        /// </summary>
        [Slot("alert-dialog-title")]
        public string? Base { get; set; }
    }
}
