namespace RizzyUI.Components.RzAccordion.Styling;

/// <summary>
///     Provides the default styles for the RzAccordionSection component.
/// </summary>
public class DefaultRzAccordionSectionStyles : RzStylesBase.RzAccordionSectionStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzAccordionSectionStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance to use for styling.</param>
    public DefaultRzAccordionSectionStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Button =>
        "flex w-full items-center justify-between gap-4 bg-surface-alt p-4 text-left underline-offset-2 hover:bg-surface-alt/75 focus-visible:bg-surface-alt/75 focus-visible:underline focus-visible:outline-hidden dark:hover:bg-surface-alt/75 dark:focus-visible:bg-surface-alt/75 text-on-surface font-medium";

    /// <inheritdoc />
    public override string ContentContainer => "p-4 text-sm sm:text-base text-pretty";

    /// <inheritdoc />
    public override string ChevronIcon => "size-5 shrink-0 transition";

    /// <inheritdoc />
    public override string ChevronIconExpanded => "rotate-180"; // Class applied when expanded
}