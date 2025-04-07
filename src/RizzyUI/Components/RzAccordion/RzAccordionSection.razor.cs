using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using Rizzy.Utility;
using RizzyUI.Extensions;

// Required for RzTheme

namespace RizzyUI;

/// <xmldoc>
///     Represents a section of an accordion component (<see cref="RzAccordion" />) that can be expanded or collapsed
///     to show or hide its content. Styling is managed by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzAccordionSection : RzComponent
{
    /// <summary> Get the currently active theme via Cascading Parameter. </summary>
    [CascadingParameter]
    protected RzTheme? CascadedTheme { get; set; }

    /// <summary> Injected configuration to get the default theme as fallback. </summary>
    [Inject]
    private IOptions<RizzyUIConfig>? Config { get; set; }

    /// <summary> The effective theme being used (Cascaded or Default). </summary>
    protected RzTheme Theme { get; set; } = default!;

    // Generate a unique ID for this section.
    private string SectionId { get; } = IdGenerator.UniqueId("rzaccsec");

    /// <summary> Gets the unique ID for the button element. </summary>
    protected string ButtonId => $"rzaccordion-button-{SectionId}";

    /// <summary> Gets the unique ID for the content container element. </summary>
    protected string ContentId => $"rzaccordion-content-{SectionId}";

    /// <summary> The title displayed in the clickable header of the accordion section. </summary>
    [Parameter]
    public string Title { get; set; } = string.Empty;

    /// <summary> Determines if the section is initially collapsed (true) or expanded (false). Defaults to true. </summary>
    [Parameter]
    public bool Collapsed { get; set; } = true;

    /// <summary> The content to be displayed inside the section when it is expanded. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    // --- Style Properties derived from Theme ---
    /// <summary> Gets the computed CSS classes for the section's button element. </summary>
    protected string? ButtonClass => TwMerge.Merge(AdditionalAttributes, Theme.RzAccordionSection.Button);

    /// <summary> Gets the computed CSS classes for the section's content container div. </summary>
    protected string ContentContainerClass => Theme.RzAccordionSection.ContentContainer;

    /// <summary> Gets the base CSS classes for the chevron icon. </summary>
    protected string ChevronIconClass => Theme.RzAccordionSection.ChevronIcon;

    /// <summary> Gets the CSS class applied to the chevron icon when the section is expanded. </summary>
    protected string ChevronIconExpandedClass => Theme.RzAccordionSection.ChevronIconExpanded;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Theme = CascadedTheme ?? Config?.Value.DefaultTheme ?? RzTheme.Default;
        if (Theme == null)
            throw new InvalidOperationException(
                $"{GetType()} requires a cascading RzTheme or a default theme configured.");
    }
}