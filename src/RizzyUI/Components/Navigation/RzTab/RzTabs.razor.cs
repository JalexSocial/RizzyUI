
using Microsoft.AspNetCore.Components;
using Rizzy.Utility;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     A container component for managing a set of tabs (<see cref="RzTab" />) and their corresponding content panels (
///     <see cref="RzTabPanel" />).
///     Handles tab selection state and interaction via Alpine.js.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzTabs : RzComponent<RzTabs.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzTabs component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex flex-col gap-2",
        slots: new()
        {
            [s => s.PanelsContainer] = ""
        }
    );

    internal List<RzTab> _tabs = new();
    internal string ButtonRefId { get; } = IdGenerator.UniqueId("rztabBtns");

    /// <summary>
    /// Gets or sets the name of the tab that should be initially selected. If empty, the first tab is selected.
    /// </summary>
    [Parameter]
    public string SelectedTabName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the text color for non-selected tabs.
    /// </summary>
    [Parameter]
    public SemanticColor TabTextColor { get; set; } = SemanticColor.Foreground;

    /// <summary>
    /// Gets or sets the text color for the selected tab.
    /// </summary>
    [Parameter]
    public SemanticColor SelectedTabTextColor { get; set; } = SemanticColor.Primary;

    /// <summary>
    /// Gets or sets the color for the underline marker of the selected tab.
    /// </summary>
    [Parameter]
    public SemanticColor SelectedTabUnderlineColor { get; set; } = SemanticColor.Primary;

    /// <summary>
    /// Gets or sets the background color for the tabs.
    /// </summary>
    [Parameter]
    public SemanticColor TabBackgroundColor { get; set; } = SemanticColor.Background;

    /// <summary>
    /// Gets or sets the render fragment containing the tab menu structure (usually includes <see cref="RzTabStrip"/>). This is a required parameter.
    /// </summary>
    [Parameter, EditorRequired]
    public required RenderFragment Menu { get; set; } = default!;

    /// <summary>
    /// Gets or sets the render fragment containing the <see cref="RzTabPanel"/> components. This is a required parameter.
    /// </summary>
    [Parameter, EditorRequired]
    public required RenderFragment TabPanels { get; set; } = default!;

    /// <summary>
    /// Gets the currently active tab.
    /// </summary>
    public RzTab? ActiveTab { get; private set; }

    /// <summary>
    /// Gets the lowercase name of the active tab.
    /// </summary>
    protected string ActiveTabNameLower => ActiveTab?.Name?.ToLowerInvariant() ?? string.Empty;

    internal void AddTab(RzTab tab)
    {
        if (!_tabs.Contains(tab))
        {
            _tabs.Add(tab);
            if (ActiveTab == null && (_tabs.Count == 1 || string.IsNullOrEmpty(SelectedTabName)))
                ActiveTab = tab;
            else if (!string.IsNullOrEmpty(SelectedTabName) &&
                     tab.Name.Equals(SelectedTabName, StringComparison.OrdinalIgnoreCase)) ActiveTab = tab;
            StateHasChanged();
        }
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzTabs;

    /// <summary>
    /// Defines the slots available for styling in the RzTabs component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the main tabs container.
        /// </summary>
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the container of the tab panels.
        /// </summary>
        public string? PanelsContainer { get; set; }
    }
}