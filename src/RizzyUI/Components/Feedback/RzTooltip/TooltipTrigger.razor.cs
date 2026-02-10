using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// The interactive element that controls the display of a tooltip content panel.
/// </summary>
public partial class TooltipTrigger : RzAsChildComponent<TooltipTrigger.Slots>
{
    /// <summary>
    /// Defines the default styling for the <see cref="TooltipTrigger"/> component.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline-flex"
    );

    /// <summary>
    /// Gets the parent <see cref="RzTooltip"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzTooltip? ParentTooltip { get; set; }

    /// <summary>
    /// Gets or sets the trigger content.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets the ID for the trigger element.
    /// </summary>
    protected string TriggerId => $"{ParentTooltip?.Id}-trigger";

    /// <summary>
    /// Gets the ID of the content element this trigger controls.
    /// </summary>
    protected string ContentId => $"{ParentTooltip?.Id}-content";

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (ParentTooltip is null)
        {
            throw new InvalidOperationException($"{nameof(TooltipTrigger)} must be used within an {nameof(RzTooltip)}.");
        }

        if (string.IsNullOrEmpty(Element))
        {
            Element = "button";
        }
    }

    /// <inheritdoc />
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc />
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(AdditionalAttributes?.ToDictionary(kvp => kvp.Key, kvp => (object?)kvp.Value) ?? new Dictionary<string, object?>(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = TriggerId,
            ["class"] = SlotClasses.GetBase(),
            ["x-ref"] = "trigger",
            ["aria-controls"] = ContentId,
            ["x-bind:aria-describedby"] = $"open ? '{ContentId}' : null",
            ["x-bind:data-state"] = "open ? 'open' : 'closed'",
            ["data-state"] = "closed",
            ["data-slot"] = "tooltip-trigger"
        };

        return attributes;
    }


    /// <inheritdoc />
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.TooltipTrigger;

    /// <summary>
    /// Defines the slots available for styling in the <see cref="TooltipTrigger"/> component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component.
        /// </summary>
        [Slot("tooltip-trigger")]
        public string? Base { get; set; }
    }
}
