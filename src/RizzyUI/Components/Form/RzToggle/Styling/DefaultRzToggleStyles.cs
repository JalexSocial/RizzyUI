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
    // Note: Colors like text-primary, checked:bg-primary should ideally map to theme tokens if possible,
    // but Tailwind's checked: variant often relies on direct color classes.
    public override string Toggle =>
        "relative w-[3.25rem] h-7 p-px bg-outline border-transparent text-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:ring-primary disabled:opacity-50 disabled:pointer-events-none checked:bg-none checked:bg-primary checked:text-primary checked:border-primary focus:checked:border-primary dark:checked:bg-primary dark:checked:border-primary dark:focus:ring-offset-surface before:inline-block before:size-6 before:bg-on-primary checked:before:bg-on-primary before:translate-x-0 checked:before:translate-x-full before:rounded-full before:shadow before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-on-primary dark:checked:before:bg-on-primary";
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
    public override string ContentWrapper => "space-x-2";

    /// <inheritdoc />
    public override string InnerWrapper => "flex items-center justify-between space-x-3";

    /// <inheritdoc />
    public override string LabelInField =>
        "font-medium leading-relaxed"; // Specific style for label within toggle field

    /// <inheritdoc />
    public override string ToggleInField => ""; // No specific adjustment needed for the toggle itself usually

    /// <inheritdoc />
    public override string DescriptionInLabel => "block text-sm text-on-surface";
}