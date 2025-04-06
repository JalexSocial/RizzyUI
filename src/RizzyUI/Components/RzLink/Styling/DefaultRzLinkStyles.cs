using RizzyUI.Styling;

namespace RizzyUI.Components.RzLink.Styling;

/// <summary>
/// Provides the default styles for the RzLink component.
/// </summary>
public  class DefaultRzLinkStyles : RzStylesBase.RzLinkStylesBase
{
    public DefaultRzLinkStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc/>
    // Use theme primary color for link, adjust dark mode as needed by theme
    public override string Link => $"font-medium text-{Theme.Light.Primary.TailwindClassName} underline-offset-2 focus:outline-hidden dark:text-{Theme.Dark.Primary.TailwindClassName}";

    /// <inheritdoc/>
    public override string UnderlineEnabled => "hover:underline focus:underline";
}

