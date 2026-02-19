
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A component for displaying the title within a <see cref="SheetHeader"/>.
/// </summary>
public partial class SheetTitle : RzComponent<SheetTitle.Slots>
{
    /// <summary>
    /// Defines the default styling for the SheetTitle component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "font-semibold text-foreground"
    );

    /// <summary>
    /// Gets or sets the content to be rendered as the title.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "h2";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SheetTitle;

    /// <summary>
    /// Defines the slots available for styling in the SheetTitle component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}