
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// The content panel of a <see cref="RzPopover"/> that appears when the trigger is activated.
/// </summary>
public partial class PopoverContent : RzComponent<PopoverContent.Slots>
{
    /// <summary>
    /// Defines the default styling for the PopoverContent component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none"
    );

    /// <summary>
    /// Gets the parent <see cref="RzPopover"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzPopover? ParentPopover { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered inside the popover panel. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;


    /// <summary>
    /// Gets or sets the role of the popover content region.
    /// Leave null for generic content; set to values like "dialog" or "menu" when appropriate.
    /// </summary>
    [Parameter]
    public string? Role { get; set; }

    /// <summary>
    /// Gets or sets an explicit accessible label for the popover content.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <summary>
    /// Gets or sets the id of an element that labels the popover content.
    /// Defaults to the trigger id when <see cref="AriaLabel"/> is not provided.
    /// </summary>
    [Parameter]
    public string? AriaLabelledBy { get; set; }

    /// <summary>
    /// Gets the ID for the content element.
    /// </summary>
    protected string ContentId => $"{ParentPopover?.Id}-content";

    /// <summary>
    /// Gets the ID of the trigger element that controls this content.
    /// </summary>
    protected string TriggerId => $"{ParentPopover?.Id}-trigger";

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentPopover == null)
        {
            throw new InvalidOperationException($"{nameof(PopoverContent)} must be used within an {nameof(RzPopover)}.");
        }

        AriaLabelledBy ??= string.IsNullOrWhiteSpace(AriaLabel) ? TriggerId : null;
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.PopoverContent;

    /// <summary>
    /// Defines the slots available for styling in the PopoverContent component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("popover-content")]
        public string? Base { get; set; }
    }
}