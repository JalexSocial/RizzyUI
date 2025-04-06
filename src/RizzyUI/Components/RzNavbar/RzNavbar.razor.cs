using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;
using RizzyUI.Styling;

namespace RizzyUI;

/// <xmldoc>
/// Renders a fixed top navigation bar component. Includes a responsive toggle button for mobile sidebars.
/// Styling is determined by the active <see cref="RzTheme"/>. Typically used within an <see cref="RzSidebar"/> layout.
/// </xmldoc>
public partial class RzNavbar : RzComponent
{
    /// <summary> Get the currently active theme via Cascading Parameter. </summary>
    [CascadingParameter] protected RzTheme? CascadedTheme { get; set; }
    /// <summary> Injected configuration to get the default theme as fallback. </summary>
    [Inject] private IOptions<RizzyUIConfig>? Config { get; set; }
    /// <summary> The effective theme being used (Cascaded or Default). </summary>
    protected RzTheme Theme { get; set; } = default!;

    /// <summary> The content to be displayed inside the navbar (e.g., brand logo, navigation links, user controls). </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }
    /// <summary> Screen reader text for the mobile toggle button. Defaults to "Toggle side navigation". </summary>
    [Parameter] public string ScreenReaderText { get; set; } = "Toggle side navigation";

    // --- Style Properties derived from Theme ---
    /// <summary> Gets the computed CSS classes for the mobile toggle button. </summary>
    protected string ToggleButtonClass => Theme.RzNavbar.ToggleButton;
    /// <summary> Gets the computed CSS classes for the icon container inside the toggle button. </summary>
    protected string ToggleButtonIconContainerClass => Theme.RzNavbar.ToggleButtonIconContainer;
    /// <summary> Gets the computed CSS classes for the screen-reader text span inside the toggle button. </summary>
    protected string ToggleButtonSrTextClass => Theme.RzNavbar.ToggleButtonSrText;
    /// <summary> Gets the computed CSS classes for the main content container within the navbar. </summary>
    protected string ContentContainerClass => Theme.RzNavbar.ContentContainer;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Theme = CascadedTheme ?? Config?.Value.DefaultTheme ?? RzTheme.Default;
        if (Theme == null)
            throw new InvalidOperationException($"{GetType()} requires a cascading RzTheme or a default theme configured.");

        this.Element = "nav"; // Set the root element tag
    }

    /// <inheritdoc/>
    protected override string? RootClass() =>
        TwMerge.Merge(AdditionalAttributes, Theme.RzNavbar.Navbar);
}

