
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Container for the content displayed when a <see cref="NavigationMenuTrigger"/> is activated. This is a nested component.
/// </summary>
public partial class NavigationMenuContent : RzComponent
{
    /// <summary>
    /// Cascading parent NavigationMenu.
    /// </summary>
    [CascadingParameter]
    protected RzNavigationMenu? ParentMenu { get; set; }

    /// <summary>
    /// Cascading parent NavigationMenuItem.
    /// </summary>
    [CascadingParameter]
    protected NavigationMenuItem? ParentItem { get; set; }

    /// <summary>
    /// The content to be rendered inside the panel.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// The unique ID of the content panel.
    /// </summary>
    protected string ContentId => $"{ParentItem?.Id}-content";

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentMenu is null || ParentItem is null)
        {
            throw new InvalidOperationException($"{nameof(NavigationMenuContent)} must be used within a {nameof(NavigationMenuItem)}.");
        }
    }

    /// <inheritdoc/>
    protected override string? RootClass() => TwMerge.Merge(AdditionalAttributes, Theme.RzNavigationMenu.Content);
}