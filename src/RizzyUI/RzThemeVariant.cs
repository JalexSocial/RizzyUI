#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.

namespace RizzyUI;

/// <summary>
///     Defines a color theme variant (e.g., light or dark) with properties mapping to CSS custom properties.
/// </summary>
public class RzThemeVariant
{
    /// <summary>General page background color (maps to --background).</summary>
    public Color Background { get; init; }

    /// <summary>General page foreground/text color (maps to --foreground).</summary>
    public Color Foreground { get; init; }

    /// <summary>Background color for card components (maps to --card).</summary>
    public Color Card { get; init; }

    /// <summary>Foreground/text color for content on card components (maps to --card-foreground).</summary>
    public Color CardForeground { get; init; }

    /// <summary>Background color for popover components (maps to --popover).</summary>
    public Color Popover { get; init; }

    /// <summary>Foreground/text color for content on popover components (maps to --popover-foreground).</summary>
    public Color PopoverForeground { get; init; }

    /// <summary>Primary accent color (maps to --primary).</summary>
    public Color Primary { get; init; }

    /// <summary>Foreground/text color for content on primary-colored elements (maps to --primary-foreground).</summary>
    public Color PrimaryForeground { get; init; }

    /// <summary>Secondary accent color (maps to --secondary).</summary>
    public Color Secondary { get; init; }

    /// <summary>Foreground/text color for content on secondary-colored elements (maps to --secondary-foreground).</summary>
    public Color SecondaryForeground { get; init; }

    /// <summary>Color for muted surfaces or backgrounds (maps to --muted).</summary>
    public Color Muted { get; init; }

    /// <summary>Foreground/text color for content on muted surfaces (maps to --muted-foreground).</summary>
    public Color MutedForeground { get; init; }

    /// <summary>Color for accented surfaces or backgrounds (maps to --accent).</summary>
    public Color Accent { get; init; }

    /// <summary>Foreground/text color for content on accented surfaces (maps to --accent-foreground).</summary>
    public Color AccentForeground { get; init; }

    /// <summary>Color for destructive actions or elements (maps to --destructive).</summary>
    public Color Destructive { get; init; }

    /// <summary>Foreground/text color for content on destructive-colored elements (maps to --destructive-foreground).</summary>
    public Color DestructiveForeground { get; init; }

    /// <summary>Color for borders (maps to --border).</summary>
    public Color Border { get; init; }

    /// <summary>Color for input backgrounds or borders (maps to --input).</summary>
    public Color Input { get; init; }

    /// <summary>Color for focus rings (maps to --ring).</summary>
    public Color Ring { get; init; }

    /// <summary>Color for the first series in a chart (maps to --chart-1).</summary>
    public Color Chart1 { get; init; }

    /// <summary>Color for the second series in a chart (maps to --chart-2).</summary>
    public Color Chart2 { get; init; }

    /// <summary>Color for the third series in a chart (maps to --chart-3).</summary>
    public Color Chart3 { get; init; }

    /// <summary>Color for the fourth series in a chart (maps to --chart-4).</summary>
    public Color Chart4 { get; init; }

    /// <summary>Color for the fifth series in a chart (maps to --chart-5).</summary>
    public Color Chart5 { get; init; }

    /// <summary>Background color for the sidebar (maps to --sidebar).</summary>
    public Color Sidebar { get; init; }

    /// <summary>Foreground/text color for content in the sidebar (maps to --sidebar-foreground).</summary>
    public Color SidebarForeground { get; init; }

    /// <summary>Primary accent color used within the sidebar (maps to --sidebar-primary).</summary>
    public Color SidebarPrimary { get; init; }

    /// <summary>Foreground color for content on primary-accented sidebar elements (maps to --sidebar-primary-foreground).</summary>
    public Color SidebarPrimaryForeground { get; init; }

    /// <summary>Secondary accent color for sidebar elements, like hover states (maps to --sidebar-accent).</summary>
    public Color SidebarAccent { get; init; }

    /// <summary>Foreground color for content on secondary-accented sidebar elements (maps to --sidebar-accent-foreground).</summary>
    public Color SidebarAccentForeground { get; init; }

    /// <summary>Color for borders within the sidebar (maps to --sidebar-border).</summary>
    public Color SidebarBorder { get; init; }

    /// <summary>Color for focus rings within the sidebar (maps to --sidebar-ring).</summary>
    public Color SidebarRing { get; init; }

    /// <summary>
    ///     Gets the <see cref="Color" /> used for informational messages or states.
    /// </summary>
    public Color Info { get; init; }

    /// <summary>
    ///     Gets the <see cref="Color" /> used for text or icons placed on an <see cref="Info" /> background.
    /// </summary>
    public Color InfoForeground { get; init; }

    /// <summary>
    ///     Gets the <see cref="Color" /> used to indicate warning or cautionary states.
    /// </summary>
    public Color Warning { get; init; }

    /// <summary>
    ///     Gets the <see cref="Color" /> used for text or icons placed on a <see cref="Warning" /> background.
    /// </summary>
    public Color WarningForeground { get; init; }

    /// <summary>
    ///     Gets the <see cref="Color" /> used to indicate success or positive states.
    /// </summary>
    public Color Success { get; init; }

    /// <summary>
    ///     Gets the <see cref="Color" /> used for text or icons placed on a <see cref="Success" /> background.
    /// </summary>
    public Color SuccessForeground { get; init; }

    /// <summary>The code highlighting theme for this variant.</summary>
    public RizzyCodeTheme Code { get; init; }

    /// <summary>The sans-serif font family (maps to --font-sans).</summary>
    public string FontSans { get; init; }

    /// <summary>The serif font family (maps to --font-serif).</summary>
    public string FontSerif { get; init; }

    /// <summary>The monospace font family (maps to --font-mono).</summary>
    public string FontMono { get; init; }

    /// <summary>The base border radius value (maps to --radius).</summary>
    public string Radius { get; init; }

    /// <summary>The extra-extra-small box shadow value (maps to --shadow-2xs).</summary>
    public string Shadow2Xs { get; init; }

    /// <summary>The extra-small box shadow value (maps to --shadow-xs).</summary>
    public string ShadowXs { get; init; }

    /// <summary>The small box shadow value (maps to --shadow-sm).</summary>
    public string ShadowSm { get; init; }

    /// <summary>The default box shadow value (maps to --shadow).</summary>
    public string Shadow { get; init; }

    /// <summary>The medium box shadow value (maps to --shadow-md).</summary>
    public string ShadowMd { get; init; }

    /// <summary>The large box shadow value (maps to --shadow-lg).</summary>
    public string ShadowLg { get; init; }

    /// <summary>The extra-large box shadow value (maps to --shadow-xl).</summary>
    public string ShadowXl { get; init; }

    /// <summary>The extra-extra-large box shadow value (maps to --shadow-2xl).</summary>
    public string Shadow2Xl { get; init; }
}