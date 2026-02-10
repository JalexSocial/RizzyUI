using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Provides tooltip timing and behavior defaults to descendant tooltip parts.
/// </summary>
public partial class TooltipProvider : RzComponent<TooltipProvider.Slots>
{
    /// <summary>
    /// Defines the default styling for the <see cref="TooltipProvider"/> component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "contents"
    );

    /// <summary>
    /// Gets or sets the provider child content.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets the delay duration in milliseconds before the tooltip opens.
    /// </summary>
    [Parameter]
    public int DelayDuration { get; set; } = 700;

    /// <summary>
    /// Gets or sets the skip-delay duration in milliseconds for successive tooltip openings.
    /// </summary>
    [Parameter]
    public int SkipDelayDuration { get; set; } = 300;

    /// <summary>
    /// Gets or sets whether hoverable content support is disabled for tooltips in this provider.
    /// </summary>
    [Parameter]
    public bool DisableHoverableContent { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
        {
            Element = "div";
        }
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.TooltipProvider;

    /// <summary>
    /// Defines the slots available for styling in the <see cref="TooltipProvider"/> component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component.
        /// </summary>
        [Slot("tooltip-provider")]
        public string? Base { get; set; }
    }
}
