
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A component for displaying descriptive text within a <see cref="SheetHeader"/>.
/// </summary>
public partial class SheetDescription : RzComponent<SheetDescription.Slots>
{
    /// <summary>
    /// Defines the default styling for the SheetDescription component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "text-sm text-muted-foreground"
    );

    /// <summary>
    /// Gets or sets the content to be rendered as the description.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "p";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SheetDescription;

    /// <summary>
    /// Defines the slots available for styling in the SheetDescription component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}