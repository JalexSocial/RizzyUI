using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A list item container for pagination primitives.
/// </summary>
public partial class PaginationItem : RzComponent<PaginationItem.Slots>
{
    /// <summary>
    /// Defines the default styling for the PaginationItem component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: string.Empty
    );

    /// <summary>
    /// Gets or sets the content rendered inside the pagination list item.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "li";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.PaginationItem;

    /// <summary>
    /// Defines the slots available for styling in the PaginationItem component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the list item element.
        /// </summary>
        [Slot("pagination-item")]
        public string? Base { get; set; }
    }
}
