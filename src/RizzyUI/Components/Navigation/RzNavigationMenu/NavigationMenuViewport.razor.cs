
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A container that positions the content of a <see cref="RzNavigationMenu"/>. This is a nested component.
/// </summary>
public partial class NavigationMenuViewport : RzComponent
{
    private readonly string _positioningStyle = "position: absolute; left: 0px; top: 100%;";

    /// <summary>
    /// The parent RzNavigationMenu component.
    /// </summary>
    [CascadingParameter]
    protected RzNavigationMenu? ParentMenu { get; set; }

    /// <summary>
    /// The unique ID of the viewport.
    /// </summary>
    protected string ViewportId => $"{ParentMenu?.Id}-viewport";

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "div";
    }

    /// <inheritdoc/>
    protected override string? RootClass() => TwMerge.Merge(AdditionalAttributes, Theme.RzNavigationMenu.Viewport);
}