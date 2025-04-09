using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;

// For Count()

namespace RizzyUI;

/// <xmldoc>
///     Represents the container for the clickable tab buttons within an <see cref="RzTabs" /> component.
///     It manages the layout (grid columns, gap) and the visual selection marker.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzTabStrip : RzComponent
{
    /// <summary> Gets the parent Tabs component context. </summary>
    [CascadingParameter]
    private RzTabs? Parent { get; set; }

    /// <summary> Horizontal alignment of tab content within the strip. Defaults to Center. </summary>
    [Parameter]
    public Justify Justify { get; set; } = Justify.Center;

    /// <summary> Gap spacing between tabs. Defaults to Medium. </summary>
    [Parameter]
    public Size SpaceBetween { get; set; } = Size.Medium;

    /// <summary> The child content, expected to be <see cref="RzTab" /> components. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    // --- Style Properties derived from Theme ---
    /// <summary> Gets the computed CSS classes for the selection marker div. </summary>
    protected string MarkerClass => Theme.RzTabStrip.Marker;

    /// <summary> Gets the computed CSS classes for the marker's ::after background color. </summary>
    protected string MarkerAfterBackgroundClass => Parent != null
        ? Theme.RzTabStrip.GetMarkerAfterBackgroundCss(Parent.SelectedTabUnderlineColor)
        : "";

    /// <summary> Gets the computed CSS classes for the inner div within the marker. </summary>
    protected string MarkerInnerClass => Theme.RzTabStrip.MarkerInner;

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
        var styles = Theme.RzTabStrip;
        return TwMerge.Merge(AdditionalAttributes,
            styles.Strip,
            Parent?._tabs != null ? styles.GetColumnsCss(Parent._tabs.Count) : "grid-cols-1", // Handle null case
            styles.GetGapCss(SpaceBetween),
            Parent?.TabTextColor.ToTextClass() ?? "" // Inherit text color from Tabs
        );
    }
}