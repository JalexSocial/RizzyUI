
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A link within a navigation menu that navigates to a URL. This is a nested component.
/// It acts as a wrapper and should contain a navigable element like an anchor tag or RzLink.
/// </summary>
public partial class NavigationMenuLink : RzAsChildComponent<NavigationMenuLink.Slots>
{
    /// <summary>
    /// Defines the default styling for the NavigationMenuLink component.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new();

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
        var attributes = new Dictionary<string, object?>(AdditionalAttributes ?? new(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = Id,
            ["class"] = _slots.GetBase(),
            ["href"] = Href,
            ["data-slot"] = "navigation-menu-link"
        };
        return attributes;
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.NavigationMenuLink;

    /// <summary>
    /// Defines the slots available for styling in the NavigationMenuLink component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}