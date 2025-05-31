
namespace RizzyUI;

/// <summary> Provides default styles for RzToggle. </summary>
public class DefaultRzToggleStyles : RzStylesBase.RzToggleStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzToggleStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzToggleStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Toggle =>
        "appearance-none focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 bg-input dark:bg-input/80 checked:bg-primary dark:checked:bg-primary before:content-[''] before:pointer-events-none before:block before:size-4 before:rounded-full before:ring-0 before:transition-all before:bg-background dark:before:bg-foreground dark:checked:before:bg-primary-foreground checked:before:ms-3.5"; // Matches kitchen sink switch
}

/// <summary> Provides default styles for RzToggleField. </summary>
public class DefaultRzToggleFieldStyles : RzStylesBase.RzToggleFieldStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzToggleFieldStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzToggleFieldStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Field => ""; // Handled by RzField

    /// <inheritdoc />
    public override string ContentWrapper => "gap-2 flex flex-row items-start justify-between rounded-lg border p-4 shadow-xs"; // Matches kitchen sink form switch layout

    /// <inheritdoc />
    public override string InnerWrapper => "flex flex-col gap-0.5"; // For label and description

    /// <inheritdoc />
    public override string LabelInField =>
        "leading-normal text-sm font-medium"; // Matches kitchen sink switch label

    /// <inheritdoc />
    public override string ToggleInField => ""; // No specific adjustment needed for the toggle itself usually

    /// <inheritdoc />
    public override string DescriptionInLabel => "text-sm text-muted-foreground"; // Matches kitchen sink switch description
}