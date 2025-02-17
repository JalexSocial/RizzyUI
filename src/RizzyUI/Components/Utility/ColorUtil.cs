namespace RizzyUI;

/// <summary>
/// Provides utility methods for converting accent and semantic color values to complete Tailwind CSS class strings for background and text styling.
/// </summary>
public static class ColorUtil
{
    /// <summary>
    /// Converts an AccentColor to a background class string
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
    /// Converts an AccentColor to a background class string
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
    /// Converts an AccentColor to a text class string
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
    /// Converts a SemanticColor to a text class string, including dark mode variants for Surface colors.
    /// </summary>
    /// <param name="color">The color enum value.</param>
    /// <returns>A string representing the corresponding CSS class.</returns>
    public static string ToTextClass(this SemanticColor color)
    {
        return color switch
        {
            SemanticColor.None => "",

            // Surface Colors
            SemanticColor.Surface => "text-surface dark:text-surface-dark",
            SemanticColor.OnSurface => "text-on-surface dark:text-on-surface-dark",
            SemanticColor.OnSurfaceStrong => "text-on-surface-strong dark:text-on-surface-dark-strong",
            SemanticColor.SurfaceAlt => "text-surface-alt dark:text-surface-dark-alt",
            SemanticColor.Primary => "text-primary dark:text-primary-dark",
            SemanticColor.OnPrimary => "text-on-primary dark:text-on-primary-dark",
            SemanticColor.Secondary => "text-secondary dark:text-secondary-dark",
            SemanticColor.OnSecondary => "text-on-secondary dark:text-on-secondary-dark",
            SemanticColor.Outline => "text-outline dark:text-outline-dark",
            SemanticColor.OutlineStrong => "text-outline-strong dark:text-outline-dark-strong",

            // Status Colors (no dark variants)
            SemanticColor.Danger => "text-danger",
            SemanticColor.OnDanger => "text-on-danger",
            SemanticColor.Info => "text-info",
            SemanticColor.OnInfo => "text-onInfo",
            SemanticColor.Warning => "text-warning",
            SemanticColor.OnWarning => "text-on-warning",
            SemanticColor.Success => "text-success",
            SemanticColor.OnSuccess => "text-on-success",

            _ => "text-on-surface dark:text-on-surface-dark"
        };
    }

    /// <summary>
    /// Converts a StatusColor to a text class string, including dark mode variants for Status colors.
    /// </summary>
    /// <param name="color">The color enum value.</param>
    /// <returns>A string representing the corresponding CSS class.</returns>
    public static string ToTextClass(this StatusColor color)
    {
        return color switch
        {
            StatusColor.Primary => "text-on-primary dark:text-on-primary-dark",
            StatusColor.Danger => "text-on-danger dark:text-on-dangerDark",
            StatusColor.Info => "text-onInfo dark:text-onInfoDark",
            StatusColor.Secondary => "text-on-secondary dark:text-on-secondary-dark",
            StatusColor.Success => "text-on-success dark:text-on-successDark",
            StatusColor.Warning => "text-on-warning dark:text-on-warningDark",
            _ => "text-on-primary dark:text-on-primary-dark"
        };
    }

