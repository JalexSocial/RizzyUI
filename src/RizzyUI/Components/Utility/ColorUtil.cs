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

}
