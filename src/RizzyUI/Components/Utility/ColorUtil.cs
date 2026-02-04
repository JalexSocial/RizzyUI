
namespace RizzyUI;

/// <summary>
///     Provides utility methods for converting accent and semantic color values to complete Tailwind CSS class strings for
///     background and text styling.
/// </summary>
public static class ColorUtil
{
    // ReSharper disable once UnusedMember.Local
    [SuppressMessage("CodeQuality", "IDE0051:Remove unused private members",
        Justification = "This is to allow Tailwind utilities to discover used classes")]
#pragma warning disable CS0414 // Field is assigned but its value is never used
    private static readonly string TwBackgroundClassAfterDiscovery =
#pragma warning restore CS0414 // Field is assigned but its value is never used
        "after:bg-background after:bg-foreground after:bg-card after:bg-card-foreground after:bg-popover after:bg-popover-foreground " +
        "after:bg-primary after:bg-primary-foreground after:bg-secondary after:bg-secondary-foreground " +
        "after:bg-muted after:bg-muted-foreground after:bg-accent after:bg-accent-foreground " +
        "after:bg-destructive after:bg-destructive-foreground after:bg-border after:bg-input after:bg-ring " +
        "after:bg-info after:bg-info-foreground after:bg-warning after:bg-warning-foreground after:bg-success after:bg-success-foreground"; // Updated to OnInfo, OnWarning, OnSuccess to match SemanticColor

    /// <summary>
    ///     Converts an AccentColor to a background class string
    /// </summary>
    /// <param name="accentColor">The accent color.</param>
    /// <returns>The Tailwind CSS background class.</returns>
    public static string ToLightBackgroundClass(this AccentColor accentColor)
    {
        return accentColor switch
        {
            AccentColor.Inherit => "",
            AccentColor.Gray => "bg-gray-100",
            AccentColor.Emerald => "bg-emerald-200",
            AccentColor.Teal => "bg-teal-200",
            AccentColor.Blue => "bg-blue-200",
            AccentColor.Indigo => "bg-indigo-200",
            AccentColor.Purple => "bg-purple-200",
            AccentColor.Pink => "bg-pink-200",
            AccentColor.Red => "bg-red-200",
            AccentColor.Orange => "bg-orange-200",
            AccentColor.Yellow => "bg-yellow-300",
            _ => "bg-gray-100"
        };
    }

    /// <summary>
    ///     Converts an AccentColor to a background class string
    /// </summary>
    /// <param name="accentColor">The accent color.</param>
    /// <returns>The Tailwind CSS background class.</returns>
    public static string ToDarkBackgroundClass(this AccentColor accentColor)
    {
        return accentColor switch
        {
            AccentColor.Inherit => "",
            AccentColor.Gray => "bg-gray-400",
            AccentColor.Emerald => "bg-emerald-800",
            AccentColor.Teal => "bg-teal-600",
            AccentColor.Blue => "bg-blue-600",
            AccentColor.Indigo => "bg-indigo-700",
            AccentColor.Purple => "bg-purple-600",
            AccentColor.Pink => "bg-pink-500",
            AccentColor.Red => "bg-red-500",
            AccentColor.Orange => "bg-orange-500",
            AccentColor.Yellow => "bg-yellow-300",
            _ => "bg-gray-400"
        };
    }


    /// <summary>
    ///     Converts an AccentColor to a text class string
    /// </summary>
    /// <param name="accentColor">The accent color.</param>
    /// <returns>The Tailwind CSS text class.</returns>
    public static string ToTextClass(AccentColor accentColor)
    {
        return accentColor switch
        {
            AccentColor.Inherit => "",
            AccentColor.Gray => "text-gray-600",
            AccentColor.Emerald => "text-emerald-700",
            AccentColor.Teal => "text-teal-700",
            AccentColor.Blue => "text-blue-700",
            AccentColor.Indigo => "text-indigo-700",
            AccentColor.Purple => "text-purple-700",
            AccentColor.Pink => "text-pink-700",
            AccentColor.Red => "text-red-700",
            AccentColor.Orange => "text-orange-700",
            AccentColor.Yellow => "text-yellow-800",
            _ => "text-gray-600"
        };
    }

