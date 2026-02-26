
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Provides state and context for a sidebar layout. This component must wrap all other sidebar elements.
/// </summary>
public partial class RzSidebarProvider : RzComponent<RzSidebarProvider.Slots>
{
    /// <summary>
    /// Defines the default styling and variations for the RzSidebarProvider component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full"
    );

    /// <summary>
    /// The content of the provider, which should include a Sidebar component.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// The initial open state of the sidebar on desktop. Defaults to true.
    /// </summary>
    [Parameter]
    public bool DefaultOpen { get; set; } = true;

    /// <summary>
    /// The collapsible behavior of the sidebar. Defaults to OffCanvas.
    /// </summary>
    [Parameter]
    public SidebarCollapsible Collapsible { get; set; } = SidebarCollapsible.OffCanvas;

    /// <summary>
    /// The keyboard key for the open/close shortcut (Cmd/Ctrl + key). Defaults to "b".
    /// </summary>
    [Parameter]
    public string KeyboardShortcut { get; set; } = "b";

    /// <summary>
    /// The name of the cookie to persist the sidebar's state. Defaults to "sidebar_state". Null or empty disables persistence.
    /// </summary>
    [Parameter]
    public string? PersistenceCookieName { get; set; } = "sidebar_state";

    /// <summary>
    /// The width of the sidebar on desktop. Defaults to "16rem".
    /// </summary>
    [Parameter]
    public string Width { get; set; } = "16rem";

    /// <summary>
    /// The width of the sidebar on mobile. Defaults to "18rem".
    /// </summary>
    [Parameter]
    public string MobileWidth { get; set; } = "18rem";

    /// <summary>
    /// The width of the sidebar when collapsed to icon-only mode. Defaults to "3rem".
    /// </summary>
    [Parameter]
    public string IconWidth { get; set; } = "3rem";

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzSidebarProvider;

    /// <summary>
    /// Defines the slots available for styling the RzSidebarProvider component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets the base CSS classes applied to the component's root element.
        /// </summary>
        [Slot("sidebar-wrapper")]
        public string? Base { get; set; }
    }
}