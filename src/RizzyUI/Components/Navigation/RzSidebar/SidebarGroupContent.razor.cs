
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A container for the content within a <see cref="SidebarGroup"/>, typically a <see cref="SidebarMenu"/>.
/// </summary>
public partial class SidebarGroupContent : RzComponent
{
    /// <summary>
    /// Gets or sets the content to be rendered, usually a <see cref="SidebarMenu"/>.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.SidebarGroupContent.Content);
    }
}