    /// <summary>
    ///     Converts a SemanticColor to a text class string, including dark mode variants for Surface colors.
    /// </summary>
    /// <param name="color">The color enum value.</param>
    /// <returns>A string representing the corresponding CSS class.</returns>
    public static string ToTextClass(this SemanticColor color)
    {
        return color switch
        {
            SemanticColor.None => "",
            SemanticColor.Background => "text-background",
            SemanticColor.Foreground => "text-foreground",
            SemanticColor.Card => "text-card",
            SemanticColor.CardForeground => "text-card-foreground",
            SemanticColor.Popover => "text-popover",
            SemanticColor.PopoverForeground => "text-popover-foreground",
            SemanticColor.Primary => "text-primary",
            SemanticColor.PrimaryForeground => "text-primary-foreground",
            SemanticColor.Secondary => "text-secondary",
            SemanticColor.SecondaryForeground => "text-secondary-foreground",
            SemanticColor.Muted => "text-muted",
            SemanticColor.MutedForeground => "text-muted-foreground",
            SemanticColor.Accent => "text-accent",
            SemanticColor.AccentForeground => "text-accent-foreground",
            SemanticColor.Destructive => "text-destructive",
            SemanticColor.DestructiveForeground => "text-destructive-foreground",
            SemanticColor.Border => "text-border",
            SemanticColor.Input => "text-input",
            SemanticColor.Ring => "text-ring",
            SemanticColor.Info => "text-info",
            SemanticColor.InfoForeground => "text--info-foreground",
            SemanticColor.Warning => "text-warning",
            SemanticColor.WarningForeground => "text-warning-foreground",
            SemanticColor.Success => "text-success",
            SemanticColor.SuccessForeground => "text-success-foreground",
            _ => "text-foreground"
        };
    }

    /// <summary>
    /// Converts a SemanticColor to a fill class string.
    /// </summary>
    /// <param name="color">The color enum value.</param>
    /// <returns>A string representing the corresponding CSS fill class.</returns>
    public static string ToFillClass(this SemanticColor color)
    {
        return color switch
        {
            SemanticColor.None => "",
            SemanticColor.Background => "fill-background",
            SemanticColor.Foreground => "fill-foreground",
            SemanticColor.Card => "fill-card",
            SemanticColor.CardForeground => "fill-card-foreground",
            SemanticColor.Popover => "fill-popover",
            SemanticColor.PopoverForeground => "fill-popover-foreground",
            SemanticColor.Primary => "fill-primary",
            SemanticColor.PrimaryForeground => "fill-primary-foreground",
            SemanticColor.Secondary => "fill-secondary",
            SemanticColor.SecondaryForeground => "fill-secondary-foreground",
            SemanticColor.Muted => "fill-muted",
            SemanticColor.MutedForeground => "fill-muted-foreground",
            SemanticColor.Accent => "fill-accent",
            SemanticColor.AccentForeground => "fill-accent-foreground",
            SemanticColor.Destructive => "fill-destructive",
            SemanticColor.DestructiveForeground => "fill-destructive-foreground",
            SemanticColor.Border => "fill-border",
            SemanticColor.Input => "fill-input",
            SemanticColor.Ring => "fill-ring",
            SemanticColor.Info => "fill-info",
            SemanticColor.InfoForeground => "fill--info-foreground",
            SemanticColor.Warning => "fill-warning",
            SemanticColor.WarningForeground => "fill-warning-foreground",
            SemanticColor.Success => "fill-success",
            SemanticColor.SuccessForeground => "fill-success-foreground",
            _ => "fill-foreground"
        };
    }

    /// <summary>
    ///     Converts a StatusColor to a text class string, including dark mode variants for Status colors.
    /// </summary>
    /// <param name="color">The color enum value.</param>
    /// <returns>A string representing the corresponding CSS class.</returns>
    public static string ToTextClass(this StatusColor color)
    {
        return color switch
        {
            StatusColor.Primary => "text-primary",
            StatusColor.Secondary => "text-secondary",
            StatusColor.Success => "text-success", // Assumes --success CSS var exists
            StatusColor.Info => "text-info",       // Assumes --info CSS var exists
            StatusColor.Warning => "text-warning",   // Assumes --warning CSS var exists
            StatusColor.Destructive => "text-destructive", // Maps to semantic destructive
            _ => "text-primary"
        };
    }

