using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Represents a single clickable tab button within an <see cref="RzTabStrip" />.
///     Interacts with the parent <see cref="RzTabs" /> component and Alpine.js to manage selection state.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzTab : RzComponent
{
    /// <summary> Get the currently active theme via Cascading Parameter. </summary>
    [CascadingParameter]
    protected RzTheme? CascadedTheme { get; set; }

    /// <summary> Gets the parent Tabs component context. </summary>
    [CascadingParameter]
    private RzTabs? Parent { get; set; }

    /// <summary> Gets the parent TabStrip component context. </summary>
    [CascadingParameter]
    private RzTabStrip? TabStrip { get; set; }

    /// <summary> Injected configuration to get the default theme as fallback. </summary>
    [Inject]
    private IOptions<RizzyUIConfig>? Config { get; set; }

    /// <summary> The effective theme being used (Cascaded or Default). </summary>
    protected RzTheme Theme { get; set; } = default!;

    /// <summary>
    ///     The unique name identifier for this tab. Must match the Name of the corresponding <see cref="RzTabPanel" />.
    ///     Required.
    /// </summary>
    [Parameter]
    [EditorRequired]
    public required string Name { get; set; } = default!;

    /// <summary> The content to be displayed inside the tab button (e.g., text, icon). </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary> Gets the lowercase name used for data attributes and IDs. </summary>
    protected string NameLower => Name?.ToLowerInvariant() ?? string.Empty;

    /// <summary> Gets the ID for the tab button element. </summary>
    protected string TabId => $"{NameLower}-tab";

    /// <summary> Gets the ID for the corresponding tab panel element. </summary>
    protected string PanelId => $"{NameLower}-panel";

    /// <summary> Gets the CSS class for the selected text color from the parent Tabs. </summary>
    protected string SelectedTextColorClass =>
        Parent?.SelectedTabTextColor.ToTextClass() ?? Theme.Light.Primary.ToCssClassString("text");

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Theme = CascadedTheme ?? Config?.Value.DefaultTheme ?? RzTheme.Default;
        if (Theme == null)
            throw new InvalidOperationException(
                $"{GetType()} requires a cascading RzTheme or a default theme configured.");
        if (Parent == null)
            throw new InvalidOperationException($"{GetType()} must exist within an RzTabs component.");
        if (TabStrip == null)
            throw new InvalidOperationException($"{GetType()} must exist within an RzTabStrip component.");

        Parent.AddTab(this); // Register with Tabs
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        var styles = Theme.RzTab;
        return TwMerge.Merge(AdditionalAttributes,
            styles.Button,
            styles.GetBackgroundColorCss(Parent?.TabBackgroundColor ?? SemanticColor.Surface), // Use parent's BG color
            styles.GetTextColorCss(Parent?.TabTextColor ?? SemanticColor.OnSurface), // Use parent's default text color
            styles.GetJustifyCss(TabStrip?.Justify ?? Justify.Center) // Use strip's justify
        );
    }
}