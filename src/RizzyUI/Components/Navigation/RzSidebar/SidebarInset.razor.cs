
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A wrapper for the main content area that correctly adjusts its margin
/// based on the sidebar's state and variant.
/// </summary>
public partial class SidebarInset : RzComponent
{
    /// <summary>
    /// Gets or sets the main content to be rendered within the inset container.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "main";
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.SidebarInset.Inset);
    }
}