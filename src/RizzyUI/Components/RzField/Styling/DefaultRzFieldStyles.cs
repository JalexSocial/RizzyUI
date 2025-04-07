using RizzyUI.Styling;

namespace RizzyUI.Components.RzField.Styling;

/// <summary> Provides default styles for RzField. </summary>
public  class DefaultRzFieldStyles : RzStylesBase.RzFieldStylesBase
{
    public DefaultRzFieldStyles(RzTheme theme) : base(theme) { }
    /// <inheritdoc/>
    public override string Field => "space-y-1";
}

/// <summary> Provides default styles for RzFieldLabel. </summary>
public  class DefaultRzFieldLabelStyles : RzStylesBase.RzFieldLabelStylesBase
{
    public DefaultRzFieldLabelStyles(RzTheme theme) : base(theme) { }
    /// <inheritdoc/>
    public override string Label => "font-medium";
    /// <inheritdoc/>
    public override string RequiredIndicator => $"text-sm text-{Theme.Danger.TailwindClassName} dark:text-{Theme.Danger.TailwindClassName}"; // Assuming Danger has dark variant or is same
}

/// <summary> Provides default styles for RzFieldHelp. </summary>
public  class DefaultRzFieldHelpStyles : RzStylesBase.RzFieldHelpStylesBase
{
     public DefaultRzFieldHelpStyles(RzTheme theme) : base(theme) { }
    /// <inheritdoc/>
    public override string HelpText => $"text-sm text-on-surface";
}

