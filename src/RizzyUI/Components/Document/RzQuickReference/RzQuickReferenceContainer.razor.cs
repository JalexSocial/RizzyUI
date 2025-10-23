
using Microsoft.AspNetCore.Components;
using System.Text.Json;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     A container component that collects heading information from child components (like <see cref="RzHeading" />)
///     and makes it available to <see cref="RzQuickReference" /> for building an "on this page" navigation.
///     Interacts with Alpine.js to manage the currently highlighted heading.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzQuickReferenceContainer : RzComponent<RzQuickReferenceContainer.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzQuickReferenceContainer component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: ""
    );

    private readonly List<HeadingItem> _headingItems = new();
    private string _currentHeadingId = string.Empty;
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

    /// <summary> Registers a heading with this container. Called by child <see cref="RzHeading" /> components. </summary>
    internal void RegisterHeading(HeadingLevel level, string title, string id)
    {
        if (level >= MinimumHeadingLevel && level <= MaximumHeadingLevel)
            _headingItems.Add(new HeadingItem(level, title, id));

        UpdateSerializedHeadings();
        StateHasChanged();
    }

    private void UpdateSerializedHeadings()
    {
        _headingItemsSerialized = JsonSerializer.Serialize(_headingItems.Select(x => x.Id).ToList());
        _currentHeadingId = _headingItems.FirstOrDefault()?.Id ?? string.Empty;
    }

    /// <summary> Gets the list of registered heading items. </summary>
    public IReadOnlyList<HeadingItem> GetHeadingItems() => _headingItems.AsReadOnly();

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzQuickReferenceContainer;

    /// <summary>
    /// Defines the slots available for styling in the RzQuickReferenceContainer component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}