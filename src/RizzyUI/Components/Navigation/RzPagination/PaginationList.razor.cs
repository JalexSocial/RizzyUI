using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A list wrapper that contains pagination items.
/// </summary>
public partial class PaginationList : RzComponent<PaginationList.Slots>
{
    /// <summary>
    /// Defines the default styling for the PaginationList component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex flex-row items-center gap-1"
    );

    /// <summary>
    /// Gets or sets the content rendered inside the pagination list.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "ul";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.PaginationList;

    /// <summary>
    /// Defines the slots available for styling in the PaginationList component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the list element.
        /// </summary>
        [Slot("pagination-list")]
        public string? Base { get; set; }
    }
}
