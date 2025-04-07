namespace RizzyUI.Components.Form.RzNumber.Styling;

/// <summary> Provides default styles for RzNumberEdit. </summary>
public class DefaultRzNumberEditStyles : RzStylesBase.RzNumberEditStylesBase // Not sealed
{
    public DefaultRzNumberEditStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string InputWrapper => "relative";

    /// <inheritdoc />
    public override string PrependElement =>
        $"pointer-events-none absolute inset-y-0 left-0 my-px ml-px flex items-center rounded-l-borderRadius border-r border-outline bg-surface-alt pl-3 pr-1 text-on-surface dark:border-outline dark:bg-surface-alt dark:text-on-surface";

    /// <inheritdoc />
    public override string PrependIconContainer => "text-xl";

    /// <inheritdoc />
    public override string Input =>
        $"block w-full rounded-borderRadius border border-outline px-3 py-2 leading-6 placeholder-on-surface-muted focus:border-primary focus:ring focus:ring-primary/50 transition-opacity text-transparent dark:border-outline dark:bg-surface-alt dark:placeholder-on-surface-muted dark:focus:border-primary";
}

/// <summary> Provides default styles for RzNumberField. </summary>
public class DefaultRzNumberFieldStyles : RzStylesBase.RzNumberFieldStylesBase // Not sealed
{
    public DefaultRzNumberFieldStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Field => ""; // Handled by RzField component
}