
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using System.Collections.Generic;

namespace RizzyUI;

/// <summary>
/// A collection of links for navigating a website. This is a root-level component.
/// </summary>
/// <remarks>
/// As a root-level component, its name is prefixed with 'Rz'.
/// </remarks>
public partial class RzNavigationMenu : RzComponent
{
    internal readonly List<NavigationMenuItem> Items = new();

    /// <summary>
    /// Gets or sets the content of the navigation menu, typically a <see cref="NavigationMenuList"/>.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// The orientation of the menu.
    /// </summary>
    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Horizontal;

    /// <summary>
    /// The accessible name for the navigation menu.
    /// If not set, a default localized label will be applied.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "nav";
        
        AriaLabel ??= Localizer["RzNavigationMenu.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzNavigationMenu.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override string? RootClass() => TwMerge.Merge(AdditionalAttributes, Theme.RzNavigationMenu.Container);

    internal void AddItem(NavigationMenuItem item)
    {
        if (!Items.Contains(item))
        {
            Items.Add(item);
        }
    }
}