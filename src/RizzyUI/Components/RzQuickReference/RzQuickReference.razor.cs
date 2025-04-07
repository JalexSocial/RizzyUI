using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;
// For List
// For Linq extensions

namespace RizzyUI;

/// <xmldoc>
///     Renders an "on this page" style navigation outline based on headings registered
///     with the parent <see cref="RzQuickReferenceContainer" />. Interacts with Alpine.js
///     to highlight the currently visible heading.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzQuickReference : RzComponent
{
    private IReadOnlyList<HeadingItem> _headings = new List<HeadingItem>().AsReadOnly();

    /// <summary> Gets the parent container which holds the heading data. </summary>
    [CascadingParameter]
    private RzQuickReferenceContainer? QuickReferenceContainer { get; set; }

    /// <summary> The title displayed above the quick reference list. Defaults to "On this page". </summary>
    [Parameter]
    public string Title { get; set; } = "On this page";

    // --- Style Properties derived from Theme ---
    /// <summary> Gets the computed CSS classes for the title paragraph. </summary>
    protected string TitleClass => Theme.RzQuickReference.Title;

    /// <summary> Gets the computed CSS classes for the list (ul) element. </summary>
    protected string ListClass => Theme.RzQuickReference.List;

    /// <summary> Gets the computed CSS classes for the list items (li). </summary>
    protected string ListItemClass => Theme.RzQuickReference.ListItem;

    /// <summary> Gets the computed CSS classes for the heading links (a). </summary>
    protected string LinkClass => Theme.RzQuickReference.Link;
    // Note: LinkSelected class is handled by Alpine :class="getSelectedCss"

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (QuickReferenceContainer == null)
            throw new InvalidOperationException(
                $"{GetType()} must be placed within an {nameof(RzQuickReferenceContainer)}.");

        // Get initial headings
        _headings = QuickReferenceContainer.GetHeadingItems();
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        // Update headings if the container might have changed (less common, but possible)
        if (QuickReferenceContainer != null) _headings = QuickReferenceContainer.GetHeadingItems();
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzQuickReference.Container);
    }

    /// <summary> Gets the CSS class for indentation based on the heading level. </summary>
    /// <param name="level">The heading level.</param>
    /// <returns>A string containing the Tailwind CSS class for margin-left.</returns>
    protected string GetIndentationClass(HeadingLevel level)
    {
        return Theme.RzQuickReference.GetIndentationCss(level, QuickReferenceContainer!.MinimumHeadingLevel);
        // Use parent's min level
    }
}