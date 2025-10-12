
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using RizzyUI.TailwindVariants;

namespace RizzyUI;

/// <summary>
/// A list of navigation menu items. This is a nested component.
/// </summary>
public partial class NavigationMenuList : RzComponent<NavigationMenuList.Slots>
{
    /// <summary>
    /// Defines the default styling for the NavigationMenuList component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "group flex flex-1 list-none items-center justify-center gap-1"
    );

    /// <summary>
    /// The parent RzNavigationMenu component.
    /// </summary>
    [CascadingParameter]
    protected RzNavigationMenu? ParentMenu { get; set; }

    /// <summary>
    /// The items to display in the list, typically <see cref="NavigationMenuItem"/> components.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "ul";
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.NavigationMenuList;

    /// <summary>
    /// Defines the slots available for styling in the NavigationMenuList component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}