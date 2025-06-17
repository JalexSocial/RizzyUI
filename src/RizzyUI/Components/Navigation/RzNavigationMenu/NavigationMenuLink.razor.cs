
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A link within a navigation menu that navigates to a URL. This is a nested component.
/// </summary>
public partial class NavigationMenuLink : RzComponent
{
    /// <summary>
    /// The content to display within the link.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override string? RootClass() => TwMerge.Merge(AdditionalAttributes, Theme.RzNavigationMenu.Link);
}