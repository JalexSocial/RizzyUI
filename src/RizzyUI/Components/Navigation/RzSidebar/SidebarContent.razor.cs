
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// The main scrollable content area of the sidebar, designed to hold <see cref="SidebarGroup"/> components.
/// </summary>
public partial class SidebarContent : RzComponent
{
    /// <summary>
    /// Gets or sets the content to be rendered inside the scrollable area.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.SidebarContent.Content);
    }
}