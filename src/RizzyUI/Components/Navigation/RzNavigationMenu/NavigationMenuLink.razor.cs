
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A link within a navigation menu that navigates to a URL. This is a nested component.
/// It acts as a wrapper and should contain a navigable element like an anchor tag or RzLink.
/// </summary>
public partial class NavigationMenuLink : RzAsChildComponent
{
    /// <summary>
    /// The content to display within the link, typically an `&nbsp;a>` or `&nbsp;RzLink>` component.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Link URL to navigate to when the link is clicked.
    /// </summary>
    [Parameter]
    public string? Href { get; set; }

    /// <inheritdoc />
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc />
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(AdditionalAttributes ?? new(), StringComparer.OrdinalIgnoreCase);

        attributes["id"] = Id;
        attributes["class"] = RootClass();
        attributes["href"] = Href;
        attributes["data-slot"] = "navigation-menu-link";

        return attributes;
    }

    /// <inheritdoc/>
    protected override string? RootClass() => TwMerge.Merge(AdditionalAttributes, Theme.RzNavigationMenu.Link);
}