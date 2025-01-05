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
            SemanticColor.Surface => "text-surface dark:text-surfaceDark",
            SemanticColor.OnSurface => "text-onSurface dark:text-onSurfaceDark",
            SemanticColor.OnSurfaceStrong => "text-onSurfaceStrong dark:text-onSurfaceStrongDark",
            SemanticColor.SurfaceAlt => "text-surfaceAlt dark:text-surfaceAltDark",
            SemanticColor.Primary => "text-primary dark:text-primaryDark",
            SemanticColor.OnPrimary => "text-onPrimary dark:text-onPrimaryDark",
            SemanticColor.Secondary => "text-secondary dark:text-secondaryDark",
            SemanticColor.OnSecondary => "text-onSecondary dark:text-onSecondaryDark",
            SemanticColor.Outline => "text-outline dark:text-outlineDark",
            SemanticColor.OutlineStrong => "text-outlineStrong dark:text-outlineStrongDark",

            // Status Colors (no dark variants)
            SemanticColor.Danger => "text-danger",
            SemanticColor.OnDanger => "text-onDanger",
            SemanticColor.Info => "text-info",
            SemanticColor.OnInfo => "text-onInfo",
            SemanticColor.Warning => "text-warning",
            SemanticColor.OnWarning => "text-onWarning",
            SemanticColor.Success => "text-success",
            SemanticColor.OnSuccess => "text-onSuccess",

            _ => "text-onSurface dark:text-onSurfaceDark"
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
		    StatusColor.Primary => "text-onPrimary dark:text-onPrimaryDark",
		    StatusColor.Danger => "text-onDanger dark:text-onDangerDark",
		    StatusColor.Info => "text-onInfo dark:text-onInfoDark",
		    StatusColor.Secondary => "text-onSecondary dark:text-onSecondaryDark",
		    StatusColor.Success => "text-onSuccess dark:text-onSuccessDark",
		    StatusColor.Warning => "text-onWarning dark:text-onWarningDark",
            _ => "text-onPrimary dark:text-onPrimaryDark"
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
            SemanticColor.Surface => "bg-surface dark:bg-surfaceDark",
            SemanticColor.OnSurface => "bg-onSurface dark:bg-onSurfaceDark",
            SemanticColor.OnSurfaceStrong => "bg-onSurfaceStrong dark:bg-onSurfaceStrongDark",
            SemanticColor.SurfaceAlt => "bg-surfaceAlt dark:bg-surfaceAltDark",
            SemanticColor.Primary => "bg-primary dark:bg-primaryDark",
            SemanticColor.OnPrimary => "bg-onPrimary dark:bg-onPrimaryDark",
            SemanticColor.Secondary => "bg-secondary dark:bg-secondaryDark",
            SemanticColor.OnSecondary => "bg-onSecondary dark:bg-onSecondaryDark",
            SemanticColor.Outline => "bg-outline dark:bg-outlineDark",
            SemanticColor.OutlineStrong => "bg-outlineStrong dark:bg-outlineStrongDark",

            // Status Colors (no dark variants)
            SemanticColor.Danger => "bg-danger",
            SemanticColor.OnDanger => "bg-onDanger",
            SemanticColor.Info => "bg-info",
            SemanticColor.OnInfo => "bg-onInfo",
            SemanticColor.Warning => "bg-warning",
            SemanticColor.OnWarning => "bg-onWarning",
            SemanticColor.Success => "bg-success",
            SemanticColor.OnSuccess => "bg-onSuccess",

            _ => "bg-surface dark:bg-surfaceDark"
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
            SemanticColor.Surface => $"{ps}bg-surface dark:{ps}bg-surfaceDark",
            SemanticColor.OnSurface => $"{ps}bg-onSurface dark:{ps}bg-onSurfaceDark",
            SemanticColor.OnSurfaceStrong => $"{ps}bg-onSurfaceStrong dark:{ps}bg-onSurfaceStrongDark",
            SemanticColor.SurfaceAlt => $"{ps}bg-surfaceAlt dark:{ps}bg-surfaceAltDark",
            SemanticColor.Primary => $"{ps}bg-primary dark:{ps}bg-primaryDark",
            SemanticColor.OnPrimary => $"{ps}bg-onPrimary dark:{ps}bg-onPrimaryDark",
            SemanticColor.Secondary => $"{ps}bg-secondary dark:{ps}bg-secondaryDark",
            SemanticColor.OnSecondary => $"{ps}bg-onSecondary dark:{ps}bg-onSecondaryDark",
            SemanticColor.Outline => $"{ps}bg-outline dark:{ps}bg-outlineDark",
            SemanticColor.OutlineStrong => $"{ps}bg-outlineStrong dark:{ps}bg-outlineStrongDark",

            // Status Colors (no dark variants)
            SemanticColor.Danger => ps + "bg-danger",
            SemanticColor.OnDanger => ps + "bg-onDanger",
            SemanticColor.Info => ps + "bg-info",
            SemanticColor.OnInfo => ps + "bg-onInfo",
            SemanticColor.Warning => ps + "bg-warning",
            SemanticColor.OnWarning => ps + "bg-onWarning",
            SemanticColor.Success => ps + "bg-success",
            SemanticColor.OnSuccess => ps + "bg-onSuccess",

            _ => "bg-surface dark:bg-surfaceDark"
        };
    }

    // ReSharper disable once UnusedMember.Local
    private static readonly string TwBackgroundClassAfterDiscovery =
        "after:bg-surface dark:after:bg-surfaceDark after:bg-onsurface dark:after:bg-onsurfaceDark after:bg-onsurfacestrong dark:after:bg-onsurfacestrongDark after:bg-surfacealt dark:after:bg-surfacealtDark after:bg-primary dark:after:bg-primaryDark after:bg-onprimary dark:after:bg-onprimaryDark after:bg-secondary dark:after:bg-secondaryDark after:bg-onsecondary dark:after:bg-onsecondaryDark after:bg-outline dark:after:bg-outlineDark after:bg-outlinestrong dark:after:bg-outlinestrongDark after:bg-danger after:bg-ondanger after:bg-info after:bg-oninfo after:bg-warning after:bg-onwarning after:bg-success after:bg-onsuccess after:bg-surface dark:after:bg-surfaceDark";

}
