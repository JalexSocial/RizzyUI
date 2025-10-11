
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents the content area of a <see cref="DropdownMenuSub"/> that appears when its trigger is activated.
/// </summary>
public partial class DropdownMenuSubContent : RzComponent<DropdownMenuSubContent.Slots>
{
    /// <summary>
    /// Defines the default styling for the DropdownMenuSubContent component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg animate-in data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        slots: new()
        {
            [s => s.InnerContainer] = ""
        }
    );

    /// <summary>
    /// Gets the parent <see cref="DropdownMenuSub"/> component.
    /// </summary>
    [CascadingParameter]
    protected DropdownMenuSub? ParentSubmenu { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered inside the sub-menu panel. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets the ID for the sub-menu content element.
    /// </summary>
    protected string SubContentId => $"{ParentSubmenu?.Id}-subcontent";

    /// <summary>
    /// Gets the ID of the sub-menu trigger element that controls this content.
    /// </summary>
    protected string SubTriggerId => $"{ParentSubmenu?.Id}-subtrigger";

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentSubmenu == null)
        {
            throw new InvalidOperationException($"{nameof(DropdownMenuSubContent)} must be used within a {nameof(DropdownMenuSub)}.");
        }
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.DropdownMenuSubContent;

    /// <summary>
    /// Defines the slots available for styling in the DropdownMenuSubContent component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
        public string? InnerContainer { get; set; }
    }
}