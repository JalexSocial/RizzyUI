
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the <see cref="RzKbdGroup"/> component.
/// </summary>
public class DefaultRzKbdGroupStyles : RzStylesBase.RzKbdGroupStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzKbdGroupStyles"/> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzKbdGroupStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc/>
    public override string Group => "inline-flex items-center gap-1";
}