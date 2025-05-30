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
            Popover = Colors.Slate.L50, // #F8FAFC (248,250,252)
            PopoverForeground = Colors.Slate.L800, // #1E293B (30,41,59)
            Muted = Colors.Slate.L200, 
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
            Background = Colors.White, // White
            Foreground = Colors.Slate.L700, // Black
            Card = Colors.Slate.L100,
            CardForeground = Colors.Slate.L800,
            Popover = Colors.Slate.L50, // #F8FAFC (248,250,252)
            PopoverForeground = Colors.Slate.L800, // #1E293B (30,41,59)
            Muted = Colors.Slate.L200, 
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
            
            Code = CodeThemes.DefaultDark
        };

        // Borders and radius
        BorderWidth = "1px";
        BorderRadius = "6px";
    }
}