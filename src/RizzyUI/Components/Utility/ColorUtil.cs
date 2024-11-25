using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RizzyUI;

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
    /// Converts a Color to a text class string, including dark mode variants for Surface colors.
    /// </summary>
    /// <param name="color">The color enum value.</param>
    /// <returns>A string representing the corresponding CSS class.</returns>
    public static string ToTextClass(this Color color)
    {
        return color switch
        {
            // Surface Colors
            Color.Surface => "text-surface dark:text-surfaceDark",
            Color.OnSurface => "text-onSurface dark:text-onSurfaceDark",
            Color.OnSurfaceStrong => "text-onSurfaceStrong dark:text-onSurfaceStrongDark",
            Color.SurfaceAlt => "text-surfaceAlt dark:text-surfaceAltDark",
            Color.Primary => "text-primary dark:text-primaryDark",
            Color.OnPrimary => "text-onPrimary dark:text-onPrimaryDark",
            Color.Secondary => "text-secondary dark:text-secondaryDark",
            Color.OnSecondary => "text-onSecondary dark:text-onSecondaryDark",
            Color.Outline => "text-outline dark:text-outlineDark",
            Color.OutlineStrong => "text-outlineStrong dark:text-outlineStrongDark",

            // Status Colors (no dark variants)
            Color.Danger => "text-danger",
            Color.OnDanger => "text-onDanger",
            Color.Info => "text-info",
            Color.OnInfo => "text-onInfo",
            Color.Warning => "text-warning",
            Color.OnWarning => "text-onWarning",
            Color.Success => "text-success",
            Color.OnSuccess => "text-onSuccess",

            _ => "text-onSurface dark:text-onSurfaceDark"
        };
    }

    /// <summary>
    /// Converts a Color to a background class string, including dark mode variants for Surface colors.
    /// </summary>
    /// <param name="color">The color enum value.</param>
    /// <returns>A string representing the corresponding CSS background class.</returns>
    public static string ToBackgroundClass(this Color color)
    {
        return color switch
        {
            // Surface Colors
            Color.Surface => "bg-surface dark:bg-surfaceDark",
            Color.OnSurface => "bg-onSurface dark:bg-onSurfaceDark",
            Color.OnSurfaceStrong => "bg-onSurfaceStrong dark:bg-onSurfaceStrongDark",
            Color.SurfaceAlt => "bg-surfaceAlt dark:bg-surfaceAltDark",
            Color.Primary => "bg-primary dark:bg-primaryDark",
            Color.OnPrimary => "bg-onPrimary dark:bg-onPrimaryDark",
            Color.Secondary => "bg-secondary dark:bg-secondaryDark",
            Color.OnSecondary => "bg-onSecondary dark:bg-onSecondaryDark",
            Color.Outline => "bg-outline dark:bg-outlineDark",
            Color.OutlineStrong => "bg-outlineStrong dark:bg-outlineStrongDark",

            // Status Colors (no dark variants)
            Color.Danger => "bg-danger",
            Color.OnDanger => "bg-onDanger",
            Color.Info => "bg-info",
            Color.OnInfo => "bg-onInfo",
            Color.Warning => "bg-warning",
            Color.OnWarning => "bg-onWarning",
            Color.Success => "bg-success",
            Color.OnSuccess => "bg-onSuccess",

            _ => "bg-surface dark:bg-surfaceDark"
        };
    }


}
