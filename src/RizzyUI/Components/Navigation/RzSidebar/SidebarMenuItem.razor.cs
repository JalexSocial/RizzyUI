
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents a single item in a <see cref="SidebarMenu"/>, acting as a wrapper for a
/// <see cref="SidebarMenuButton"/> and other optional elements like <see cref="SidebarMenuAction"/>.
/// </summary>
public partial class SidebarMenuItem : RzComponent
{
    /// <summary>
    /// Gets or sets the content of the menu item.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "li";
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.SidebarMenuItem.Item);
    }
}