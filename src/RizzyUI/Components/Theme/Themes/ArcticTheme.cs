namespace RizzyUI;

/// <summary>
///     The default theme used for the application, inheriting from <see cref="RzTheme" />.
///     This theme is based on the default theme provided by shadcn/ui.
/// </summary>
public class ArcticTheme : RzTheme
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="RzTheme" /> class with predefined values.
    /// </summary>
    public ArcticTheme() : base("Arctic", "arctic")
    {
        Radius = "0.375rem";

        Light = new RzThemeVariant
        {
            Background = new Color("oklch(1.0000 0 0)", "background"),
            Foreground = new Color("oklch(0.3211 0 0)", "foreground"),
            Card = new Color("oklch(1.0000 0 0)", "card"),
            CardForeground = new Color("oklch(0.3211 0 0)", "card-foreground"),
            Popover = new Color("oklch(1.0000 0 0)", "popover"),
            PopoverForeground = new Color("oklch(0.3211 0 0)", "popover-foreground"),
            Primary = new Color("oklch(0.6231 0.1880 259.8145)", "primary"),
            PrimaryForeground = new Color("oklch(1.0000 0 0)", "primary-foreground"),
            Secondary = new Color("oklch(0.9670 0.0029 264.5419)", "secondary"),
            SecondaryForeground = new Color("oklch(0.4461 0.0263 256.8018)", "secondary-foreground"),
            Muted = new Color("oklch(0.9846 0.0017 247.8389)", "muted"),
            MutedForeground = new Color("oklch(0.5510 0.0234 264.3637)", "muted-foreground"),
            Accent = new Color("oklch(0.9514 0.0250 236.8242)", "accent"),
            AccentForeground = new Color("oklch(0.3791 0.1378 265.5222)", "accent-foreground"),
            Destructive = new Color("oklch(0.6368 0.2078 25.3313)", "destructive"),
            DestructiveForeground = new Color("oklch(1.0000 0 0)", "destructive-foreground"),
            Border = new Color("oklch(0.9276 0.0058 264.5313)", "border"),
            Input = new Color("oklch(0.9276 0.0058 264.5313)", "input"),
            Ring = new Color("oklch(0.6231 0.1880 259.8145)", "ring"),
            Chart1 = new Color("oklch(0.6231 0.1880 259.8145)", "chart-1"),
            Chart2 = new Color("oklch(0.5461 0.2152 262.8809)", "chart-2"),
            Chart3 = new Color("oklch(0.4882 0.2172 264.3763)", "chart-3"),
            Chart4 = new Color("oklch(0.4244 0.1809 265.6377)", "chart-4"),
            Chart5 = new Color("oklch(0.3791 0.1378 265.5222)", "chart-5"),
            Sidebar = new Color("oklch(0.9846 0.0017 247.8389)", "sidebar"),
            SidebarForeground = new Color("oklch(0.3211 0 0)", "sidebar-foreground"),
            SidebarPrimary = new Color("oklch(0.6231 0.1880 259.8145)", "sidebar-primary"),
            SidebarPrimaryForeground = new Color("oklch(1.0000 0 0)", "sidebar-primary-foreground"),
            SidebarAccent = new Color("oklch(0.9514 0.0250 236.8242)", "sidebar-accent"),
            SidebarAccentForeground = new Color("oklch(0.3791 0.1378 265.5222)", "sidebar-accent-foreground"),
            SidebarBorder = new Color("oklch(0.9276 0.0058 264.5313)", "sidebar-border"),
            SidebarRing = new Color("oklch(0.6231 0.1880 259.8145)", "sidebar-ring"),
            FontSans = "Inter, sans-serif",
            FontSerif = "Source Serif 4, serif",
            FontMono = "JetBrains Mono, monospace",
            Radius = "0.375rem",
            Shadow2Xs = "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
            ShadowXs = "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
            ShadowSm = "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)",
            Shadow = "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)",
            ShadowMd = "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10)",
            ShadowLg = "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10)",
            ShadowXl = "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10)",
            Shadow2Xl = "0 1px 3px 0px hsl(0 0% 0% / 0.25)",
            Info = Colors.Blue.L600,
            InfoForeground = Colors.White,
            Warning = Colors.Amber.L500,
            WarningForeground = Colors.White,
            Success = Colors.Green.L600,
            SuccessForeground = Colors.White,
            Code = CodeThemes.Github
        };

        Dark = new RzThemeVariant
        {
            Background = new Color("oklch(0.2046 0 0)", "background"),
            Foreground = new Color("oklch(0.9219 0 0)", "foreground"),
            Card = new Color("oklch(0.2686 0 0)", "card"),
            CardForeground = new Color("oklch(0.9219 0 0)", "card-foreground"),
            Popover = new Color("oklch(0.2686 0 0)", "popover"),
            PopoverForeground = new Color("oklch(0.9219 0 0)", "popover-foreground"),
            Primary = new Color("oklch(0.6231 0.1880 259.8145)", "primary"),
            PrimaryForeground = new Color("oklch(1.0000 0 0)", "primary-foreground"),
            Secondary = new Color("oklch(0.2686 0 0)", "secondary"),
            SecondaryForeground = new Color("oklch(0.9219 0 0)", "secondary-foreground"),
            Muted = new Color("oklch(0.2686 0 0)", "muted"),
            MutedForeground = new Color("oklch(0.7155 0 0)", "muted-foreground"),
            Accent = new Color("oklch(0.3791 0.1378 265.5222)", "accent"),
            AccentForeground = new Color("oklch(0.8823 0.0571 254.1284)", "accent-foreground"),
            Destructive = new Color("oklch(0.6368 0.2078 25.3313)", "destructive"),
            DestructiveForeground = new Color("oklch(1.0000 0 0)", "destructive-foreground"),
            Border = new Color("oklch(0.3715 0 0)", "border"),
            Input = new Color("oklch(0.3715 0 0)", "input"),
            Ring = new Color("oklch(0.6231 0.1880 259.8145)", "ring"),
            Chart1 = new Color("oklch(0.7137 0.1434 254.6240)", "chart-1"),
            Chart2 = new Color("oklch(0.6231 0.1880 259.8145)", "chart-2"),
            Chart3 = new Color("oklch(0.5461 0.2152 262.8809)", "chart-3"),
            Chart4 = new Color("oklch(0.4882 0.2172 264.3763)", "chart-4"),
            Chart5 = new Color("oklch(0.4244 0.1809 265.6377)", "chart-5"),
            Sidebar = new Color("oklch(0.2046 0 0)", "sidebar"),
            SidebarForeground = new Color("oklch(0.9219 0 0)", "sidebar-foreground"),
            SidebarPrimary = new Color("oklch(0.6231 0.1880 259.8145)", "sidebar-primary"),
            SidebarPrimaryForeground = new Color("oklch(1.0000 0 0)", "sidebar-primary-foreground"),
            SidebarAccent = new Color("oklch(0.3791 0.1378 265.5222)", "sidebar-accent"),
            SidebarAccentForeground = new Color("oklch(0.8823 0.0571 254.1284)", "sidebar-accent-foreground"),
            SidebarBorder = new Color("oklch(0.3715 0 0)", "sidebar-border"),
            SidebarRing = new Color("oklch(0.6231 0.1880 259.8145)", "sidebar-ring"),
            FontSans = "Inter, sans-serif",
            FontSerif = "Source Serif 4, serif",
            FontMono = "JetBrains Mono, monospace",
            Radius = "0.375rem",
            Shadow2Xs = "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
            ShadowXs = "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
            ShadowSm = "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)",
            Shadow = "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)",
            ShadowMd = "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10)",
            ShadowLg = "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10)",
            ShadowXl = "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10)",
            Shadow2Xl = "0 1px 3px 0px hsl(0 0% 0% / 0.25)",
            Info = Colors.Blue.L500,
            InfoForeground = Colors.White,
            Warning = Colors.Amber.L400,
            WarningForeground = Colors.Black,
            Success = Colors.Green.L500,
            SuccessForeground = Colors.White,
            Code = CodeThemes.DefaultDark
        };
    }
}