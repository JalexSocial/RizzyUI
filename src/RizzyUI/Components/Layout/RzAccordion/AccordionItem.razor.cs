
using Microsoft.AspNetCore.Components;
using Rizzy.Utility;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Represents a section of an accordion component (<see cref="RzAccordion" />) that can be expanded or collapsed
///     to show or hide its content. Styling is managed by the active <see cref="RzTheme" />.
///     Interactivity is managed by the 'accordionItem' Alpine.js component.
/// </xmldoc>
public partial class AccordionItem : RzComponent<AccordionItem.Slots>
{
    /// <summary>
    /// Defines the default styling for the AccordionItem component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "border-b last:border-b-0",
        slots: new()
        {
            [s => s.Button] = "flex flex-1 items-start justify-between gap-4 py-4 text-left text-sm font-medium hover:underline w-full focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-all outline-none rounded-md",
            [s => s.ContentContainerWrapper] = "pb-4",
            [s => s.ContentContainer] = "text-sm",
            [s => s.ChevronIcon] = "text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200",
            [s => s.ChevronIconExpanded] = "group-open:rotate-180"
        }
    );

    private string SectionId { get; } = IdGenerator.UniqueId("rzaccsec");

    /// <summary> Gets the unique ID for the button element. </summary>
    protected string ButtonId => $"rzaccordion-button-{SectionId}";

    /// <summary> Gets the unique ID for the content container element. </summary>
    protected string ContentId => $"rzaccordion-content-{SectionId}";

    /// <summary> The title displayed in the clickable header of the accordion section (if AccordionTrigger is not defined). </summary>
    [Parameter]
    public string Title { get; set; } = string.Empty;

    /// <summary> Determines if the section is initially collapsed (true) or expanded (false). Defaults to true. </summary>
    [Parameter]
    public bool Collapsed { get; set; } = true;

    /// <summary> The content to be displayed inside the accordion (overrides Title if set). </summary>
    [Parameter]
    public RenderFragment? AccordionTrigger { get; set; }
    
    /// <summary> The content to be displayed inside the section when it is expanded. </summary>
    [Parameter]
    public RenderFragment? AccordionContent { get; set; }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.AccordionItem;

    /// <summary>
    /// Defines the slots available for styling in the AccordionItem component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the trigger button.
        /// </summary>
        public string? Button { get; set; }
        /// <summary>
        /// The slot for the wrapper around the content container.
        /// </summary>
        public string? ContentContainerWrapper { get; set; }
        /// <summary>
        /// The slot for the main content container.
        /// </summary>
        public string? ContentContainer { get; set; }
        /// <summary>
        /// The slot for the chevron icon.
        /// </summary>
        public string? ChevronIcon { get; set; }
        /// <summary>
        /// The slot for the expanded state of the chevron icon.
        /// </summary>
        public string? ChevronIconExpanded { get; set; }
    }
}