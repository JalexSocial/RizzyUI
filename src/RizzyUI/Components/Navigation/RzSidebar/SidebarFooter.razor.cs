
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A container for content that should remain sticky at the bottom of the sidebar.
/// </summary>
public partial class SidebarFooter : RzComponent
{
    /// <summary>
    /// Gets or sets the content to be rendered inside the footer.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "footer";
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.SidebarFooter.Footer);
    }
}