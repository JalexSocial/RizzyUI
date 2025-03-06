namespace RizzyUI;

/// <summary>
/// Represents the Modern theme for the application. Inherits from <see cref="RizzyTheme"/>.
/// Initializes the theme using the specified Tailwind color palette.
/// </summary>
public class ModernTheme : RizzyTheme
{
    /// <summary>
    /// Initializes a new instance of the <see cref="ModernTheme"/> class with predefined modern values.
    /// </summary>
    public ModernTheme() : base("Modern", "modern")
    {
        // Light mode colors
        Light = new RizzyThemeVariant()
        {
            Surface = Colors.White, // white: (255, 255, 255)
            OnSurface = Colors.Neutral.L600, // neutral-600: (75, 85, 99)
            OnSurfaceStrong = Colors.Neutral.L900, // neutral-900: (17, 24, 39)
            OnSurfaceMuted = Colors.Neutral.L500,
            SurfaceAlt = Colors.Neutral.L50, // neutral-50: (249, 250, 251)
            SurfaceTertiary = Colors.Neutral.L800,
            OnSurfaceTertiary = Colors.Neutral.L300,
            Primary = Colors.Black, // black: (0, 0, 0)
            OnPrimary = Colors.Neutral.L100, // neutral-100: (245, 245, 245)
            Secondary = Colors.Neutral.L800, // neutral-800: (31, 41, 55)
            OnSecondary = Colors.White, // white: (255, 255, 255)
            Outline = Colors.Neutral.L300, // neutral-300: (209, 213, 219)
            OutlineStrong = Colors.Neutral.L800 // neutral-800: (31, 41, 55)
        };

        // Dark mode colors
        Dark = new RizzyThemeVariant()
        {
            Surface = Colors.Neutral.L950, // neutral-950: (7, 7, 7)
            OnSurface = Colors.Neutral.L300, // neutral-300: (209, 213, 219)
            OnSurfaceStrong = Colors.White, // white: (255, 255, 255)
            OnSurfaceMuted = Colors.Neutral.L500,
            SurfaceAlt = Colors.Neutral.L900, // neutral-900: (17, 24, 39)
            SurfaceTertiary = Colors.Neutral.L800,
            OnSurfaceTertiary = Colors.Neutral.L300,
            Primary = Colors.White, // white: (255, 255, 255)
            OnPrimary = Colors.Black, // black: (0, 0, 0)
            Secondary = Colors.Neutral.L300, // neutral-300: (209, 213, 219)
            OnSecondary = Colors.Black, // black: (0, 0, 0)
            Outline = Colors.Neutral.L700, // neutral-700: (55, 65, 81)
            OutlineStrong = Colors.Neutral.L300 // neutral-300: (209, 213, 219)
        };

        // Shared Colors
        Danger = Colors.Red.L500;                      // red-500: (239, 68, 68)
        OnDanger = Colors.White;                       // white: (255, 255, 255)
        Info = Colors.Sky.L500;                        // sky-500: (14, 165, 233)
        OnInfo = Colors.White;                         // white: (255, 255, 255)
        Warning = Colors.Amber.L500;                   // amber-500: (245, 158, 11)
        OnWarning = Colors.White;                      // white: (255, 255, 255)
        Success = Colors.Green.L500;                   // green-500: (34, 197, 94)
        OnSuccess = Colors.White;                      // white: (255, 255, 255)

        // Borders and Radius
        BorderWidth = "1px";
        BorderRadius = "6px";
    }
}