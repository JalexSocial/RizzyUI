using Microsoft.AspNetCore.Components;
using Rizzy.Utility;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     A container component for managing a set of tabs (<see cref="RzTab" />) and their corresponding content panels (
///     <see cref="RzTabPanel" />).
///     Handles tab selection state and interaction via Alpine.js.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzTabs : RzComponent
{
    /// <summary> Internal list holding registered Tab components. </summary>
    internal List<RzTab> _tabs = new();

    /// <summary> The unique ID reference for the tab button container element (<see cref="RzTabStrip" />). </summary>
    internal string ButtonRefId { get; } = IdGenerator.UniqueId("rztabBtns");

    /// <summary> Gets or sets the name of the tab that should be initially selected. If empty, the first tab is selected. </summary>
    [Parameter]
    public string SelectedTabName { get; set; } = string.Empty;

    /// <summary> Gets or sets the text color for non-selected tabs. Defaults to OnSurface. </summary>
    [Parameter]
    public SemanticColor TabTextColor { get; set; } = SemanticColor.OnSurface;

    /// <summary> Gets or sets the text color for the selected tab. Defaults to Primary. </summary>
    [Parameter]
    public SemanticColor SelectedTabTextColor { get; set; } = SemanticColor.Primary;

    /// <summary> Gets or sets the color for the underline marker of the selected tab. Defaults to Primary. </summary>
    [Parameter]
    public SemanticColor SelectedTabUnderlineColor { get; set; } = SemanticColor.Primary;

    /// <summary> Gets or sets the background color for the tabs (applied to individual tabs). Defaults to Surface. </summary>
    [Parameter]
    public SemanticColor TabBackgroundColor { get; set; } = SemanticColor.Surface;

    /// <summary> The required RenderFragment containing the tab menu structure (usually includes <see cref="RzTabStrip" />). </summary>
    [Parameter]
    [EditorRequired]
    public required RenderFragment Menu { get; set; } = default!;

    /// <summary> The required RenderFragment containing the <see cref="RzTabPanel" /> components. </summary>
    [Parameter]
    [EditorRequired]
    public required RenderFragment TabPanels { get; set; } = default!;

    /// <summary> Gets the currently active/selected Tab component. </summary>
    public RzTab? ActiveTab { get; private set; }

    /// <summary> Gets the lowercase name of the active tab for data binding. </summary>
    protected string ActiveTabNameLower => ActiveTab?.Name?.ToLowerInvariant() ?? string.Empty;

    // --- Style Properties derived from Theme ---
    /// <summary> Gets the computed CSS classes for the panels container div. </summary>
    protected string PanelsContainerClass => Theme.RzTabs.PanelsContainer;

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzTabs.Container);
    }

    /// <summary> Registers an <see cref="RzTab" /> component with this container. Called by child tabs. </summary>
    /// <param name="tab">The tab component to register.</param>
    internal void AddTab(RzTab tab)
    {
        if (!_tabs.Contains(tab))
        {
            _tabs.Add(tab);
            // Determine initial active tab
            if (ActiveTab == null && (_tabs.Count == 1 || string.IsNullOrEmpty(SelectedTabName)))
                ActiveTab = tab;
            else if (!string.IsNullOrEmpty(SelectedTabName) &&
                     tab.Name.Equals(SelectedTabName, StringComparison.OrdinalIgnoreCase)) ActiveTab = tab;
            StateHasChanged(); // Update if active tab might have changed
        }
    }
}