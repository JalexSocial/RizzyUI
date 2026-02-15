using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A page link within a pagination control.
/// </summary>
public partial class PaginationLink : RzComponent<PaginationLink.Slots>
{
    /// <summary>
    /// Defines the default styling for the PaginationLink component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline-flex size-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variants: new()
        {
            [c => ((PaginationLink)c).IsActive] = new Variant<bool, Slots>
            {
                [true] = new() { [s => s.Base] = "bg-accent text-accent-foreground" },
                [false] = new() { [s => s.Base] = "bg-background text-foreground" }
            }
        }
    );

    /// <summary>
    /// Gets or sets the URL for the pagination link.
    /// </summary>
    [Parameter]
    public string? Href { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether this link represents the active page.
    /// </summary>
    [Parameter]
    public bool IsActive { get; set; }

    /// <summary>
    /// Gets or sets the ARIA label for the page link.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <summary>
    /// Gets or sets the content rendered inside the pagination link.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "a";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.PaginationLink;

    /// <summary>
    /// Defines the slots available for styling in the PaginationLink component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the link element.
        /// </summary>
        [Slot("pagination-link")]
        public string? Base { get; set; }
    }
}
