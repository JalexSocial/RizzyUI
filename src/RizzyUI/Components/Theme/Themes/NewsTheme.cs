namespace RizzyUI;

/// <summary>
/// Represents the News theme for the application. Inherits from <see cref="RizzyTheme"/>.
/// Initializes the theme using the specified Tailwind color palette.
/// </summary>
public class NewsTheme : RizzyTheme
{
    /// <summary>
    /// Initializes a new instance of the <see cref="NewsTheme"/> class with predefined news-oriented values.
    /// </summary>
    public NewsTheme() : base("News", "news")
    {
        // Light mode colors
        Surface = Colors.Zinc.L50;                      // zinc-50: (250, 250, 249)
        OnSurface = Colors.Neutral.L600;                // neutral-600: (75, 85, 99)
        OnSurfaceStrong = Colors.Neutral.L900;          // neutral-900: (17, 24, 39)
        SurfaceAlt = Colors.Zinc.L100;                   // zinc-100: (244, 244, 245)
        Primary = Colors.Sky.L700;                       // sky-700: (14, 165, 233)
        OnPrimary = Colors.White;                        // white: (255, 255, 255)
        Secondary = Colors.Black;                        // black: (0, 0, 0)
        OnSecondary = Colors.White;                      // white: (255, 255, 255)
        Outline = Colors.Zinc.L300;                       // zinc-300: (209, 213, 219)
        OutlineStrong = Colors.Zinc.L500;                 // zinc-500: (113, 113, 122)

        // Dark mode colors
        SurfaceDark = Colors.Zinc.L900;                   // zinc-900: (15, 23, 42)
        OnSurfaceDark = Colors.Zinc.L200;                 // zinc-200: (229, 231, 235)
        OnSurfaceStrongDark = Colors.Zinc.L50;            // zinc-50: (250, 250, 249)
        SurfaceAltDark = Colors.Zinc.L800;                // zinc-800: (31, 41, 55)
        PrimaryDark = Colors.Sky.L600;                    // sky-600: (8, 51, 68)
        OnPrimaryDark = Colors.White;                     // white: (255, 255, 255)
        SecondaryDark = Colors.White;                     // white: (255, 255, 255)
        OnSecondaryDark = Colors.Black;                   // black: (0, 0, 0)
        OutlineDark = Colors.Zinc.L700;                   // zinc-700: (38, 38, 38)
        OutlineStrongDark = Colors.Zinc.L500;             // zinc-500: (113, 113, 122)

        // Shared Colors
        Danger = Colors.Red.L700;                          // red-700: (185, 28, 28)
        OnDanger = Colors.Slate.L100;                      // slate-100: (245, 245, 245)
        Info = Colors.Sky.L700;                            // sky-700: (14, 165, 233)
        OnInfo = Colors.Slate.L100;                        // slate-100: (245, 245, 245)
        Warning = Colors.Amber.L600;                       // amber-600: (217, 119, 6)
        OnWarning = Colors.Amber.L50;                      // amber-50: (255, 251, 235)
        Success = Colors.Green.L700;                        // green-700: (34, 197, 94)
        OnSuccess = Colors.White;                           // white: (255, 255, 255)

        // Borders and Radius
        BorderWidth = "1px";
        BorderRadius = "6px";
    }
}
