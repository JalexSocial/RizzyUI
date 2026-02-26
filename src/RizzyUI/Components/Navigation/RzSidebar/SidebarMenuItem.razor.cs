
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A list item within a SidebarMenu.
/// </summary>
public partial class SidebarMenuItem : RzComponent<SidebarMenuItem.Slots>
{
    /// <summary>
    /// Defines the default styling and variations for the SidebarMenuItem component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "group/menu-item relative"
    );

    /// <summary>
    /// The content of the menu item, typically a SidebarMenuButton.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "li";
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarMenuItem;

    /// <summary>
    /// Defines the slots available for styling the SidebarMenuItem component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets the base CSS classes applied to the component's root element.
        /// </summary>
        [Slot("sidebar-menu-item")]
        public string? Base { get; set; }
    }
}