
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A container for content that should remain sticky at the top of the sidebar.
/// </summary>
public partial class SidebarHeader : RzComponent
{
    /// <summary>
    /// Gets or sets the content to be rendered inside the header.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "header";
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.SidebarHeader.Header);
    }
}