
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// An optional, secondary action button within a <see cref="SidebarMenuItem"/>,
/// typically used for icon-only actions like "add" or "more options".
/// </summary>
public partial class SidebarMenuAction : RzComponent
{
    /// <summary>
    /// Gets or sets the content of the action button, usually an icon.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "button";
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.SidebarMenuAction.Action);
    }
}