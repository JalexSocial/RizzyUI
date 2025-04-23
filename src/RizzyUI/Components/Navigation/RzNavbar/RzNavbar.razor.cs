
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