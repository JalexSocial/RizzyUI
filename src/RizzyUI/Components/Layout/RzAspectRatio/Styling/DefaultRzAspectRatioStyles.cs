
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the RzAspectRatio component.
/// </summary>
public sealed class DefaultRzAspectRatioStyles : RzStylesBase.RzAspectRatioStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzAspectRatioStyles"/> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzAspectRatioStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc />
    public override string Wrapper => "relative w-full";

    /// <inheritdoc />
    public override string Inner => "absolute inset-0";
}