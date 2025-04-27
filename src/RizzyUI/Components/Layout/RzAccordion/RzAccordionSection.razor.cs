
using Microsoft.AspNetCore.Components;
using Rizzy.Utility;
using RizzyUI.Extensions;

// Required for RzTheme

namespace RizzyUI;

/// <xmldoc>
///     Represents a section of an accordion component (<see cref="RzAccordion" />) that can be expanded or collapsed
///     to show or hide its content. Styling is managed by the active <see cref="RzTheme" />.
///     Interactivity is managed by the 'rzAccordionSection' Alpine.js component.
/// </xmldoc>
public partial class RzAccordionSection : RzComponent
{
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

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzAccordionSection.Button);
    }
}