using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A styled scrollbar track and thumb for use with <see cref="RzScrollArea"/>.
/// </summary>
public partial class ScrollBar : RzComponent<ScrollBar.Slots>
{
    /// <summary>
    /// Defines the default styling for the ScrollBar component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex touch-none p-px transition-colors select-none",
        slots: new()
        {
            [s => s.Thumb] = "bg-border relative flex-1 rounded-full"
        },
        variants: new()
        {
            [s => ((ScrollBar)s).Orientation] = new Variant<Orientation, Slots>
            {
                [Orientation.Vertical] = "h-full w-2.5 border-l border-l-transparent",
                [Orientation.Horizontal] = "h-2.5 flex-col border-t border-t-transparent"
            }
        }
    );

    /// <summary>
    /// The scrollbar orientation.
    /// </summary>
    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Vertical;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "div";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.ScrollBar;

    /// <summary>
    /// Defines the slots available for styling in the ScrollBar component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the scrollbar container.
        /// </summary>
        [Slot("scroll-area-scrollbar")]
        public string? Base { get; set; }

        /// <summary>
        /// The slot for the scrollbar thumb.
        /// </summary>
        [Slot("scroll-area-thumb")]
        public string? Thumb { get; set; }
    }
}
