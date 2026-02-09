using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A styled scroll area wrapper inspired by shadcn/ui and Radix ScrollArea.
/// </summary>
public partial class RzScrollArea : RzComponent<RzScrollArea.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzScrollArea component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "relative overflow-hidden",
        slots: new()
        {
            [s => s.Viewport] = "size-full rounded-[inherit] focus-visible:ring-ring/50 transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            [s => s.ViewportContent] = "min-w-full table",
            [s => s.Scrollbar] = "absolute flex touch-none select-none p-px transition-opacity duration-200 data-[state=hidden]:opacity-0 data-[state=visible]:opacity-100",
            [s => s.ScrollbarVertical] = "top-0 right-0 h-full w-2.5 border-l border-l-transparent",
            [s => s.ScrollbarHorizontal] = "left-0 bottom-0 h-2.5 w-full flex-col border-t border-t-transparent",
            [s => s.Thumb] = "bg-border relative flex-1 rounded-full",
            [s => s.Corner] = "bg-background absolute right-0 bottom-0"
        },
        variants: new()
        {
            [s => ((RzScrollArea)s).Orientation] = new Variant<Orientation, Slots>
            {
                [Orientation.Vertical] = new() { [s => s.Viewport] = "overflow-y-scroll overflow-x-hidden" },
                [Orientation.Horizontal] = new() { [s => s.Viewport] = "overflow-x-scroll overflow-y-hidden whitespace-nowrap" }
            },
            [s => ((RzScrollArea)s).Type] = new Variant<ScrollAreaType, Slots>
            {
                [ScrollAreaType.Always] = new() { [s => s.Scrollbar] = "pointer-events-auto" },
                [ScrollAreaType.Hover] = new() { [s => s.Scrollbar] = "pointer-events-auto" },
                [ScrollAreaType.Scroll] = new() { [s => s.Scrollbar] = "pointer-events-auto" },
                [ScrollAreaType.Auto] = new() { [s => s.Scrollbar] = "pointer-events-auto" }
            }
        }
    );

    /// <summary>
    /// The content rendered inside the scroll area viewport.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// The primary scrolling orientation.
    /// </summary>
    [Parameter] public Orientation Orientation { get; set; } = Orientation.Vertical;

    /// <summary>
    /// Scrollbar visibility mode.
    /// </summary>
    [Parameter] public ScrollAreaType Type { get; set; } = ScrollAreaType.Hover;

    /// <summary>
    /// Delay in milliseconds before hiding hover/scroll scrollbars.
    /// </summary>
    [Parameter] public int ScrollHideDelay { get; set; } = 600;

    /// <summary>
    /// Whether to render the default built-in scrollbar(s).
    /// </summary>
    [Parameter] public bool ShowDefaultScrollBar { get; set; } = true;

    /// <summary>
    /// Whether a perpendicular scrollbar should also be rendered.
    /// </summary>
    [Parameter] public bool ShowBothScrollbars { get; set; }

    /// <summary>
    /// True when the vertical scrollbar should be rendered.
    /// </summary>
    protected bool ShowVertical => ShowDefaultScrollBar && (ShowBothScrollbars || Orientation == Orientation.Vertical);

    /// <summary>
    /// True when the horizontal scrollbar should be rendered.
    /// </summary>
    protected bool ShowHorizontal => ShowDefaultScrollBar && (ShowBothScrollbars || Orientation == Orientation.Horizontal);

    /// <summary>
    /// The initial state for scrollbar visibility data attributes.
    /// </summary>
    protected string InitialScrollbarState => Type == ScrollAreaType.Always ? "visible" : "hidden";

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "div";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzScrollArea;

    /// <summary>
    /// Defines style slots for <see cref="RzScrollArea"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>The base slot for the root element.</summary>
        [Slot("scroll-area")] public string? Base { get; set; }
        /// <summary>The slot for the scrollable viewport.</summary>
        [Slot("scroll-area-viewport")] public string? Viewport { get; set; }
        /// <summary>The slot for the viewport content wrapper.</summary>
        [Slot("scroll-area-viewport-content")] public string? ViewportContent { get; set; }
        /// <summary>The shared slot for scrollbar tracks.</summary>
        [Slot("scroll-area-scrollbar")] public string? Scrollbar { get; set; }
        /// <summary>The slot for the vertical scrollbar track.</summary>
        [Slot("scroll-area-scrollbar-vertical")] public string? ScrollbarVertical { get; set; }
        /// <summary>The slot for the horizontal scrollbar track.</summary>
        [Slot("scroll-area-scrollbar-horizontal")] public string? ScrollbarHorizontal { get; set; }
        /// <summary>The slot for draggable thumbs.</summary>
        [Slot("scroll-area-thumb")] public string? Thumb { get; set; }
        /// <summary>The slot for the bottom corner fill when both scrollbars render.</summary>
        [Slot("scroll-area-corner")] public string? Corner { get; set; }
    }
}
