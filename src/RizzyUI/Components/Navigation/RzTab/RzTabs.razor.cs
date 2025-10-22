
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
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex flex-col gap-2",
        slots: new()
        {
            [s => s.PanelsContainer] = ""
        }
    );

    internal List<RzTab> _tabs = new();
    internal string ButtonRefId { get; } = IdGenerator.UniqueId("rztabBtns");

    [Parameter]
    public string SelectedTabName { get; set; } = string.Empty;

    [Parameter]
    public SemanticColor TabTextColor { get; set; } = SemanticColor.Foreground;

    [Parameter]
    public SemanticColor SelectedTabTextColor { get; set; } = SemanticColor.Primary;

    [Parameter]
    public SemanticColor SelectedTabUnderlineColor { get; set; } = SemanticColor.Primary;

    [Parameter]
    public SemanticColor TabBackgroundColor { get; set; } = SemanticColor.Background;

    [Parameter, EditorRequired]
    public required RenderFragment Menu { get; set; } = default!;

    [Parameter, EditorRequired]
    public required RenderFragment TabPanels { get; set; } = default!;

    public RzTab? ActiveTab { get; private set; }

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

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzTabs;

    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
        public string? PanelsContainer { get; set; }
    }
}