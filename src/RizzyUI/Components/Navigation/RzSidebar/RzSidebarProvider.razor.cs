
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Root provider for a sidebar system. It manages the shared state (open/closed, collapsible mode)
/// and cascades this information to all child sidebar components. It also hosts the Alpine.js component
/// responsible for client-side interactivity.
/// </summary>
public partial class RzSidebarProvider : RzComponent
{
    /// <summary>
    /// Gets or sets the content of the sidebar provider, which should include a <see cref="Sidebar"/>
    /// and a <see cref="SidebarTrigger"/>. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets the initial open state of the sidebar on desktop. This is an uncontrolled property.
    /// If a cookie is used for persistence, the cookie's value will override this. Defaults to true.
    /// </summary>
    [Parameter]
    public bool DefaultOpen { get; set; } = true;

    /// <summary>
    /// Gets or sets the collapsible behavior of the sidebar.
    /// Defaults to <see cref="SidebarCollapsible.OffCanvas"/>.
    /// </summary>
    [Parameter]
    public SidebarCollapsible Collapsible { get; set; } = SidebarCollapsible.OffCanvas;

    /// <summary>
    /// Gets or sets the keyboard key used for the open/close shortcut (e.g., "b").
    /// The shortcut is triggered with Cmd/Ctrl + key. Defaults to "b".
    /// </summary>
    [Parameter]
    public string KeyboardShortcut { get; set; } = "b";

    /// <summary>
    /// Gets or sets the name of the cookie used to persist the sidebar's open/closed state.
    /// If null or empty, the state will not be persisted. Defaults to "sidebar_state".
    /// </summary>
    [Parameter]
    public string? PersistenceCookieName { get; set; } = "sidebar_state";

    /// <summary>
    /// Gets or sets the width of the sidebar on desktop viewports.
    /// Must be a valid CSS value (e.g., "16rem", "250px"). Defaults to "16rem".
    /// </summary>
    [Parameter]
    public string Width { get; set; } = "16rem";

    /// <summary>
    /// Gets or sets the width of the sidebar on mobile viewports.
    /// Must be a valid CSS value (e.g., "18rem", "280px"). Defaults to "18rem".
    /// </summary>
    [Parameter]
    public string MobileWidth { get; set; } = "18rem";

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzSidebarProvider.Provider);
    }
}