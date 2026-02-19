
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A container for the footer content of a <see cref="SheetContent"/>, typically aligned to the bottom.
/// </summary>
public partial class SheetFooter : RzComponent<SheetFooter.Slots>
{
    /// <summary>
    /// Defines the default styling for the SheetFooter component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "mt-auto flex flex-col gap-2 p-4"
    );

    /// <summary>
    /// Gets or sets the content to be rendered inside the footer.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "footer";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SheetFooter;

    /// <summary>
    /// Defines the slots available for styling in the SheetFooter component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}