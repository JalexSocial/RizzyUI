
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A wrapper for the main content area when using the `inset` variant of the <see cref="Sidebar"/>.
/// It applies the necessary padding to prevent the main content from being obscured by the sidebar.
/// </summary>
public partial class SidebarInset : RzComponent
{
    /// <summary>
    /// Gets or sets the main content to be rendered within the inset container.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.SidebarInset.Inset);
    }
}