namespace RizzyUI;

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
    public override string Container => ""; // Container div has no specific base style

    /// <inheritdoc />
    public override string Button =>
        "flex w-full items-center justify-between gap-4 bg-surface-alt p-4 text-left underline-offset-2 hover:bg-surface-alt/75 focus-visible:bg-surface-alt/75 focus-visible:underline focus-visible:outline-none dark:hover:bg-surface-alt/75 dark:focus-visible:bg-surface-alt/75 text-on-surface font-medium"; // Removed focus-visible:outline-hidden for better accessibility

    /// <inheritdoc />
    public override string ContentContainerWrapper => ""; // Wrapper for x-collapse has no base style

    /// <inheritdoc />
    public override string ContentContainer => "p-4 text-sm sm:text-base text-pretty text-on-surface"; // Added text color

    /// <inheritdoc />
    public override string ChevronIcon => "size-5 shrink-0 motion-safe:transition-transform"; // Added motion-safe

    /// <inheritdoc />
    public override string ChevronIconExpanded => "rotate-180"; // Class applied when expanded
}