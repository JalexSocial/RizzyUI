using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A non-interactive pagination item indicating omitted pages.
/// </summary>
public partial class PaginationEllipsis : RzComponent<PaginationEllipsis.Slots>
{
    /// <summary>
    /// Defines the default styling for the PaginationEllipsis component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline-flex size-9 items-center justify-center",
        slots: new()
        {
            [s => s.Icon] = "size-4",
            [s => s.SrOnly] = "sr-only"
        }
    );

    /// <summary>
    /// Gets or sets the text announced by screen readers.
    /// </summary>
    [Parameter]
    public string? ScreenReaderText { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "span";

        ScreenReaderText ??= Localizer["PaginationEllipsis.MorePages"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        ScreenReaderText ??= Localizer["PaginationEllipsis.MorePages"];
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.PaginationEllipsis;

    /// <summary>
    /// Defines the slots available for styling in the PaginationEllipsis component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the ellipsis container.
        /// </summary>
        [Slot("pagination-ellipsis")]
        public string? Base { get; set; }

        /// <summary>
        /// The slot for the decorative ellipsis icon.
        /// </summary>
        [Slot("pagination-ellipsis-icon")]
        public string? Icon { get; set; }

        /// <summary>
        /// The slot for screen-reader-only explanatory text.
        /// </summary>
        [Slot("pagination-ellipsis-sr-only")]
        public string? SrOnly { get; set; }
    }
}
