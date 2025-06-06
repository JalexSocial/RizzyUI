
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Represents an accordion component that allows for collapsible sections. Styling is handled by the active theme.
///     Interactivity is managed by the 'rzAccordion' Alpine.js component.
/// </xmldoc>
public partial class RzAccordion : RzComponent
{
    /// <summary> When true, multiple sections may be open simultaneously. </summary>
    [Parameter]
    public AccordionType Type { get; set; }

    /// <summary> Child content containing one or more RzAccordionSection components. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzAccordion.Container);
    }
}