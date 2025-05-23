﻿namespace RizzyUI;

/// <summary>
///     The default theme used for the application, inheriting from <see cref="RzTheme" />.
///     Initializes the theme using the Tailwind color palette via the <see cref="Colors" /> class.
/// </summary>
public class ArcticTheme : RzTheme
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="RzTheme" /> class with predefined values.
    /// </summary>
    public ArcticTheme() : base("Arctic", "arctic")
    {
        // Light mode colors
        Light = new RzThemeVariant
        {
            Surface = Colors.White, // White
            OnSurface = Colors.Slate.L700, // #334155 (51,65,85)
            OnSurfaceStrong = Colors.Black, // Black
            OnSurfaceMuted = Colors.Neutral.L500,
            SurfaceAlt = Colors.Slate.L100, // #F1F5F9 (241,245,249)
            SurfaceTertiary = Colors.Slate.L200,
            OnSurfaceTertiary = Colors.Slate.L600,
            Primary = Colors.Blue.L700, // #1D4ED8 (29,78,216)
            OnPrimary = Colors.Slate.L100, // #F1F5F9
            Secondary = Colors.Indigo.L700, // #4338CA (67,56,202)
            OnSecondary = Colors.Slate.L100, // #F1F5F9
            Outline = Colors.Slate.L300, // #CBD5E1 (203,213,225)
            OutlineStrong = Colors.Slate.L800, // #1E293B (30,41,59)
            Code = CodeThemes.Github
        };

        // Dark mode colors
        Dark = new RzThemeVariant
        {
            Surface = Colors.Slate.L900, // #0F172A (15,23,42)
            OnSurface = Colors.Slate.L300, // #CBD5E1 (203,213,225)
            OnSurfaceStrong = Colors.White, // White
            OnSurfaceMuted = Colors.Neutral.L500,
            SurfaceAlt = Colors.Slate.L800,
            SurfaceTertiary = Colors.Slate.L700,
            OnSurfaceTertiary = Colors.Slate.L300,
            Primary = Colors.Blue.L600, // #2563EB (37,99,235)
            OnPrimary = Colors.Slate.L100, // #F1F5F9
            Secondary = Colors.Indigo.L600, // #4F46E5 (79,70,229)
            OnSecondary = Colors.Slate.L100, // #F1F5F9
            Outline = Colors.Slate.L700, // #334155 (51,65,85)
            OutlineStrong = Colors.Slate.L300, // #CBD5E1 (203,213,225)
            Code = CodeThemes.DefaultDark
        };

        // Status colors
        Danger = Colors.Red.L600; // #DC2626 (220,38,38)
        OnDanger = Colors.White; // white
        Info = Colors.Sky.L600; // #0284C7 (2,132,199)
        OnInfo = Colors.White; // white
        Warning = Colors.Amber.L500; // #F59E0B (245,158,11)
        OnWarning = Colors.White; // #FFFFFF
        Success = Colors.Green.L600; // #16A34A (22,163,74)
        OnSuccess = Colors.White; // #FFFFFF

        // Borders and radius
        BorderWidth = "1px";
        BorderRadius = "6px";
    }
}