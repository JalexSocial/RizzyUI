using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Represents the content panel associated with a specific <see cref="RzTab" />.
///     It becomes visible when its corresponding tab is selected. Controlled via Alpine.js.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzTabPanel : RzComponent
{
    /// <summary> Gets the parent Tabs component context. </summary>
    [CascadingParameter]
    private RzTabs? Parent { get; set; }

    /// <summary>
    ///     The unique name identifier for this panel. Must match the Name of the corresponding <see cref="RzTab" />.
    ///     Required.
    /// </summary>
    [Parameter]
    [EditorRequired]
    public string Name { get; set; } = default!;

    /// <summary> The content to be displayed inside the tab panel when active. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary> Gets the lowercase name used for data attributes and IDs. </summary>
    protected string NameLower => Name?.ToLowerInvariant() ?? string.Empty;

    /// <summary> Gets the ID for the corresponding tab button element. </summary>
    protected string TabId => $"{NameLower}-tab";

    /// <summary> Gets the ID for this panel element. </summary>
    protected string PanelId => $"{NameLower}-panel";

    // --- Style Properties derived from Theme ---
    /// <summary> Gets the computed CSS classes for the outer container div. </summary>
    protected string OuterContainerClass => Theme.RzTabPanel.OuterContainer;

    /// <summary> Gets the computed CSS classes for the inner content div. </summary>
    protected string InnerContainerClass => Theme.RzTabPanel.InnerContainer;

    /// <summary> Gets the computed CSS classes for the text color, inheriting from the parent Tabs component. </summary>
    protected string TextColorClass =>
        Theme.RzTabPanel.GetTextColorCss(Parent?.TabTextColor ?? SemanticColor.OnSurface);

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (Parent == null)
            throw new InvalidOperationException($"{GetType()} must exist within an RzTabs component.");
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        // RootClass is now applied to the inner div via the markup
        return TwMerge.Merge(AdditionalAttributes, InnerContainerClass, TextColorClass);
    }
}