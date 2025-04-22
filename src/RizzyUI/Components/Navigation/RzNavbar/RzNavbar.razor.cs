using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Renders a fixed top navigation bar component. Includes a responsive toggle button for mobile sidebars.
///     Styling is determined by the active <see cref="RzTheme" />. Typically used within an <see cref="RzSidebar" />
///     layout.
/// </xmldoc>
public partial class RzNavbar : RzComponent
{
    /// <summary> The content to be displayed inside the navbar (e.g., brand logo, navigation links, user controls). </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary> Screen reader text for the mobile toggle button. Defaults to "Toggle side navigation". </summary>
    [Parameter]
    public string ScreenReaderText { get; set; } = "Toggle side navigation";

    // --- Style Properties derived from Theme ---
    /// <summary> Gets the computed CSS classes for the mobile toggle button. </summary>
    protected string ToggleButtonClass => Theme.RzNavbar.ToggleButton;

    /// <summary> Gets the computed CSS classes for the icon container inside the toggle button. </summary>
    protected string ToggleButtonIconContainerClass => Theme.RzNavbar.ToggleButtonIconContainer;

    /// <summary> Gets the computed CSS classes for the screen-reader text span inside the toggle button. </summary>
    protected string ToggleButtonSrTextClass => Theme.RzNavbar.ToggleButtonSrText;

    /// <summary> Gets the computed CSS classes for the main content container within the navbar. </summary>
    protected string ContentContainerClass => Theme.RzNavbar.ContentContainer;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        Element = "nav"; // Set the root element tag
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzNavbar.Navbar);
    }
}