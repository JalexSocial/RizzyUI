using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Root tooltip scope that provides shared defaults and context for tooltip subcomponents.
/// </summary>
public partial class RzTooltip : RzComponent<RzTooltip.Slots>
{
    /// <summary>
    /// Defines the default styling for the <see cref="RzTooltip"/> component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "contents"
    );

    /// <summary>
    /// Gets or sets the child content that contains tooltip provider, trigger, and content elements.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets the default delay in milliseconds before showing the tooltip.
    /// </summary>
    [Parameter]
    public int DelayDuration { get; set; } = 700;

    /// <summary>
    /// Gets or sets the skip-delay duration in milliseconds for subsequent tooltip openings.
    /// </summary>
    [Parameter]
    public int SkipDelayDuration { get; set; } = 300;

    /// <summary>
    /// Gets or sets whether hoverable tooltip content behavior is disabled.
    /// </summary>
    [Parameter]
    public bool DisableHoverableContent { get; set; }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzTooltip;

    /// <summary>
    /// Defines the slots available for styling in the <see cref="RzTooltip"/> component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component.
        /// </summary>
        [Slot("tooltip")]
        public string? Base { get; set; }
    }
}
