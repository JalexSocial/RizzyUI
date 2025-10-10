using RizzyUI;

/// <summary>
/// Helper extension methods for converting <see cref="StatusColor"/> values to Tailwind CSS classes.
/// </summary>
internal static class StepColorExtensions
{
	public static string ToBackgroundClass(this StatusColor color) => $"bg-{color.ToString().ToLowerInvariant()}";
	public static string ToBorderClass(this StatusColor color) => $"border-{color.ToString().ToLowerInvariant()}";
	public static string ToTextClass(this StatusColor color) => $"text-{color.ToString().ToLowerInvariant()}";
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