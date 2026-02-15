using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A convenience link for navigating to the previous page.
/// </summary>
public partial class PaginationPrevious : RzComponent<PaginationPrevious.Slots>
{
    /// <summary>
    /// Defines the default styling for the PaginationPrevious component.
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
    /// Gets or sets the URL for the previous-page link.
    /// </summary>
    [Parameter]
    public string? Href { get; set; }

    /// <summary>
    /// Gets or sets the visible label text.
    /// </summary>
    [Parameter]
    public string? Label { get; set; }

    /// <summary>
    /// Gets or sets the ARIA label for the previous-page link.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "a";

        Label ??= Localizer["PaginationPrevious.Label"];
        AriaLabel ??= Localizer["PaginationPrevious.AriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();

        Label ??= Localizer["PaginationPrevious.Label"];
        AriaLabel ??= Localizer["PaginationPrevious.AriaLabel"];
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.PaginationPrevious;

    /// <summary>
    /// Defines the slots available for styling in the PaginationPrevious component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the link element.
        /// </summary>
        [Slot("pagination-previous")]
        public string? Base { get; set; }

        /// <summary>
        /// The slot for the previous arrow icon.
        /// </summary>
        [Slot("pagination-previous-icon")]
        public string? Icon { get; set; }

        /// <summary>
        /// The slot for the visible label.
        /// </summary>
        [Slot("pagination-previous-label")]
        public string? Label { get; set; }
    }
}
