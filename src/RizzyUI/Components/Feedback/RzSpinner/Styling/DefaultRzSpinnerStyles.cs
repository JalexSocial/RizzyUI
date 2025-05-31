
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
    public override string SpinnerBase => "motion-safe:animate-spin fill-background"; // Default fill and animation

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
        // The base class already provides fill-background
        return color != SemanticColor.None ? ColorUtilExtensions.ToFillClass(color) : "fill-foreground";
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
            SemanticColor.None => "fill-foreground", // Uses SpinnerBase default (fill-background)
            SemanticColor.Background => "fill-background",
            SemanticColor.Foreground => "fill-foreground",
            SemanticColor.Muted => "fill-muted",
            SemanticColor.Primary => "fill-primary",
            SemanticColor.PrimaryForeground => "fill-primary-foreground",
            SemanticColor.Secondary => "fill-secondary",
            SemanticColor.SecondaryForeground => "fill-secondary-foreground",
            SemanticColor.Border => "fill-border",
            SemanticColor.Destructive => "fill-destructive",
            SemanticColor.DestructiveForeground => "fill-destructive-foreground",
            SemanticColor.Info => "fill-info",
            SemanticColor.InfoForeground => "fill-info-foreground", 
            SemanticColor.Warning => "fill-warning",
            SemanticColor.WarningForeground => "fill-warning-foreground",
            SemanticColor.Success => "fill-success",
            SemanticColor.SuccessForeground => "fill-success-foreground",
            _ => "fill-foreground" // Fallback to SpinnerBase default
        };
    }
}