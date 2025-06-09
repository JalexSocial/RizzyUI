
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A wrapper for a navigation menu item, which can contain a trigger and content, or a direct link. This is a nested component.
/// </summary>
public partial class NavigationMenuItem : RzComponent
{
    /// <summary>
    /// The parent RzNavigationMenu component.
    /// </summary>
    [CascadingParameter]
    protected RzNavigationMenu? ParentMenu { get; set; }

    /// <summary>
    /// Content of the item, typically a <see cref="NavigationMenuTrigger"/> and <see cref="NavigationMenuContent"/> or a <see cref="NavigationMenuLink"/>.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "li";

        ParentMenu?.AddItem(this);
    }

    /// <inheritdoc/>
    protected override string? RootClass() => TwMerge.Merge(AdditionalAttributes, Theme.RzNavigationMenu.Item);
}