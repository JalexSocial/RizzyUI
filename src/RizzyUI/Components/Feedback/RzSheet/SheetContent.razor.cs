
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// The main panel of the sheet that slides into view. It contains the sheet's content,
/// header, and footer, along with a default close button.
/// </summary>
public partial class SheetContent : RzComponent<SheetContent.Slots>
{
    /// <summary>
    /// Defines the default styling for the SheetContent component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "fixed z-50 flex flex-col gap-4 bg-background shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out",
        slots: new()
        {
            [s => s.Overlay] = "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            [s => s.CloseButton] = "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none",
            [s => s.CloseButtonIcon] = "size-4"
        },
        variants: new()
        {
            [c => ((SheetContent)c).Side] = new Variant<SheetSide, Slots>
            {
                [SheetSide.Top] = new() { [s => s.Base] = "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top" },
                [SheetSide.Bottom] = new() { [s => s.Base] = "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom" },
                [SheetSide.Left] = new() { [s => s.Base] = "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm" },
                [SheetSide.Right] = new() { [s => s.Base] = "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm" }
            }
        }
    );

    /// <summary>
    /// Gets the parent <see cref="RzSheet"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzSheet? ParentSheet { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered inside the sheet panel. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets the side from which the sheet will appear.
    /// Defaults to <see cref="SheetSide.Right"/>.
    /// </summary>
    [Parameter]
    public SheetSide Side { get; set; } = SheetSide.Right;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentSheet == null)
        {
            throw new InvalidOperationException($"{nameof(SheetContent)} must be used within an {nameof(RzSheet)}.");
        }
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SheetContent;

    /// <summary>
    /// Defines the slots available for styling in the SheetContent component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the main sheet panel.
        /// </summary>
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the backdrop overlay.
        /// </summary>
        public string? Overlay { get; set; }
        /// <summary>
        /// The slot for the close button.
        /// </summary>
        public string? CloseButton { get; set; }
        /// <summary>
        /// The slot for the icon inside the close button.
        /// </summary>
        public string? CloseButtonIcon { get; set; }
    }
}