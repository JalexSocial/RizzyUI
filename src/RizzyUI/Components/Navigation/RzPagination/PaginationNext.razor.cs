using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A convenience link for navigating to the next page.
/// </summary>
public partial class PaginationNext : RzComponent<PaginationNext.Slots>
{
    /// <summary>
    /// Defines the default styling for the PaginationNext component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        slots: new()
        {
            [s => s.Icon] = "size-4",
            [s => s.Label] = string.Empty
        }
    );

    /// <summary>
    /// Gets or sets the URL for the next-page link.
    /// </summary>
    [Parameter]
    public string? Href { get; set; }

    /// <summary>
    /// Gets or sets the visible label text.
    /// </summary>
    [Parameter]
    public string? Label { get; set; }

    /// <summary>
    /// Gets or sets the ARIA label for the next-page link.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "a";

        Label ??= Localizer["PaginationNext.Label"];
        AriaLabel ??= Localizer["PaginationNext.AriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();

        Label ??= Localizer["PaginationNext.Label"];
        AriaLabel ??= Localizer["PaginationNext.AriaLabel"];
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.PaginationNext;

    /// <summary>
    /// Defines the slots available for styling in the PaginationNext component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the link element.
        /// </summary>
        [Slot("pagination-next")]
        public string? Base { get; set; }

        /// <summary>
        /// The slot for the next arrow icon.
        /// </summary>
        [Slot("pagination-next-icon")]
        public string? Icon { get; set; }

        /// <summary>
        /// The slot for the visible label.
        /// </summary>
        [Slot("pagination-next-label")]
        public string? Label { get; set; }
    }
}
