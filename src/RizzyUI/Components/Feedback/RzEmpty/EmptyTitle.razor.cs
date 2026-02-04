
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A component for displaying the title within an <see cref="EmptyHeader"/>.
/// </summary>
public partial class EmptyTitle : RzComponent<EmptyTitle.Slots>
{
    /// <summary>
    /// Defines the default styling for the EmptyTitle component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "text-lg font-medium tracking-tight"
    );

    /// <summary>
    /// Gets or sets the content to be rendered as the title.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.EmptyTitle;

    /// <summary>
    /// Defines the slots available for styling in the EmptyTitle component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}