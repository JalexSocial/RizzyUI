
// src/RizzyUI/Components/Navigation/RzDropdown/DropdownMenuSubContent.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents the content area of a <see cref="DropdownMenuSub"/> that appears when its trigger is activated.
/// </summary>
public partial class DropdownMenuSubContent : RzComponent
{
    /// <summary>
    /// Gets the parent <see cref="RzDropdownMenu"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzDropdownMenu? ParentDropdownMenu { get; set; }
    
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
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzDropdownMenu.SubContentContainer);
    }
}