    /// <summary>
    ///     Converts a SemanticColor to a background class string, including dark mode variants for Surface colors.
    /// </summary>
    /// <param name="color">The color enum value.</param>
    /// <returns>A string representing the corresponding CSS background class.</returns>
    public static string ToBackgroundClass(this SemanticColor color)
    {
        return color switch
        {
            SemanticColor.None => "",
            SemanticColor.Background => "bg-background",
            SemanticColor.Foreground => "bg-foreground",
            SemanticColor.Card => "bg-card",
            SemanticColor.CardForeground => "bg-card-foreground",
            SemanticColor.Popover => "bg-popover",
            SemanticColor.PopoverForeground => "bg-popover-foreground",
            SemanticColor.Primary => "bg-primary",
            SemanticColor.PrimaryForeground => "bg-primary-foreground",
            SemanticColor.Secondary => "bg-secondary",
            SemanticColor.SecondaryForeground => "bg-secondary-foreground",
            SemanticColor.Muted => "bg-muted",
            SemanticColor.MutedForeground => "bg-muted-foreground",
            SemanticColor.Accent => "bg-accent",
            SemanticColor.AccentForeground => "bg-accent-foreground",
            SemanticColor.Destructive => "bg-destructive",
            SemanticColor.DestructiveForeground => "bg-destructive-foreground",
            SemanticColor.Border => "bg-border",
            SemanticColor.Input => "bg-input",
            SemanticColor.Ring => "bg-ring",
            SemanticColor.Info => "bg-info",
            SemanticColor.InfoForeground => "bg--info-foreground",
            SemanticColor.Warning => "bg-warning",
            SemanticColor.WarningForeground => "bg-warning-foreground",
            SemanticColor.Success => "bg-success",
            SemanticColor.SuccessForeground => "bg-success-foreground",
            _ => "bg-background"
        };
    }

    /// <summary>
    ///     Converts a SemanticColor to a background class string, including dark mode variants for Surface colors.
    /// </summary>
    /// <param name="color">The color enum value.</param>
    /// <param name="pseudoSelector">Tailwind pseudo element modifier ("before" or "after")</param>
    /// <returns>A string representing the corresponding CSS background class.</returns>
    public static string ToBackgroundClass(this SemanticColor color, string pseudoSelector)
    {
        var ps = pseudoSelector + ":";

        return color switch
        {
            SemanticColor.None => "",
            SemanticColor.Background => $"{ps}bg-background",
            SemanticColor.Foreground => $"{ps}bg-foreground",
            SemanticColor.Card => $"{ps}bg-card",
            SemanticColor.CardForeground => $"{ps}bg-card-foreground",
            SemanticColor.Popover => $"{ps}bg-popover",
            SemanticColor.PopoverForeground => $"{ps}bg-popover-foreground",
            SemanticColor.Primary => $"{ps}bg-primary",
            SemanticColor.PrimaryForeground => $"{ps}bg-primary-foreground",
            SemanticColor.Secondary => $"{ps}bg-secondary",
            SemanticColor.SecondaryForeground => $"{ps}bg-secondary-foreground",
            SemanticColor.Muted => $"{ps}bg-muted",
            SemanticColor.MutedForeground => $"{ps}bg-muted-foreground",
            SemanticColor.Accent => $"{ps}bg-accent",
            SemanticColor.AccentForeground => $"{ps}bg-accent-foreground",
            SemanticColor.Destructive => $"{ps}bg-destructive",
            SemanticColor.DestructiveForeground => $"{ps}bg-destructive-foreground",
            SemanticColor.Border => $"{ps}bg-border",
            SemanticColor.Input => $"{ps}bg-input",
            SemanticColor.Ring => $"{ps}bg-ring",
            SemanticColor.Info => $"{ps}bg-info",
            SemanticColor.InfoForeground => $"{ps}bg--info-foreground",
            SemanticColor.Warning => $"{ps}bg-warning",
            SemanticColor.WarningForeground => $"{ps}bg-warning-foreground",
            SemanticColor.Success => $"{ps}bg-success",
            SemanticColor.SuccessForeground => $"{ps}bg-success-foreground",
            _ => $"{ps}bg-background"
        };
    }
}