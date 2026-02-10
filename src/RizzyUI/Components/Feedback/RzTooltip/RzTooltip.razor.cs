using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
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
    /// Gets the parent <see cref="TooltipProvider.TooltipProviderContext"/> when this tooltip is nested in a provider.
    /// </summary>
    [CascadingParameter]
    protected TooltipProvider.TooltipProviderContext? TooltipProviderContext { get; set; }

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

    /// <summary>
    /// Gets or sets the preferred placement of the tooltip content relative to its trigger.
    /// </summary>
    [Parameter]
    public AnchorPoint Anchor { get; set; } = AnchorPoint.Top;

    /// <summary>
    /// Gets or sets the main-axis offset in pixels applied by floating-position middleware.
    /// </summary>
    [Parameter]
    public int Offset { get; set; } = 4;

    /// <summary>
    /// Gets or sets the cross-axis offset in pixels applied by floating-position middleware.
    /// </summary>
    [Parameter]
    public int CrossAxisOffset { get; set; }

    /// <summary>
    /// Gets or sets the alignment-axis offset in pixels applied by floating-position middleware.
    /// </summary>
    [Parameter]
    public int AlignmentAxisOffset { get; set; }

    /// <summary>
    /// Gets or sets the positioning strategy used by floating-position middleware.
    /// </summary>
    [Parameter]
    public AnchorStrategy Strategy { get; set; } = AnchorStrategy.Absolute;

    /// <summary>
    /// Gets or sets whether the floating middleware can flip the tooltip placement to remain visible.
    /// </summary>
    [Parameter]
    public bool EnableFlip { get; set; } = true;

    /// <summary>
    /// Gets or sets whether the floating middleware can shift the tooltip to remain visible in the viewport.
    /// </summary>
    [Parameter]
    public bool EnableShift { get; set; } = true;

    /// <summary>
    /// Gets or sets the viewport padding in pixels used by floating shift middleware.
    /// </summary>
    [Parameter]
    public int ShiftPadding { get; set; } = 8;

    /// <summary>
    /// Gets or sets the controlled open state of the tooltip.
    /// Set to <c>null</c> to use uncontrolled mode with <see cref="DefaultOpen"/>.
    /// </summary>
    [Parameter]
    public bool? Open { get; set; }

    /// <summary>
    /// Gets or sets the initial open state in uncontrolled mode.
    /// </summary>
    [Parameter]
    public bool DefaultOpen { get; set; }

    /// <summary>
    /// Gets or sets a callback raised when the open state changes.
    /// </summary>
    [Parameter]
    public EventCallback<bool> OpenChanged { get; set; }

    /// <summary>
    /// Gets or sets the ARIA label applied to the tooltip scope container.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <summary>
    /// Gets the resolved delay duration in milliseconds, preferring provider-level configuration when available.
    /// </summary>
    protected int EffectiveDelayDuration => TooltipProviderContext?.DelayDuration ?? DelayDuration;

    /// <summary>
    /// Gets the resolved skip-delay duration in milliseconds, preferring provider-level configuration when available.
    /// </summary>
    protected int EffectiveSkipDelayDuration => TooltipProviderContext?.SkipDelayDuration ?? SkipDelayDuration;

    /// <summary>
    /// Gets the resolved hoverable-content behavior, preferring provider-level configuration when available.
    /// </summary>
    protected bool EffectiveDisableHoverableContent => TooltipProviderContext?.DisableHoverableContent ?? DisableHoverableContent;

    /// <summary>
    /// Gets the effective open state resolved from controlled or uncontrolled parameters.
    /// </summary>
    protected bool EffectiveOpen => Open ?? DefaultOpen;

    /// <summary>
    /// Gets a value indicating whether the tooltip open state is controlled by the parent.
    /// </summary>
    protected bool IsControlledOpenState => Open.HasValue;

    /// <summary>
    /// Gets the effective anchor value as kebab-case for Alpine consumption.
    /// </summary>
    protected string EffectiveAnchor => Anchor.ToString().ToKebabCase();

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        AriaLabel ??= Localizer["RzTooltip.DefaultAriaLabel"];
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzTooltip.DefaultAriaLabel"];
    }

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
