
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Represents a responsive layout component with a collapsible sidebar and main content area.
///     Includes a toggle mechanism (via Alpine.js) for small screens and accessibility features.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzSidebar : RzComponent
{
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
    
    /// <summary> Gets computed CSS classes for the inner layout container. </summary>
    protected string LayoutInnerContainerClass => "relative flex w-full flex-col md:flex-row"; // Added this wrapper

    /// <summary>
    ///     Gets the root CSS class for the component, merging base styles with additional attributes.
    /// </summary>
    /// <returns>A string representing the CSS classes for the root element.</returns>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzSidebar.Container);
    }
}