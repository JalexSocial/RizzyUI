namespace RizzyUI;

/// <summary>
/// The default theme used for the application, inheriting from <see cref="RizzyTheme"/>.
/// Initializes the theme using the Tailwind color palette via the <see cref="Colors"/> class.
/// </summary>
public class ArcticTheme : RizzyTheme
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultTheme"/> class with predefined values.
    /// </summary>
    public ArcticTheme() : base("Arctic", "arctic")
    {
        // Light mode colors
        Surface = Colors.White;                 // White
        OnSurface = Colors.Slate.L700;          // #334155 (51,65,85)
        OnSurfaceStrong = Colors.Black;         // Black
        SurfaceAlt = Colors.Slate.L100;         // #F1F5F9 (241,245,249)
        Primary = Colors.Blue.L700;             // #1D4ED8 (29,78,216)
        OnPrimary = Colors.Slate.L100;          // #F1F5F9
        Secondary = Colors.Indigo.L700;         // #4338CA (67,56,202)
        OnSecondary = Colors.Slate.L100;        // #F1F5F9
        Outline = Colors.Slate.L300;            // #CBD5E1 (203,213,225)
        OutlineStrong = Colors.Slate.L800;      // #1E293B (30,41,59)

        // Dark mode colors
        SurfaceDark = Colors.Slate.L900;        // #0F172A (15,23,42)
        OnSurfaceDark = Colors.Slate.L300;      // #CBD5E1 (203,213,225)
        OnSurfaceStrongDark = Colors.White;     // White
        SurfaceAltDark = Colors.Slate.L800;     // #1E293B (30,41,59)
        PrimaryDark = Colors.Blue.L600;         // #2563EB (37,99,235)
        OnPrimaryDark = Colors.Slate.L100;      // #F1F5F9
        SecondaryDark = Colors.Indigo.L600;     // #4F46E5 (79,70,229)
        OnSecondaryDark = Colors.Slate.L100;    // #F1F5F9
        OutlineDark = Colors.Slate.L700;        // #334155 (51,65,85)
        OutlineStrongDark = Colors.Slate.L300;  // #CBD5E1 (203,213,225)

        // Status colors
        Danger = Colors.Red.L600;               // #DC2626 (220,38,38)
        OnDanger = Colors.White;                // white
        Info = Colors.Sky.L600;                 // #0284C7 (2,132,199)
        OnInfo = Colors.White;                  // white
        Warning = Colors.Amber.L500;            // #F59E0B (245,158,11)
        OnWarning = Colors.White;               // #FFFFFF
        Success = Colors.Green.L600;            // #16A34A (22,163,74)
        OnSuccess = Colors.White;               // #FFFFFF

        // Borders and radius
        BorderWidth = "1px";
        BorderRadius = "6px";
    }
}