namespace RizzyUI;

/// <summary>
///     Provides the default styles for the RzNavbar component.
/// </summary>
public class DefaultRzNavbarStyles : RzStylesBase.RzNavbarStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzNavbarStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzNavbarStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Navbar => "fixed inset-x-0 top-0 z-50 h-16 flex items-center justify-between border-b bg-secondary/75 px-4 py-2 backdrop-blur-xl md:left-[var(--sidebar-width)] md:inset-r-0";

    /// <inheritdoc />
    public override string ToggleButton => "md:hidden inline-block text-foreground";

    /// <inheritdoc />
    public override string ToggleButtonIconContainer => "text-xl";

    /// <inheritdoc />
    public override string ToggleButtonSrText => "sr-only";

    /// <inheritdoc />
    public override string ContentContainer => "h-full w-full flex items-center justify-between";
}