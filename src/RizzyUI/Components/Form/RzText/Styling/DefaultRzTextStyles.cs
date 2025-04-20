namespace RizzyUI;

/// <summary> Provides default styles for RzTextEdit. </summary>
public class DefaultRzTextEditStyles : RzStylesBase.RzTextEditStylesBase
{
	/// <summary>
	/// Initializes a new instance of the <see cref="DefaultRzTextEditStyles"/> class.
	/// </summary>
	/// <param name="theme">The theme instance providing styling context.</param>
	public DefaultRzTextEditStyles(RzTheme theme) : base(theme)
	{
	}

	/// <inheritdoc />
	public override string InputWrapper => "relative";

	/// <inheritdoc />
	public override string PrependElement =>
		$"pointer-events-none absolute inset-y-0 left-0 my-px ml-px flex items-center rounded-l-borderRadius border-r border-outline bg-surface-alt px-3 text-on-surface dark:border-outline dark:bg-surface-alt dark:text-on-surface"; // Adjusted padding slightly, used theme tokens

	/// <inheritdoc />
	public override string PrependIconContainer => "text-xl";

	/// <inheritdoc />
	public override string Input =>
		"block w-full rounded-theme border border-outline px-3 py-2 leading-6 placeholder-on-surface-muted focus:border-primary focus:ring focus:ring-primary/50 dark:border-outline dark:bg-surface-alt dark:placeholder-on-surface-muted dark:focus:border-primary transition-opacity text-transparent"; // text-transparent initially for rzPrependInput
}

/// <summary> Provides default styles for RzTextField. </summary>
public class DefaultRzTextFieldStyles : RzStylesBase.RzTextFieldStylesBase
{
	/// <summary>
	/// Initializes a new instance of the <see cref="DefaultRzTextFieldStyles"/> class.
	/// </summary>
	/// <param name="theme">The theme instance providing styling context.</param>
	public DefaultRzTextFieldStyles(RzTheme theme) : base(theme)
	{
	}

	/// <inheritdoc />
	public override string Field => ""; // Handled by RzField component
}