
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Renders an "on this page" style navigation outline based on headings registered
///     with the parent <see cref="RzQuickReferenceContainer" />. Interacts with Alpine.js
///     to highlight the currently visible heading and set `aria-current`.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzQuickReference : RzComponent
{
    private IReadOnlyList<HeadingItem> _headings = new List<HeadingItem>().AsReadOnly();

    /// <summary> Gets the parent container which holds the heading data. </summary>
    [CascadingParameter]
    private RzQuickReferenceContainer? QuickReferenceContainer { get; set; }

    /// <summary> The title displayed above the quick reference list. Defaults to localized "On this page". </summary>
    [Parameter]
    public string? Title { get; set; }

    /// <summary>
    /// The aria-label for the navigation element. Defaults to localized "On this page navigation".
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (QuickReferenceContainer == null)
            throw new InvalidOperationException(
                $"{GetType()} must be placed within an {nameof(RzQuickReferenceContainer)}.");

        // Get initial headings
        _headings = QuickReferenceContainer.GetHeadingItems();

        // Set default localized values if parameters are null
        Title ??= Localizer["RzQuickReference.DefaultTitle"];
        AriaLabel ??= Localizer["RzQuickReference.DefaultAriaLabel"];

    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        // Update headings if the container might have changed (less common, but possible)
        if (QuickReferenceContainer != null) _headings = QuickReferenceContainer.GetHeadingItems();

         // Ensure defaults are applied if parameters become null after initialization
        Title ??= Localizer["RzQuickReference.DefaultTitle"];
        AriaLabel ??= Localizer["RzQuickReference.DefaultAriaLabel"];
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