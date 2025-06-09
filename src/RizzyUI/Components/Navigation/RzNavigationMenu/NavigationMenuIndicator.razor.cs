
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A visual indicator that highlights the active <see cref="NavigationMenuTrigger"/>. This is a nested component.
/// </summary>
public partial class NavigationMenuIndicator : RzComponent
{
    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "div";
    }

    /// <inheritdoc/>
    protected override string? RootClass() => TwMerge.Merge(AdditionalAttributes, Theme.RzNavigationMenu.Indicator);
}