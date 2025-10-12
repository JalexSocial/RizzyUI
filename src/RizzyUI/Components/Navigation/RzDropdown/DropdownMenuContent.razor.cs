
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using RizzyUI.TailwindVariants;

namespace RizzyUI;

/// <summary>
/// Represents the content area of an <see cref="RzDropdownMenu"/> that appears when the trigger is activated.
/// It typically contains <see cref="DropdownMenuItem"/>, <see cref="DropdownMenuGroup"/>, and other related components.
/// </summary>
public partial class DropdownMenuContent : RzComponent<DropdownMenuContent.Slots>
{
    /// <summary>
    /// Defines the default styling for the DropdownMenuContent component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "absolute z-50 mt-1 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        slots: new()
        {
            [s => s.InnerContainer] = ""
        }
    );

    /// <summary>
    /// Gets the parent <see cref="RzDropdownMenu"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzDropdownMenu? ParentDropdownMenu { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered inside the dropdown panel. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets the ID for the content element.
    /// </summary>
    protected string ContentId => $"{ParentDropdownMenu?.Id}-content";

    /// <summary>
    /// Gets the ID of the trigger element that controls this content.
    /// </summary>
    protected string TriggerId => $"{ParentDropdownMenu?.Id}-trigger";

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentDropdownMenu == null)
        {
            throw new InvalidOperationException($"{nameof(DropdownMenuContent)} must be used within an {nameof(RzDropdownMenu)}.");
        }
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.DropdownMenuContent;

    /// <summary>
    /// Defines the slots available for styling in the DropdownMenuContent component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
        public string? InnerContainer { get; set; }
    }
}