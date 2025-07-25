
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A small badge component, typically used within a <see cref="SidebarMenuItem"/> to display a count or status.
/// </summary>
public partial class SidebarMenuBadge : RzComponent
{
    /// <summary>
    /// Gets or sets the content to be displayed inside the badge.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "span";
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.SidebarMenuBadge.Badge);
    }
}