    /// <summary>
    /// Converts a SemanticColor to a background class string, including dark mode variants for Surface colors.
    /// </summary>
    /// <param name="color">The color enum value.</param>
    /// <returns>A string representing the corresponding CSS background class.</returns>
    public static string ToBackgroundClass(this SemanticColor color)
    {
        return color switch
        {
            SemanticColor.None => "",

            // Surface Colors
            SemanticColor.Surface => "bg-surface dark:bg-surface-dark",
            SemanticColor.OnSurface => "bg-on-surface dark:bg-on-surface-dark",
            SemanticColor.OnSurfaceStrong => "bg-on-surface-strong dark:bg-on-surface-dark-strong",
            SemanticColor.SurfaceAlt => "bg-surface-alt dark:bg-surface-dark-alt",
            SemanticColor.Primary => "bg-primary dark:bg-primary-dark",
            SemanticColor.OnPrimary => "bg-on-primary dark:bg-on-primary-dark",
            SemanticColor.Secondary => "bg-secondary dark:bg-secondary-dark",
            SemanticColor.OnSecondary => "bg-on-secondary dark:bg-on-secondary-dark",
            SemanticColor.Outline => "bg-outline dark:bg-outline-dark",
            SemanticColor.OutlineStrong => "bg-outline-strong dark:bg-outline-dark-strong",

            // Status Colors (no dark variants)
            SemanticColor.Danger => "bg-danger",
            SemanticColor.OnDanger => "bg-on-danger",
            SemanticColor.Info => "bg-info",
            SemanticColor.OnInfo => "bg-onInfo",
            SemanticColor.Warning => "bg-warning",
            SemanticColor.OnWarning => "bg-on-warning",
            SemanticColor.Success => "bg-success",
            SemanticColor.OnSuccess => "bg-on-success",

            _ => "bg-surface dark:bg-surface-dark"
        };
    }

    /// <summary>
    /// Converts a SemanticColor to a background class string, including dark mode variants for Surface colors.
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
            SemanticColor.Surface => $"{ps}bg-surface dark:{ps}bg-surface-dark",
            SemanticColor.OnSurface => $"{ps}bg-on-surface dark:{ps}bg-on-surface-dark",
            SemanticColor.OnSurfaceStrong => $"{ps}bg-on-surface-strong dark:{ps}bg-on-surface-dark-strong",
            SemanticColor.SurfaceAlt => $"{ps}bg-surface-alt dark:{ps}bg-surface-dark-alt",
            SemanticColor.Primary => $"{ps}bg-primary dark:{ps}bg-primary-dark",
            SemanticColor.OnPrimary => $"{ps}bg-on-primary dark:{ps}bg-on-primary-dark",
            SemanticColor.Secondary => $"{ps}bg-secondary dark:{ps}bg-secondary-dark",
            SemanticColor.OnSecondary => $"{ps}bg-on-secondary dark:{ps}bg-on-secondary-dark",
            SemanticColor.Outline => $"{ps}bg-outline dark:{ps}bg-outline-dark",
            SemanticColor.OutlineStrong => $"{ps}bg-outline-strong dark:{ps}bg-outline-dark-strong",

            // Status Colors (no dark variants)
            SemanticColor.Danger => ps + "bg-danger",
            SemanticColor.OnDanger => ps + "bg-on-danger",
            SemanticColor.Info => ps + "bg-info",
            SemanticColor.OnInfo => ps + "bg-onInfo",
            SemanticColor.Warning => ps + "bg-warning",
            SemanticColor.OnWarning => ps + "bg-on-warning",
            SemanticColor.Success => ps + "bg-success",
            SemanticColor.OnSuccess => ps + "bg-on-success",

            _ => "bg-surface dark:bg-surface-dark"
        };
    }

    // ReSharper disable once UnusedMember.Local
    [System.Diagnostics.CodeAnalysis.SuppressMessage("CodeQuality", "IDE0051:Remove unused private members", Justification = "This is to allow Tailwind utilities to discover used classes")]
#pragma warning disable CS0414 // Field is assigned but its value is never used
    private static readonly string TwBackgroundClassAfterDiscovery =
#pragma warning restore CS0414 // Field is assigned but its value is never used
	    "after:bg-surface dark:after:bg-surface-dark after:bg-on-surface dark:after:bg-on-surface-dark after:bg-on-surface-strong dark:after:bg-on-surface-dark-strong after:bg-surface-alt dark:after:bg-surface-dark-alt after:bg-primary dark:after:bg-primary-dark after:bg-on-primary dark:after:bg-on-primary-dark after:bg-secondary dark:after:bg-secondary-dark after:bg-on-secondary dark:after:bg-on-secondary-dark after:bg-outline dark:after:bg-outline-dark after:bg-outline-strong dark:after:bg-outline-dark-strong after:bg-danger after:bg-on-danger after:bg-info after:bg-on-info after:bg-warning after:bg-on-warning after:bg-success after:bg-on-success after:bg-surface dark:after:bg-surface-dark";

}
