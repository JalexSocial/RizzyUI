
namespace RizzyUI;

/// <summary>
///     Provides the default styles for the AccordionItem component.
/// </summary>
public class DefaultAccordionItemStyles : RzStylesBase.AccordionItemStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultAccordionItemStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance to use for styling.</param>
    public DefaultAccordionItemStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container => "border-b last:border-b-0"; // Matches kitchen sink <details>

    /// <inheritdoc />
    public override string Button =>
        "flex flex-1 items-start justify-between gap-4 py-4 text-left text-sm font-medium hover:underline w-full focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-all outline-none rounded-md"; // Matches kitchen sink <summary> and <h2> inside

    /// <inheritdoc />
    public override string ContentContainerWrapper => "pb-4"; // Matches kitchen sink <section class="pb-4">

    /// <inheritdoc />
    public override string ContentContainer => "text-sm"; // Matches kitchen sink <p class="text-sm">

    /// <inheritdoc />
    public override string ChevronIcon => "text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200"; // Matches kitchen sink chevron svg

    /// <inheritdoc />
    public override string ChevronIconExpanded => "group-open:rotate-180"; // Matches kitchen sink chevron svg group-open state
}