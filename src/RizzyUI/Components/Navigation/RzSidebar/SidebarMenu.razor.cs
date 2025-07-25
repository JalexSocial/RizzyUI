
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A list container for <see cref="SidebarMenuItem"/> components.
/// </summary>
public partial class SidebarMenu : RzComponent
{
    /// <summary>
    /// Gets or sets the content of the menu, which should be a list of <see cref="SidebarMenuItem"/>.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "ul";
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.SidebarMenu.Menu);
    }
}