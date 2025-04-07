using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Organizes form content into sections with an optional title and description, supporting different layouts.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzFormSection : RzComponent
{
    /// <summary> The title of the form section. Required. </summary>
    [Parameter]
    [EditorRequired]
    public string Title { get; set; } = string.Empty;

    /// <summary> Optional descriptive content for the section. </summary>
    [Parameter]
    public RenderFragment? Description { get; set; }

    /// <summary> The main content of the form section (e.g., input fields). </summary>
    [Parameter]
    public RenderFragment? Content { get; set; }

    /// <summary> The layout style for the section (Stacked or TwoColumn). Defaults to TwoColumn. </summary>
    [Parameter]
    public SectionLayout Layout { get; set; } = SectionLayout.TwoColumn;

    // --- Style Properties derived from Theme ---
    /// <summary> Gets the computed CSS classes for the description container div. </summary>
    protected string DescriptionContainerClass => Theme.RzFormSection.GetDescriptionLayoutCss(Layout);

    /// <summary> Gets the computed CSS classes for the title h2 element. </summary>
    protected string TitleClass => Theme.RzFormSection.Title;

    /// <summary> Gets the computed CSS classes for the description p element. </summary>
    protected string DescriptionClass => Theme.RzFormSection.Description;

    /// <summary> Gets the computed CSS classes for the content container div. </summary>
    protected string ContentContainerClass => Theme.RzFormSection.GetContentLayoutCss(Layout);

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzFormSection.Container,
            Theme.RzFormSection.GetLayoutCss(Layout));
    }
}