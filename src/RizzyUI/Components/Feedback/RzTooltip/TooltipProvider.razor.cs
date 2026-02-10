using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Provides tooltip timing and behavior defaults to descendant tooltip parts.
/// </summary>
public partial class TooltipProvider : RzComponent<TooltipProvider.Slots>
{
    private readonly TooltipProviderContext _context = new();

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
    public int DelayDuration { get; set; }

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

    /// <summary>
    /// Gets the cascading provider context consumed by descendant tooltip components.
    /// </summary>
    protected TooltipProviderContext Context => _context;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
        {
            Element = "div";
        }

        _context.UpdateConfiguration(DelayDuration, SkipDelayDuration, DisableHoverableContent);
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        _context.UpdateConfiguration(DelayDuration, SkipDelayDuration, DisableHoverableContent);
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

    /// <summary>
    /// Represents shared tooltip timing and hoverability state cascaded to descendants.
    /// </summary>
    public sealed class TooltipProviderContext
    {
        /// <summary>
        /// Gets the delay in milliseconds before opening a tooltip.
        /// </summary>
        public int DelayDuration { get; private set; }

        /// <summary>
        /// Gets the skip-delay window in milliseconds after a tooltip closes.
        /// </summary>
        public int SkipDelayDuration { get; private set; } = 300;

        /// <summary>
        /// Gets whether hoverable tooltip content support is disabled.
        /// </summary>
        public bool DisableHoverableContent { get; private set; }

        /// <summary>
        /// Records the shared provider configuration values.
        /// </summary>
        /// <param name="delayDuration">The delay in milliseconds before a tooltip opens.</param>
        /// <param name="skipDelayDuration">The skip-delay window in milliseconds.</param>
        /// <param name="disableHoverableContent">Whether hoverable content is disabled.</param>
        public void UpdateConfiguration(int delayDuration, int skipDelayDuration, bool disableHoverableContent)
        {
            DelayDuration = delayDuration;
            SkipDelayDuration = skipDelayDuration;
            DisableHoverableContent = disableHoverableContent;
        }

    }
}
