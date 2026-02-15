using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A semantic navigation container for paginated content.
/// </summary>
public partial class RzPagination : RzComponent<RzPagination.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzPagination component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "mx-auto flex w-full justify-center"
    );

    /// <summary>
    /// Gets or sets the content rendered inside the pagination container.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the ARIA label for the pagination navigation landmark.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "nav";

        AriaLabel ??= Localizer["RzPagination.AriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzPagination.AriaLabel"];
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzPagination;

    /// <summary>
    /// Defines the slots available for styling in the RzPagination component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the root pagination element.
        /// </summary>
        [Slot("pagination")]
        public string? Base { get; set; }
    }
}
