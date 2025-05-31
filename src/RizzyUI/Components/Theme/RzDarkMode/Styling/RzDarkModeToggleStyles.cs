
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
        "inline-flex items-center justify-center p-2 rounded-md transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground bg-background hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground dark:focus-visible:ring-offset-background"; 
        // General interactive element styling, similar to an icon button

    /// <inheritdoc />
    public override string Icon => "transition-transform duration-300 ease-out size-5"; // Adjusted size to match common icon sizes
}