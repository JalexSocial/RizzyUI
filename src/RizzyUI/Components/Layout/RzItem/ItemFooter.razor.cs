
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A container for footer content within an <see cref="RzItem"/>, spanning the full width.
/// </summary>
public partial class ItemFooter : RzComponent<ItemFooter.Slots>
{
    /// <summary>
    /// Defines the default styling for the ItemFooter component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex basis-full items-center justify-between gap-2"
    );

    /// <summary>
    /// Gets or sets the content to be rendered inside the footer.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.ItemFooter;

    /// <summary>
    /// Defines the slots available for styling in the ItemFooter component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}