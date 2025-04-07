using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;

namespace RizzyUI;

/// <xmldoc>
///     Represents a responsive layout component with a collapsible sidebar and main content area.
///     Includes a toggle mechanism (via Alpine.js) for small screens and accessibility features.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzSidebar : RzComponent
{
    /// <summary> Get the currently active theme via Cascading Parameter. </summary>
    [CascadingParameter]
    protected RzTheme? CascadedTheme { get; set; }

    /// <summary> Injected configuration to get the default theme as fallback. </summary>
    [Inject]
    private IOptions<RizzyUIConfig>? Config { get; set; }

    /// <summary> The effective theme being used (Cascaded or Default). </summary>
    protected RzTheme Theme { get; set; } = default!;

    /// <summary> Gets or sets the identifier for the main content area, used for the skip link. Defaults to "main-content". </summary>
    [Parameter]
    public string MainContentId { get; set; } = "main-content";

    /// <summary>
    ///     Optional content for the <see cref="RzNavbar" /> component, rendered above the sidebar/main content. If set,
    ///     adjusts layout spacing.
    /// </summary>
    [Parameter]
    public RenderFragment? NavbarContent { get; set; }

    /// <summary> Content to be rendered inside the sidebar navigation area (typically <see cref="RzSidebarLinks" />). </summary>
    [Parameter]
    public RenderFragment? MenuContent { get; set; }

    /// <summary> The main content to be displayed in the primary content area. </summary>
    [Parameter]
    public RenderFragment? MainContent { get; set; }

    /// <summary> Determines if a Navbar is present. </summary>
    protected bool HasNavbar => NavbarContent != null;

    // --- Style Properties derived from Theme ---
    /// <summary> Gets computed CSS classes for the main container div (x-data). </summary>
    protected string ContainerClass => Theme.RzSidebar.Container;

    /// <summary> Gets computed CSS classes for the layout container div. </summary>
    protected string LayoutContainerClass => Theme.RzSidebar.LayoutContainer;

    /// <summary> Gets computed CSS classes for the layout container's top margin. </summary>
    protected string LayoutContainerTopClass => Theme.RzSidebar.GetLayoutContainerTopCss(HasNavbar);

    /// <summary> Gets computed CSS classes for the inner layout container. </summary>
    protected string LayoutInnerContainerClass => "relative flex w-full flex-col md:flex-row"; // Added this wrapper

    /// <summary> Gets computed CSS classes for the skip link. </summary>
    protected string SkipLinkClass => Theme.RzSidebar.SkipLink;

    /// <summary> Gets computed CSS classes for the mobile overlay. </summary>
    protected string OverlayClass => Theme.RzSidebar.Overlay;

    /// <summary> Gets computed CSS classes for the sidebar aside element. </summary>
    protected string SidebarClass => Theme.RzSidebar.Sidebar;

    /// <summary> Gets computed CSS classes for the sidebar's top position. </summary>
    protected string SidebarTopClass => Theme.RzSidebar.GetSidebarTopCss(HasNavbar);

    /// <summary> Gets computed CSS classes for the main content section. </summary>
    protected string MainContentContainerClass => Theme.RzSidebar.MainContentContainer;

    /// <summary> Gets computed CSS classes for the main content padding div. </summary>
    protected string MainContentPaddingClass => Theme.RzSidebar.MainContentPadding;

    /// <summary> Gets computed CSS classes for the floating toggle button. </summary>
    protected string FloatingToggleButtonClass => Theme.RzSidebar.FloatingToggleButton;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Theme = CascadedTheme ?? Config?.Value.DefaultTheme ?? RzTheme.Default;
        if (Theme == null)
            throw new InvalidOperationException(
                $"{GetType()} requires a cascading RzTheme or a default theme configured.");
    }

    // RootClass might not be needed if the base div just holds x-data
    // protected override string? RootClass() => TwMerge.Merge(AdditionalAttributes, ContainerClass);
}