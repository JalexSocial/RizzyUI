
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A list item inside a SidebarMenuSub.
/// </summary>
public partial class SidebarMenuSubItem : RzComponent<SidebarMenuSubItem.Slots>
{
    /// <summary>
    /// Defines the default styling and variations for the SidebarMenuSubItem component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "group/menu-sub-item relative"
    );

    /// <summary>
    /// The content of the submenu item.
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
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarMenuSubItem;

    /// <summary>
    /// Defines the slots available for styling the SidebarMenuSubItem component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets the base CSS classes applied to the component's root element.
        /// </summary>
        [Slot("sidebar-menu-sub-item")]
        public string? Base { get; set; }
    }
}