
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A wrapper for a navigation menu item, which can contain a trigger and content, or a direct link. This is a nested component.
/// </summary>
public partial class NavigationMenuItem : RzComponent<NavigationMenuItem.Slots>
{
    /// <summary>
    /// Defines the default styling for the NavigationMenuItem component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "relative"
    );

    /// <summary>
    /// The parent RzNavigationMenu component.
    /// </summary>
    [CascadingParameter]
    protected RzNavigationMenu? ParentMenu { get; set; }

    /// <summary>
    /// Content of the item, typically a <see cref="NavigationMenuTrigger"/> and <see cref="NavigationMenuContent"/> or a <see cref="NavigationMenuLink"/>.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "li";

        ParentMenu?.AddItem(this);
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.NavigationMenuItem;

    /// <summary>
    /// Defines the slots available for styling in the NavigationMenuItem component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}