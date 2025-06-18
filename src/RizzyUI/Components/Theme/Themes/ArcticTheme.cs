
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
        Light = new RzThemeVariant
        {
            Background = new Color("--background", "background"), // oklch(1 0 0)
            Foreground = new Color("--foreground", "foreground"), // oklch(0.145 0 0)
            Card = new Color("--card", "card"),                   // oklch(1 0 0)
            CardForeground = new Color("--card-foreground", "card-foreground"), // oklch(0.145 0 0)
            Popover = new Color("--popover", "popover"),             // oklch(1 0 0)
            PopoverForeground = new Color("--popover-foreground", "popover-foreground"), // oklch(0.145 0 0)
            Primary = new Color("--primary", "primary"),             // oklch(0.205 0 0)
            PrimaryForeground = new Color("--primary-foreground", "primary-foreground"), // oklch(0.985 0 0)
            Secondary = new Color("--secondary", "secondary"),         // oklch(0.97 0 0)
            SecondaryForeground = new Color("--secondary-foreground", "secondary-foreground"), // oklch(0.205 0 0)
            Muted = new Color("--muted", "muted"),                 // oklch(0.97 0 0)
            MutedForeground = new Color("--muted-foreground", "muted-foreground"), // oklch(0.556 0 0)
            Accent = new Color("--accent", "accent"),               // oklch(0.97 0 0)
            AccentForeground = new Color("--accent-foreground", "accent-foreground"), // oklch(0.205 0 0)
            Destructive = new Color("--destructive", "destructive"),     // oklch(0.577 0.245 27.325)
            DestructiveForeground = Colors.White, // Kitchen sink uses text-white for destructive buttons
            Border = new Color("--border", "border"),               // oklch(0.922 0 0)
            Input = new Color("--input", "input"),                 // oklch(0.922 0 0)
            Ring = new Color("--ring", "ring"),                   // oklch(0.708 0 0)

            // Status colors
            Info = new Color("--primary", "primary"), // Example: Info maps to primary
            InfoForeground = new Color("--primary-foreground", "primary-foreground"),
            Warning = Colors.Amber.L500, // Example: Warning maps to an amber color
            WarningForeground = Colors.Black, // Text for amber
            Success = Colors.Green.L600, // Example: Success maps to a green color
            SuccessForeground = Colors.White,

            Code = CodeThemes.Github // Default light code theme
        };

        Dark = new RzThemeVariant
        {
            Background = new Color("--background", "background"), // oklch(0.145 0 0)
            Foreground = new Color("--foreground", "foreground"), // oklch(0.985 0 0)
            Card = new Color("--card", "card"),                   // oklch(0.205 0 0)
            CardForeground = new Color("--card-foreground", "card-foreground"), // oklch(0.985 0 0)
            Popover = new Color("--popover", "popover"),             // oklch(0.269 0 0)
            PopoverForeground = new Color("--popover-foreground", "popover-foreground"), // oklch(0.985 0 0)
            Primary = new Color("--primary", "primary"),             // oklch(0.922 0 0)
            PrimaryForeground = new Color("--primary-foreground", "primary-foreground"), // oklch(0.205 0 0)
            Secondary = new Color("--secondary", "secondary"),         // oklch(0.269 0 0)
            SecondaryForeground = new Color("--secondary-foreground", "secondary-foreground"), // oklch(0.985 0 0)
            Muted = new Color("--muted", "muted"),                 // oklch(0.269 0 0)
            MutedForeground = new Color("--muted-foreground", "muted-foreground"), // oklch(0.708 0 0)
            Accent = new Color("--accent", "accent"),               // oklch(0.371 0 0)
            AccentForeground = new Color("--accent-foreground", "accent-foreground"), // oklch(0.985 0 0)
            Destructive = new Color("--destructive", "destructive"),     // oklch(0.704 0.191 22.216)
            DestructiveForeground = Colors.White, // Kitchen sink uses text-white for destructive buttons
            Border = new Color("--border", "border"),               // oklch(1 0 0 / 10%)
            Input = new Color("--input", "input"),                 // oklch(1 0 0 / 15%)
            Ring = new Color("--ring", "ring"),                   // oklch(0.556 0 0)

            // Status colors (dark variants)
            Info = new Color("--primary", "primary"), // Example: Info maps to primary (dark variant)
            InfoForeground = new Color("--primary-foreground", "primary-foreground"),
            Warning = Colors.Amber.L400, // Example: Darker amber for warning
            WarningForeground = Colors.Black,
            Success = Colors.Green.L500, // Example: Darker green for success
            SuccessForeground = Colors.White,
            
            Code = CodeThemes.DefaultDark // Default dark code theme
        };

        BorderWidth = "1px"; // Assumed from typical border usage
        BorderRadius = "var(--radius)"; 
    }
}