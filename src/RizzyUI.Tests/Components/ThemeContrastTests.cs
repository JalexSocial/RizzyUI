using System.Globalization;
using System.Text.RegularExpressions;

namespace RizzyUI.Tests.Components;

/// <summary>
/// Summit SF-078 and SF-036: every documented foreground/background pairing of the built-in themes meets
/// WCAG AA (4.5:1 for body text), in light and dark mode. Status, primary and destructive colors are also
/// checked as text on a tint of themselves, which is how soft badges and alerts draw them.
/// </summary>
public partial class ThemeContrastTests
{
    private const double Aa = 4.5;

    public static TheoryData<string> Variants() => new() { "light", "dark" };

    [Theory]
    [MemberData(nameof(Variants))]
    public void Arctic_token_pairs_meet_AA(string mode)
    {
        var theme = new ArcticTheme();
        var v = mode == "light" ? theme.Light : theme.Dark;

        var pairs = new (string Name, Color Fg, Color Bg)[]
        {
            ("foreground on background", v.Foreground!, v.Background!),
            ("card-foreground on card", v.CardForeground!, v.Card!),
            ("popover-foreground on popover", v.PopoverForeground!, v.Popover!),
            ("primary-foreground on primary", v.PrimaryForeground!, v.Primary!),
            ("primary (links) on background", v.Primary!, v.Background!),
            ("secondary-foreground on secondary", v.SecondaryForeground!, v.Secondary!),
            ("muted-foreground on background", v.MutedForeground!, v.Background!),
            ("muted-foreground on muted", v.MutedForeground!, v.Muted!),
            ("muted-foreground on card", v.MutedForeground!, v.Card!),
            ("accent-foreground on accent", v.AccentForeground!, v.Accent!),
            ("destructive-foreground on destructive", v.DestructiveForeground!, v.Destructive!),
            ("destructive (alert text) on background", v.Destructive!, v.Background!),
            ("sidebar-foreground on sidebar", v.SidebarForeground!, v.Sidebar!),
            ("sidebar-primary-foreground on sidebar-primary", v.SidebarPrimaryForeground!, v.SidebarPrimary!),
            ("sidebar-accent-foreground on sidebar-accent", v.SidebarAccentForeground!, v.SidebarAccent!),
            ("info-foreground on info", v.InfoForeground!, v.Info!),
            ("success-foreground on success", v.SuccessForeground!, v.Success!),
            ("warning-foreground on warning", v.WarningForeground!, v.Warning!),
        };

        var background = Rgb(v.Background!);
        var failures = new List<string>();
        foreach (var (name, fg, bg) in pairs)
        {
            var ratio = Contrast(Rgb(fg), Rgb(bg));
            if (ratio < Aa) failures.Add($"{name}: {ratio:0.00}");
        }

        // Soft badges and alerts: the color as text on a tint of itself.
        foreach (var (name, color) in new[] { ("info", v.Info!), ("success", v.Success!), ("warning", v.Warning!), ("primary", v.Primary!), ("destructive", v.Destructive!) })
        {
            var text = Rgb(color);
            // Light mode tints at 10% (bg-*/10), dark mode at up to 15% (dark:bg-*/15).
            var alpha = mode == "light" ? 0.10 : 0.15;
            var ratio = Contrast(text, Mix(text, background, alpha));
            if (ratio < Aa) failures.Add($"{name} on its {alpha:P0} tint: {ratio:0.00}");
        }

        Assert.True(failures.Count == 0, $"Arctic {mode}: " + string.Join("; ", failures));
    }

    [GeneratedRegex(@"oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)")]
    private static partial Regex OklchPattern();

    /// <summary>Linear sRGB of a theme color (oklch values and the white/black variables).</summary>
    private static double[] Rgb(Color color)
    {
        var css = color.ToCssColorString();
        if (css.Contains("--color-white", StringComparison.Ordinal)) return [1, 1, 1];
        if (css.Contains("--color-black", StringComparison.Ordinal)) return [0, 0, 0];
        var m = OklchPattern().Match(css);
        Assert.True(m.Success, $"Unsupported color value: {css}");
        var l = double.Parse(m.Groups[1].Value, CultureInfo.InvariantCulture);
        if (m.Groups[2].Value == "%" || l > 1) l /= 100;
        var c = double.Parse(m.Groups[3].Value, CultureInfo.InvariantCulture);
        var h = double.Parse(m.Groups[4].Value, CultureInfo.InvariantCulture) * Math.PI / 180;
        double a = c * Math.Cos(h), b = c * Math.Sin(h);
        var l_ = l + 0.3963377774 * a + 0.2158037573 * b;
        var m_ = l - 0.1055613458 * a - 0.0638541728 * b;
        var s_ = l - 0.0894841775 * a - 1.2914855480 * b;
        double L = l_ * l_ * l_, M = m_ * m_ * m_, S = s_ * s_ * s_;
        return
        [
            Math.Clamp(4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S, 0, 1),
            Math.Clamp(-1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S, 0, 1),
            Math.Clamp(-0.0041960863 * L - 0.7034186147 * M + 1.7076147010 * S, 0, 1),
        ];
    }

    private static double Luminance(double[] rgb) => 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];

    private static double Contrast(double[] a, double[] b)
    {
        double la = Luminance(a) + 0.05, lb = Luminance(b) + 0.05;
        return Math.Max(la, lb) / Math.Min(la, lb);
    }

    /// <summary>Alpha-blends <paramref name="fg"/> over <paramref name="bg"/> in gamma-encoded sRGB, as browsers do.</summary>
    private static double[] Mix(double[] fg, double[] bg, double alpha)
    {
        static double ToGamma(double v) => v <= 0.0031308 ? 12.92 * v : 1.055 * Math.Pow(v, 1 / 2.4) - 0.055;
        static double ToLinear(double v) => v <= 0.04045 ? v / 12.92 : Math.Pow((v + 0.055) / 1.055, 2.4);
        return [.. fg.Zip(bg, (f, b) => ToLinear(alpha * ToGamma(f) + (1 - alpha) * ToGamma(b)))];
    }
}
