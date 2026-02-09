using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Displays a pulsing placeholder block while content is loading.
/// </summary>
public partial class RzSkeleton : RzComponent<RzSkeleton.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzSkeleton component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "bg-accent animate-pulse rounded-md"
    );

    /// <summary>
    /// Optional content rendered inside the skeleton container.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzSkeleton;

    /// <summary>
    /// Defines the slots available for styling in the RzSkeleton component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("skeleton")]
        public string? Base { get; set; }
    }
}
