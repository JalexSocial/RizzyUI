namespace RizzyUI;

/// <summary>
/// Represents the High Contrast theme for the application. Inherits from <see cref="RizzyTheme"/>.
/// Initializes the theme using the specified Tailwind color palette.
/// </summary>
public class HighContrastTheme : RizzyTheme
{
    /// <summary>
    /// Initializes a new instance of the <see cref="HighContrastTheme"/> class with predefined high-contrast values.
    /// </summary>
    public HighContrastTheme() : base("High Contrast", "highcontrast")
    {
        // Light mode colors
        Surface = Colors.Gray.L50;                  // gray-50: (249, 250, 251)
        OnSurface = Colors.Gray.L800;               // gray-800: (31, 41, 55)
        OnSurfaceStrong = Colors.Gray.L950;         // gray-950: (10, 10, 10)
        OnSurfaceMuted = Colors.Neutral.L500;
        SurfaceAlt = Colors.Gray.L200;              // gray-200: (229, 231, 235)
        Primary = Colors.Sky.L900;                  // sky-900: (8, 51, 68)
        OnPrimary = Colors.White;                   // white: (255, 255, 255)
        Secondary = Colors.Indigo.L900;             // indigo-900: (17, 24, 39)
        OnSecondary = Colors.White;                 // white: (255, 255, 255)
        Outline = Colors.Gray.L500;                 // gray-500: (107, 114, 128)
        OutlineStrong = Colors.Gray.L900;           // gray-900: (17, 24, 39)

        // Dark mode colors
        SurfaceDark = Colors.Gray.L900;             // gray-900: (17, 24, 39)
        OnSurfaceDark = Colors.Gray.L300;           // gray-300: (209, 213, 219)
        OnSurfaceDarkStrong = Colors.Gray.L100;     // gray-100: (245, 245, 245)
        OnSurfaceDarkMuted = Colors.Neutral.L500;
        SurfaceAltDark = Colors.Gray.L800;          // gray-800: (31, 41, 55)
        PrimaryDark = Colors.Sky.L400;              // sky-400: (14, 165, 233)
        OnPrimaryDark = Colors.Black;               // black: (0, 0, 0)
        SecondaryDark = Colors.Indigo.L400;         // indigo-400: (147, 51, 234)
        OnSecondaryDark = Colors.Black;             // black: (0, 0, 0)
        OutlineDark = Colors.Gray.L500;             // gray-500: (107, 114, 128)
        OutlineDarkStrong = Colors.Gray.L300;       // gray-300: (209, 213, 219)

        // Shared Colors
        Danger = Colors.Red.L500;                    // red-500: (239, 68, 68)
        OnDanger = Colors.Black;                     // black: (0, 0, 0)
        Info = Colors.Sky.L500;                      // sky-500: (14, 165, 233)
        OnInfo = Colors.Black;                       // black: (0, 0, 0)
        Warning = Colors.Yellow.L500;                // yellow-500: (234, 179, 8)
        OnWarning = Colors.Black;                    // black: (0, 0, 0)
        Success = Colors.Green.L500;                 // green-500: (34, 197, 94)
        OnSuccess = Colors.Black;                    // black: (0, 0, 0)

        // Borders and Radius
        BorderWidth = "1px";
        BorderRadius = "6px";
    }
}
