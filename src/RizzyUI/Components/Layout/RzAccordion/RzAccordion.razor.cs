
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Represents an accordion component that allows for collapsible sections. Styling is handled by the active theme.
///     Interactivity is managed by the 'rzAccordion' Alpine.js component.
/// </xmldoc>
public partial class RzAccordion : RzComponent<RzAccordion.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzAccordion component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "w-full"
    );

    /// <summary> When true, multiple sections may be open simultaneously. </summary>
    [Parameter]
    public AccordionType Type { get; set; }

    /// <summary> Child content containing one or more AccordionItem components. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzAccordion;

    /// <summary>
    /// Defines the slots available for styling in the RzAccordion component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}