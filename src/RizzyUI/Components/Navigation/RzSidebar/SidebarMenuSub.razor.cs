
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A list container for nested submenu items.
/// </summary>
public partial class SidebarMenuSub : RzComponent<SidebarMenuSub.Slots>
{
    /// <summary>
    /// Defines the default styling and variations for the SidebarMenuSub component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5 group-data-[collapsible=icon]:hidden"
    );

    /// <summary>
    /// The submenu items.
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
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarMenuSub;

    /// <summary>
    /// Defines the slots available for styling the SidebarMenuSub component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets the base CSS classes applied to the component's root element.
        /// </summary>
        [Slot("sidebar-menu-sub")]
        public string? Base { get; set; }
    }
}