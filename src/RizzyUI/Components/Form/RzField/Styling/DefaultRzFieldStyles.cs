namespace RizzyUI;

/// <summary> Provides default styles for RzField. </summary>
public class DefaultRzFieldStyles : RzStylesBase.RzFieldStylesBase
{
 
    /// <inheritdoc />
    public DefaultRzFieldStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Field => "space-y-1";
}

/// <summary> Provides default styles for RzFieldLabel. </summary>
public class DefaultRzFieldLabelStyles : RzStylesBase.RzFieldLabelStylesBase
{
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
    /// <inheritdoc />
    public DefaultRzFieldHelpStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string HelpText => "text-sm text-on-surface";
}