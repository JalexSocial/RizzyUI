namespace RizzyUI;

/// <summary>
///     Provides the default styles for the RzAccordion component.
/// </summary>
public class DefaultRzAccordionStyles : RzStylesBase.RzAccordionStylesBase
{
	/// <summary>
	///     Initializes a new instance of the <see cref="DefaultRzAccordionStyles" /> class.
	/// </summary>
	/// <param name="theme">The theme instance providing styling context.</param>
	public DefaultRzAccordionStyles(RzTheme theme) : base(theme)
    {
    }

	/// <summary>
	///     Gets the base CSS classes for the main RzAccordion container div.
	/// </summary>
	public override string Container =>
        "w-full divide-y divide-outline overflow-hidden rounded-theme border border-outline bg-surface-alt/40 text-on-surface dark:divide-outline";
}