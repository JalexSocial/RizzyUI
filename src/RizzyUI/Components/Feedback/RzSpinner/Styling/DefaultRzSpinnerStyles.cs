
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the RzSpinner component.
/// </summary>
public class DefaultRzSpinnerStyles : RzStylesBase.RzSpinnerStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzSpinnerStyles"/> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzSpinnerStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string SpinnerBase => "motion-safe:animate-spin fill-on-surface"; // Default fill and animation

    /// <inheritdoc />
    public override string GetSizeCss(Size size)
    {
        return size switch
        {
            Size.ExtraSmall => "size-4",
            Size.Small => "size-5",
            Size.Medium => "size-6", // Default size
            Size.Large => "size-7",
            Size.ExtraLarge => "size-8",
            _ => GetSizeCss(Size.Medium) // Fallback to default
        };
    }

    /// <inheritdoc />
    public override string GetColorCss(SemanticColor color)
    {
        // Return fill class based on SemanticColor, defaulting to empty if None
        // The base class already provides fill-on-surface
        return color != SemanticColor.None ? ColorUtilExtensions.ToFillClass(color) : "";
    }
}

/// <summary>
/// Supports conversion of SemanticColor to CSS fill class strings.
/// </summary>
public static partial class ColorUtilExtensions
{
    /// <summary>
    /// Converts a SemanticColor to a fill class string.
    /// </summary>
    /// <param name="color">The color enum value.</param>
    /// <returns>A string representing the corresponding CSS fill class.</returns>
    public static string ToFillClass(this SemanticColor color)
    {
        return color switch
        {
            SemanticColor.None => "", // Uses SpinnerBase default (fill-on-surface)
            SemanticColor.Surface => "fill-surface",
            SemanticColor.OnSurface => "fill-on-surface",
            SemanticColor.OnSurfaceStrong => "fill-on-surface-strong",
            SemanticColor.SurfaceAlt => "fill-surface-alt",
            SemanticColor.Primary => "fill-primary",
            SemanticColor.OnPrimary => "fill-on-primary",
            SemanticColor.Secondary => "fill-secondary",
            SemanticColor.OnSecondary => "fill-on-secondary",
            SemanticColor.Outline => "fill-outline",
            SemanticColor.OutlineStrong => "fill-outline-strong",
            SemanticColor.Danger => "fill-danger",
            SemanticColor.OnDanger => "fill-on-danger",
            SemanticColor.Info => "fill-info",
            SemanticColor.OnInfo => "fill-on-info", // Check if onInfo fill exists or adjust
            SemanticColor.Warning => "fill-warning",
            SemanticColor.OnWarning => "fill-on-warning",
            SemanticColor.Success => "fill-success",
            SemanticColor.OnSuccess => "fill-on-success",
            _ => "" // Fallback to SpinnerBase default
        };
    }
}