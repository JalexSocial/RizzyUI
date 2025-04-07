using System.Text.Json;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Components.RzTypography;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     A container component that collects heading information from child components (like <see cref="RzHeading" />)
///     and makes it available to <see cref="RzQuickReference" /> for building an "on this page" navigation.
///     Interacts with Alpine.js to manage the currently highlighted heading.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzQuickReferenceContainer : RzComponent
{
    private readonly List<HeadingItem> _headingItems = new();
    private string _currentHeadingId = string.Empty; // Store initial heading ID
    private string _headingItemsSerialized = "[]";

    /// <summary> The lowest heading level (e.g., H2) to include in the quick reference outline. Defaults to H2. </summary>
    [Parameter]
    public HeadingLevel MinimumHeadingLevel { get; set; } = HeadingLevel.H2;

    /// <summary> The highest heading level (e.g., H4) to include in the quick reference outline. Defaults to H4. </summary>
    [Parameter]
    public HeadingLevel MaximumHeadingLevel { get; set; } = HeadingLevel.H4;

    /// <summary>
    ///     The child content of the container, which should include headings and potentially an
    ///     <see cref="RzQuickReference" /> component.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override void OnAfterRender(bool firstRender)
    {
        // After the first render where headings are registered,
        // update the serialized data and initial ID if needed.
        if (firstRender)
        {
            UpdateSerializedHeadings();
            StateHasChanged(); // Trigger re-render with updated data attributes
        }

        base.OnAfterRender(firstRender);
    }


    /// <summary> Registers a heading with this container. Called by child <see cref="RzHeading" /> components. </summary>
    /// <param name="level">The heading level.</param>
    /// <param name="title">The title of the heading.</param>
    /// <param name="id">The unique ID of the heading element.</param>
    internal void RegisterHeading(HeadingLevel level, string title, string id)
    {
        if (level >= MinimumHeadingLevel && level <= MaximumHeadingLevel)
            if (!_headingItems.Any(h => h.Id == id)) // Avoid duplicates
                _headingItems.Add(new HeadingItem(level, title, id));
        // Don't serialize here, do it once in OnAfterRender
    }

    private void UpdateSerializedHeadings()
    {
        _headingItemsSerialized =
            JsonSerializer.Serialize(_headingItems.Select(x => x.Id).ToList()); // Serialize the IDs
        _currentHeadingId = _headingItems.FirstOrDefault()?.Id ?? string.Empty; // Set initial ID for Alpine
    }


    /// <summary> Gets the list of registered heading items. </summary>
    /// <returns>A read-only list of <see cref="HeadingItem" />.</returns>
    public IReadOnlyList<HeadingItem> GetHeadingItems()
    {
        return _headingItems.AsReadOnly();
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzQuickReferenceContainer.Container);
    }
}