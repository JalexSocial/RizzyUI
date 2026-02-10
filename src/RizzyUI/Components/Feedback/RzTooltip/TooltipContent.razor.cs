using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// The floating panel that renders tooltip content.
/// </summary>
public partial class TooltipContent : RzComponent<TooltipContent.Slots>
{
    /// <summary>
    /// Defines the default styling for the <see cref="TooltipContent"/> component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground"
    );

    /// <summary>
    /// Gets the parent <see cref="RzTooltip"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzTooltip? ParentTooltip { get; set; }

    /// <summary>
    /// Gets the ID for the content element.
    /// </summary>
    protected string ContentId => $"{ParentTooltip?.Id}-content";

    /// <summary>
    /// Gets or sets the tooltip content.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets the preferred side of the tooltip relative to its trigger.
    /// </summary>
    [Parameter]
    public AnchorPoint Side { get; set; } = AnchorPoint.Top;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (ParentTooltip is null)
        {
            throw new InvalidOperationException($"{nameof(TooltipContent)} must be used within an {nameof(RzTooltip)}.");
        }
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.TooltipContent;

    /// <summary>
    /// Defines the slots available for styling in the <see cref="TooltipContent"/> component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component.
        /// </summary>
        [Slot("tooltip-content")]
        public string? Base { get; set; }
    }
}
