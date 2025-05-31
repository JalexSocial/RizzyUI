
namespace RizzyUI;

/// <summary> Provides default styles for RzField. </summary>
public class DefaultRzFieldStyles : RzStylesBase.RzFieldStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzFieldStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzFieldStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Field => "grid gap-2"; // Matches kitchen sink form field structure
}

/// <summary> Provides default styles for RzFieldLabel. </summary>
public class DefaultRzFieldLabelStyles : RzStylesBase.RzFieldLabelStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzFieldLabelStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzFieldLabelStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Label => "text-sm leading-none font-medium peer-disabled:opacity-50"; // Matches kitchen sink label

    /// <inheritdoc />
    public override string RequiredIndicator =>
        "text-sm text-destructive dark:text-destructive"; // Matches kitchen sink (though not explicitly shown there)
}

/// <summary> Provides default styles for RzFieldHelp. </summary>
public class DefaultRzFieldHelpStyles : RzStylesBase.RzFieldHelpStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzFieldHelpStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzFieldHelpStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string HelpText => "text-sm text-muted-foreground"; // Matches kitchen sink help text
}