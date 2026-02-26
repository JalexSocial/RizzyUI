
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A menu container (typically a list) within the sidebar.
/// </summary>
public partial class SidebarMenu : RzComponent<SidebarMenu.Slots>
{
    /// <summary>
    /// Defines the default styling and variations for the SidebarMenu component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex w-full min-w-0 flex-col gap-1"
    );

    /// <summary>
    /// The menu items.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "ul";
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarMenu;

    /// <summary>
    /// Defines the slots available for styling the SidebarMenu component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets the base CSS classes applied to the component's root element.
        /// </summary>
        [Slot("sidebar-menu")]
        public string? Base { get; set; }
    }
}