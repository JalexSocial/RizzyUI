namespace RizzyUI;

/// <summary> Provides default styles for RzSearchButton. </summary>
public class DefaultRzSearchButtonStyles : RzStylesBase.RzSearchButtonStylesBase
{
	/// <summary>
	///     Initializes a new instance of the <see cref="DefaultRzSearchButtonStyles" /> class.
	/// </summary>
	/// <param name="theme">The theme instance providing styling context.</param>
	public DefaultRzSearchButtonStyles(RzTheme theme) : base(theme)
    {
    }

	/// <inheritdoc />
	public override string Button =>
        "flex h-10 w-full cursor-pointer items-center justify-between border-outline bg-surface-alt p-2 px-4 font-light transition-all duration-200 rounded-theme border"; // Use semantic names & rounded-theme

	/// <inheritdoc />
	public override string InnerContainer => "flex items-center gap-2";

	/// <inheritdoc />
	public override string IconSpan => "text-xl";
}