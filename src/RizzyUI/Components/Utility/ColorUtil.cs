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
        "after:bg-surface after:bg-on-surface after:bg-on-surface-strong after:bg-surface-alt after:bg-primary after:bg-on-primary after:bg-secondary after:bg-on-secondary after:bg-outline after:bg-outline-strong after:bg-danger after:bg-on-danger after:bg-info after:bg-on-info after:bg-warning after:bg-on-warning after:bg-success after:bg-on-success after:bg-surface";

    /// <summary>
    ///     Converts an AccentColor to a background class string
    /// </summary>
    /// <param name="accentColor"></param>
    /// <returns></returns>
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
    /// <param name="accentColor"></param>
    /// <returns></returns>
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
    /// <param name="accentColor"></param>
    /// <returns></returns>
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

            // Surface Colors
            SemanticColor.Background => "text-surface ",
            SemanticColor.Foreground => "text-on-surface ",
            SemanticColor.Muted => "text-surface-alt ",
            SemanticColor.Primary => "text-primary ",
            SemanticColor.PrimaryForeground => "text-on-primary ",
            SemanticColor.Secondary => "text-secondary ",
            SemanticColor.SecondaryForeground => "text-on-secondary ",
            SemanticColor.Border => "text-outline ",

            // Status Colors (no dark variants)
            SemanticColor.Destructive => "text-danger",
            SemanticColor.DestructiveForeground => "text-on-danger",
            SemanticColor.Info => "text-info",
            SemanticColor.InfoForeground => "text-onInfo",
            SemanticColor.Warning => "text-warning",
            SemanticColor.WarningForeground => "text-on-warning",
            SemanticColor.Success => "text-success",
            SemanticColor.SuccessForeground => "text-on-success",

            _ => "text-on-surface "
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
            SemanticColor.None => "", // Uses SpinnerBase default (fill-on-surface)
            SemanticColor.Background => "fill-surface",
            SemanticColor.Foreground => "fill-on-surface",
            SemanticColor.Muted => "fill-surface-alt",
            SemanticColor.Primary => "fill-primary",
            SemanticColor.PrimaryForeground => "fill-on-primary",
            SemanticColor.Secondary => "fill-secondary",
            SemanticColor.SecondaryForeground => "fill-on-secondary",
            SemanticColor.Border => "fill-outline",
            SemanticColor.Destructive => "fill-danger",
            SemanticColor.DestructiveForeground => "fill-on-danger",
            SemanticColor.Info => "fill-info",
            SemanticColor.InfoForeground => "fill-on-info", // Check if onInfo fill exists or adjust
            SemanticColor.Warning => "fill-warning",
            SemanticColor.WarningForeground => "fill-on-warning",
            SemanticColor.Success => "fill-success",
            SemanticColor.SuccessForeground => "fill-on-success",
            _ => "" // Fallback to SpinnerBase default
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
            StatusColor.Primary => "text-on-primary ",
            StatusColor.Danger => "text-on-danger",
            StatusColor.Info => "text-onInfo",
            StatusColor.Secondary => "text-on-secondary",
            StatusColor.Success => "text-on-success",
            StatusColor.Warning => "text-on-warning",
            _ => "text-on-primary "
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

            // Surface Colors
            SemanticColor.Background => "bg-surface",
            SemanticColor.Foreground => "bg-on-surface",
            SemanticColor.Muted => "bg-surface-alt",
            SemanticColor.Primary => "bg-primary",
            SemanticColor.PrimaryForeground => "bg-on-primary",
            SemanticColor.Secondary => "bg-secondary",
            SemanticColor.SecondaryForeground => "bg-on-secondary",
            SemanticColor.Border => "bg-outline",

            // Status Colors (no dark variants)
            SemanticColor.Destructive => "bg-danger",
            SemanticColor.DestructiveForeground => "bg-on-danger",
            SemanticColor.Info => "bg-info",
            SemanticColor.InfoForeground => "bg-onInfo",
            SemanticColor.Warning => "bg-warning",
            SemanticColor.WarningForeground => "bg-on-warning",
            SemanticColor.Success => "bg-success",
            SemanticColor.SuccessForeground => "bg-on-success",

            _ => "bg-surface "
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

            // Surface Colors
            SemanticColor.Background => $"{ps}bg-surface",
            SemanticColor.Foreground => $"{ps}bg-on-surface",
            SemanticColor.Muted => $"{ps}bg-surface-alt",
            SemanticColor.Primary => $"{ps}bg-primary",
            SemanticColor.PrimaryForeground => $"{ps}bg-on-primary",
            SemanticColor.Secondary => $"{ps}bg-secondary",
            SemanticColor.SecondaryForeground => $"{ps}bg-on-secondary",
            SemanticColor.Border => $"{ps}bg-outline",

            // Status Colors (no dark variants)
            SemanticColor.Destructive => ps + "bg-danger",
            SemanticColor.DestructiveForeground => ps + "bg-on-danger",
            SemanticColor.Info => ps + "bg-info",
            SemanticColor.InfoForeground => ps + "bg-onInfo",
            SemanticColor.Warning => ps + "bg-warning",
            SemanticColor.WarningForeground => ps + "bg-on-warning",
            SemanticColor.Success => ps + "bg-success",
            SemanticColor.SuccessForeground => ps + "bg-on-success",

            _ => "bg-surface "
        };
    }
}