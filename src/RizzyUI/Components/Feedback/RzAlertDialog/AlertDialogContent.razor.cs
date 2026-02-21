using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// The teleported panel container for <see cref="RzAlertDialog"/> content.
/// </summary>
public partial class AlertDialogContent : RzComponent<AlertDialogContent.Slots>
{
    /// <summary>
    /// Defines the default styling for the AlertDialogContent component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg bg-background",
        slots: new()
        {
            [s => s.Backdrop] = "fixed inset-0 z-50 bg-black/80"
        },
        variants: new()
        {
            [c => ((AlertDialogContent)c).Size] = new Variant<ModalSize, Slots>
            {
                [ModalSize.ExtraSmall] = new() { [s => s.Base] = "sm:max-w-xs" },
                [ModalSize.Small] = new() { [s => s.Base] = "sm:max-w-sm" },
                [ModalSize.Medium] = new() { [s => s.Base] = "sm:max-w-md" },
                [ModalSize.Large] = new() { [s => s.Base] = "sm:max-w-lg" },
                [ModalSize.ExtraLarge] = new() { [s => s.Base] = "sm:max-w-xl" },
                [ModalSize.TwoXL] = new() { [s => s.Base] = "sm:max-w-2xl" },
                [ModalSize.ThreeXL] = new() { [s => s.Base] = "sm:max-w-3xl" },
                [ModalSize.FourXL] = new() { [s => s.Base] = "sm:max-w-4xl" },
                [ModalSize.FiveXL] = new() { [s => s.Base] = "sm:max-w-5xl" },
                [ModalSize.SixXL] = new() { [s => s.Base] = "sm:max-w-6xl" },
                [ModalSize.SevenXL] = new() { [s => s.Base] = "sm:max-w-7xl" }
            }
        }
    );

    /// <summary>
    /// Gets or sets the parent <see cref="RzAlertDialog"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzAlertDialog? ParentAlertDialog { get; set; }

    /// <summary>
    /// Gets or sets the content rendered inside the alert dialog panel.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets the size variant controlling the maximum width.
    /// </summary>
    [Parameter]
    public ModalSize Size { get; set; } = ModalSize.Large;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentAlertDialog == null)
            throw new InvalidOperationException($"{nameof(AlertDialogContent)} must be used within an {nameof(RzAlertDialog)}.");
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.AlertDialogContent;

    /// <summary>
    /// Defines the slots available for styling in the AlertDialogContent component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Base slot for the panel element.
        /// </summary>
        [Slot("alert-dialog-content")]
        public string? Base { get; set; }

        /// <summary>
        /// Slot for the backdrop element.
        /// </summary>
        [Slot("alert-dialog-overlay")]
        public string? Backdrop { get; set; }
    }
}
