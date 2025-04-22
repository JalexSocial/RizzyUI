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
    public override string Navbar =>
        "fixed top-0 z-50 h-16 w-screen items-center justify-between border-outline bg-surface-alt/75 px-4 py-2 backdrop-blur-xl flex border-b";

    /// <inheritdoc />
    public override string ToggleButton => "md:hidden inline-block text-on-surface";

    /// <inheritdoc />
    public override string ToggleButtonIconContainer => "text-xl";

    /// <inheritdoc />
    public override string ToggleButtonSrText => "sr-only";

    /// <inheritdoc />
    public override string ContentContainer => "h-full w-full flex items-center justify-between";
}