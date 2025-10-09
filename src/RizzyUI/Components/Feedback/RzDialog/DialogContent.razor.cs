using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// The main content panel of a <see cref="RzDialog"/> that appears when triggered.
/// </summary>
public partial class DialogContent : RzComponent<DialogContent.Slots>
{
    /// <summary>
    /// Defines the default styling for the DialogContent component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        slots: new()
        {
            [s => s.Backdrop] = "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            [s => s.CloseButton] = "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none",
            [s => s.CloseButtonIcon] = "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
        },
        variants: new()
        {
            [c => ((DialogContent)c).Size] = new Variant<ModalSize, Slots>
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
    /// Gets the parent <see cref="RzDialog"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzDialog? ParentDialog { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered inside the dialog panel. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets whether to show the default close button in the top-right corner.
    /// Defaults to true.
    /// </summary>
    [Parameter]
    public bool ShowCloseButton { get; set; } = true;

    /// <summary>
    /// Gets or sets the size variant of the dialog, controlling its maximum width.
    /// Defaults to <see cref="ModalSize.Large"/>.
    /// </summary>
    [Parameter]
    public ModalSize Size { get; set; } = ModalSize.Large;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentDialog == null)
        {
            throw new InvalidOperationException($"{nameof(DialogContent)} must be used within an {nameof(RzDialog)}.");
        }
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.DialogContent;

    /// <summary>
    /// Defines the slots available for styling in the DialogContent component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
        public string? Backdrop { get; set; }
        public string? CloseButton { get; set; }
        public string? CloseButtonIcon { get; set; }
    }
}