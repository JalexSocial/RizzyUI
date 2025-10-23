
using RizzyUI;

/// <summary>
/// Helper extension methods for converting <see cref="StatusColor"/> values to Tailwind CSS classes.
/// </summary>
internal static class StepColorExtensions
{
    /// <summary>
    /// Converts a StatusColor to a background class string.
    /// </summary>
    /// <param name="color">The status color.</param>
    /// <returns>The Tailwind CSS background class.</returns>
	public static string ToBackgroundClass(this StatusColor color) => $"bg-{color.ToString().ToLowerInvariant()}";

    /// <summary>
    /// Converts a StatusColor to a border class string.
    /// </summary>
    /// <param name="color">The status color.</param>
    /// <returns>The Tailwind CSS border class.</returns>
    public static string ToBorderClass(this StatusColor color) => $"border-{color.ToString().ToLowerInvariant()}";

    /// <summary>
    /// Converts a StatusColor to a text class string.
    /// </summary>
    /// <param name="color">The status color.</param>
    /// <returns>The Tailwind CSS text class.</returns>
    public static string ToTextClass(this StatusColor color) => $"text-{color.ToString().ToLowerInvariant()}";

    /// <summary>
    /// Converts a StatusColor to a foreground text class string for use on a colored background.
    /// </summary>
    /// <param name="color">The status color.</param>
    /// <returns>The Tailwind CSS foreground text class.</returns>
    public static string ToOnColorTextClass(this StatusColor color) => color switch
    {
        StatusColor.Primary => "text-primary-foreground",
        StatusColor.Secondary => "text-secondary-foreground",
        StatusColor.Success => "text-success-foreground",
        StatusColor.Info => "text-info-foreground",
        StatusColor.Warning => "text-warning-foreground",
        StatusColor.Destructive => "text-destructive-foreground",
        _ => "text-primary-foreground"
    };
}