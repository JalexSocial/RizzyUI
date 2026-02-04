
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Renders an "on this page" style navigation outline based on headings registered
///     with the parent &lt;see cref="RzQuickReferenceContainer" /&gt;. Interacts with Alpine.js
///     to highlight the currently visible heading and set `aria-current`.
///     Styling is determined by the active &lt;see cref="RzTheme" /&gt;.
/// </xmldoc>
public partial class RzQuickReference : RzComponent<RzQuickReference.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzQuickReference component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "text-foreground",
        slots: new()
        {
            [s => s.Title] = "mb-4 font-bold",
            [s => s.List] = "flex flex-col gap-2",
            [s => s.ListItem] = "",
            [s => s.Link] = ""
        }
    );

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

        _headings = QuickReferenceContainer.GetHeadingItems();
        Title ??= Localizer["RzQuickReference.DefaultTitle"];
        AriaLabel ??= Localizer["RzQuickReference.DefaultAriaLabel"];
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        if (QuickReferenceContainer != null) _headings = QuickReferenceContainer.GetHeadingItems();
        Title ??= Localizer["RzQuickReference.DefaultTitle"];
        AriaLabel ??= Localizer["RzQuickReference.DefaultAriaLabel"];
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzQuickReference;

    /// <summary> Gets the CSS class for indentation based on the heading level. </summary>
    protected string GetIndentationClass(HeadingLevel level)
    {
        var relativeLevel = (int)level - (int)(QuickReferenceContainer?.MinimumHeadingLevel ?? HeadingLevel.H2);
        return relativeLevel switch
        {
            0 => "ml-0",
            1 => "ml-4",
            2 => "ml-8",
            3 => "ml-12",
            _ => "ml-0"
        };
    }

    /// <summary>
    /// Defines the slots available for styling in the RzQuickReference component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("quick-reference")]
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the title element.
        /// </summary>
        [Slot("quick-reference-title")]
        public string? Title { get; set; }
        /// <summary>
        /// The slot for the list (`&lt;ul&gt;`) element.
        /// </summary>
        [Slot("quick-reference-list")]
        public string? List { get; set; }
        /// <summary>
        /// The slot for each list item (`&lt;li&gt;`) element.
        /// </summary>
        [Slot("quick-reference-list-item")]
        public string? ListItem { get; set; }
        /// <summary>
        /// The slot for each link (`&lt;a&gt;`) element.
        /// </summary>
        [Slot("quick-reference-link")]
        public string? Link { get; set; }
    }
}