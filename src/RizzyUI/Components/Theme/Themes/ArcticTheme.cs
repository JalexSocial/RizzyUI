namespace RizzyUI;

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
            Background = Colors.White, // White
            Foreground = Colors.Slate.L700, // Black
            Card = Colors.Slate.L100,
            CardForeground = Colors.Slate.L800, 
            MutedForeground = Colors.Neutral.L500,
            Accent = Colors.Slate.L200,
            AccentForeground = Colors.Slate.L600,
            Primary = Colors.Blue.L700, // #1D4ED8 (29,78,216)
            PrimaryForeground = Colors.Slate.L100, // #F1F5F9
            Secondary = Colors.Indigo.L700, // #4338CA (67,56,202)
            SecondaryForeground = Colors.Slate.L100, // #F1F5F9
            Border = Colors.Slate.L300, // #1E293B (30,41,59)
            
            // Status colors
            Danger = Colors.Red.L600, // #DC2626 (220,38,38)
            DangerForeground = Colors.White, // white
            Info = Colors.Sky.L600, // #0284C7 (2,132,199)
            InfoForeground = Colors.White, // white
            Warning = Colors.Amber.L500, // #F59E0B (245,158,11)
            WarningForeground = Colors.White, // #FFFFFF
            Success = Colors.Green.L600, // #16A34A (22,163,74)
            SuccessForeground = Colors.White, // #FFFFFF
            
            Code = CodeThemes.Github
        };

        // Dark mode colors
        Dark = new RzThemeVariant
        {
            Background = Colors.Slate.L900, // #0F172A (15,23,42)
            Foreground = Colors.Slate.L300, // White
            MutedForeground = Colors.Neutral.L500,
            Card = Colors.Slate.L800,
            Accent = Colors.Slate.L700,
            AccentForeground = Colors.Slate.L300,
            Primary = Colors.Blue.L600, // #2563EB (37,99,235)
            PrimaryForeground = Colors.Slate.L100, // #F1F5F9
            Secondary = Colors.Indigo.L600, // #4F46E5 (79,70,229)
            SecondaryForeground = Colors.Slate.L100, // #F1F5F9
            Border = Colors.Slate.L700, // #CBD5E1 (203,213,225)
            
            // Status colors
            Danger = Colors.Red.L600, // #DC2626 (220,38,38)
            DangerForeground = Colors.White, // white
            Info = Colors.Sky.L600, // #0284C7 (2,132,199)
            InfoForeground = Colors.White, // white
            Warning = Colors.Amber.L500, // #F59E0B (245,158,11)
            WarningForeground = Colors.White, // #FFFFFF
            Success = Colors.Green.L600, // #16A34A (22,163,74)
            SuccessForeground = Colors.White, // #FFFFFF
            
            Code = CodeThemes.DefaultDark
        };

        // Borders and radius
        BorderWidth = "1px";
        BorderRadius = "6px";
    }
}