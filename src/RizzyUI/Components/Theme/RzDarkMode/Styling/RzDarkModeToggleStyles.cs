namespace RizzyUI;

/// <summary> Provides default styles for RzDarkmodeToggle. </summary>
public class DefaultRzDarkmodeToggleStyles : RzStylesBase.RzDarkmodeToggleStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzDarkmodeToggleStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzDarkmodeToggleStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Button =>
        "inline-flex text-xl items-center justify-center p-2 mr-2 rounded-theme transition-colors ease-in-out duration-300 focus:outline-none text-on-surface bg-surface hover:bg-surface-alt/75 dark:hover:bg-surface-alt/75"; // Use semantic names, adjusted hover slightly

    /// <inheritdoc />
    public override string Icon => "transition-transform duration-300 ease-out";
}