
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A container for creating a nested, collapsible sub-menu within a <see cref="SidebarMenu"/>.
/// This component is intended to wrap a trigger and content for the sub-menu.
/// </summary>
public partial class SidebarMenuSub : RzComponent
{
    /// <summary>
    /// Gets or sets the content of the sub-menu, which should include a trigger and content sections.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.SidebarMenuSub.SubMenu);
    }
}