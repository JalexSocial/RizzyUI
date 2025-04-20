namespace RizzyUI;

/// <summary> Provides default styles for RzField. </summary>
public class DefaultRzFieldStyles : RzStylesBase.RzFieldStylesBase
{

	/// <summary>
	/// Initializes a new instance of the <see cref="DefaultRzFieldStyles"/> class.
	/// </summary>
	/// <param name="theme">The theme instance providing styling context.</param>
	public DefaultRzFieldStyles(RzTheme theme) : base(theme)
	{
	}

	/// <inheritdoc />
	public override string Field => "space-y-1";
}

/// <summary> Provides default styles for RzFieldLabel. </summary>
public class DefaultRzFieldLabelStyles : RzStylesBase.RzFieldLabelStylesBase
{
	/// <summary>
	/// Initializes a new instance of the <see cref="DefaultRzFieldLabelStyles"/> class.
	/// </summary>
	/// <param name="theme">The theme instance providing styling context.</param>
	public DefaultRzFieldLabelStyles(RzTheme theme) : base(theme)
	{
	}

	/// <inheritdoc />
	public override string Label => "font-medium";

	/// <inheritdoc />
	public override string RequiredIndicator =>
		$"text-sm text-danger dark:text-danger"; // Assuming Danger has dark variant or is same
}

/// <summary> Provides default styles for RzFieldHelp. </summary>
public class DefaultRzFieldHelpStyles : RzStylesBase.RzFieldHelpStylesBase
{
	/// <summary>
	/// Initializes a new instance of the <see cref="DefaultRzFieldHelpStyles"/> class.
	/// </summary>
	/// <param name="theme">The theme instance providing styling context.</param>
	public DefaultRzFieldHelpStyles(RzTheme theme) : base(theme)
	{
	}

	/// <inheritdoc />
	public override string HelpText => "text-sm text-on-surface";
}