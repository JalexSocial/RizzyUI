
using System.Text.Json;
using System.Text.Json.Serialization;
using RizzyUI.Extensions;

namespace RizzyUI.Utility.Serialization.Converters;

/// <summary>
/// A custom JSON converter for deserializing a shadcn/ui theme JSON schema into an <see cref="RzTheme"/> object.
/// This converter uses an intermediate DTO for robust and explicit mapping of JSON properties to the RzTheme model.
/// </summary>
public class RzThemeConverter : JsonConverter<RzTheme>
{
    /// <summary>
    /// Reads and converts the JSON to type <see cref="RzTheme"/>.
    /// </summary>
    /// <param name="reader">The JSON reader.</param>
    /// <param name="typeToConvert">The type to convert.</param>
    /// <param name="options">The serializer options.</param>
    /// <returns>The deserialized <see cref="RzTheme"/> object, or null if deserialization fails.</returns>
    public override RzTheme? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var dto = JsonSerializer.Deserialize<ShadcnThemeDto>(ref reader, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (dto is null) return null;

        var themeName = dto.Name.ToTitleCase();
        var themeCode = themeName.ToKebabCase();

        var lightVariant = MapVariant(dto.CssVars.Light, dto.CssVars.Theme, isDark: false);
        var darkVariant = MapVariant(dto.CssVars.Dark, dto.CssVars.Theme, isDark: true);
        var radius = dto.CssVars.Theme.GetValueOrDefault("radius", "0.5rem");
        
        dto.CssVars.Theme.Remove("radius");

        var theme = new RzTheme(themeName, themeCode)
        {
            Light = lightVariant,
            Dark = darkVariant,
            Radius = radius,
            AdditionalProperties = dto.CssVars.Theme.Count > 0 ? new Dictionary<string, string>(dto.CssVars.Theme) : null
        };

        return theme;
    }

    /// <summary>
    /// Maps a dictionary of CSS variables from the DTO to an <see cref="RzThemeVariant"/> object.
    /// </summary>
    private static RzThemeVariant MapVariant(Dictionary<string, string> variantVars, Dictionary<string, string> globalVars, bool isDark)
    {
        string GetValue(string key, string defaultValue) => variantVars.GetValueOrDefault(key, globalVars.GetValueOrDefault(key, defaultValue));

        var variant = new RzThemeVariant
        {
            // Colors
            Background = CreateColor(variantVars, "background"),
            Foreground = CreateColor(variantVars, "foreground"),
            Card = CreateColor(variantVars, "card"),
            CardForeground = CreateColor(variantVars, "card-foreground"),
            Popover = CreateColor(variantVars, "popover"),
            PopoverForeground = CreateColor(variantVars, "popover-foreground"),
            Primary = CreateColor(variantVars, "primary"),
            PrimaryForeground = CreateColor(variantVars, "primary-foreground"),
            Secondary = CreateColor(variantVars, "secondary"),
            SecondaryForeground = CreateColor(variantVars, "secondary-foreground"),
            Muted = CreateColor(variantVars, "muted"),
            MutedForeground = CreateColor(variantVars, "muted-foreground"),
            Accent = CreateColor(variantVars, "accent"),
            AccentForeground = CreateColor(variantVars, "accent-foreground"),
            Destructive = CreateColor(variantVars, "destructive"),
            DestructiveForeground = CreateColor(variantVars, "destructive-foreground", new Color("oklch(1 0 0)", "white")),
            Border = CreateColor(variantVars, "border"),
            Input = CreateColor(variantVars, "input"),
            Ring = CreateColor(variantVars, "ring"),

            // Chart Colors
            Chart1 = CreateColor(variantVars, "chart-1"),
            Chart2 = CreateColor(variantVars, "chart-2"),
            Chart3 = CreateColor(variantVars, "chart-3"),
            Chart4 = CreateColor(variantVars, "chart-4"),
            Chart5 = CreateColor(variantVars, "chart-5"),

            // Sidebar Colors
            Sidebar = CreateColor(variantVars, "sidebar", CreateColor(variantVars, "background")),
            SidebarForeground = CreateColor(variantVars, "sidebar-foreground", CreateColor(variantVars, "foreground")),
            SidebarPrimary = CreateColor(variantVars, "sidebar-primary", CreateColor(variantVars, "primary")),
            SidebarPrimaryForeground = CreateColor(variantVars, "sidebar-primary-foreground", CreateColor(variantVars, "primary-foreground")),
            SidebarAccent = CreateColor(variantVars, "sidebar-accent", CreateColor(variantVars, "accent")),
            SidebarAccentForeground = CreateColor(variantVars, "sidebar-accent-foreground", CreateColor(variantVars, "accent-foreground")),
            SidebarBorder = CreateColor(variantVars, "sidebar-border", CreateColor(variantVars, "border")),
            SidebarRing = CreateColor(variantVars, "sidebar-ring", CreateColor(variantVars, "ring")),

            // Status Colors (with fallbacks to theme colors)
            Success = CreateColor(variantVars, "success", isDark ? Colors.Green.L500 : Colors.Green.L600),
            SuccessForeground = CreateColor(variantVars, "success-foreground", Colors.White),
            Warning = CreateColor(variantVars, "warning", isDark ? Colors.Amber.L400 : Colors.Amber.L500),
            WarningForeground = CreateColor(variantVars, "warning-foreground", Colors.Black),
            Info = CreateColor(variantVars, "info", isDark ? Colors.Sky.L500 : Colors.Sky.L600),
            InfoForeground = CreateColor(variantVars, "info-foreground", Colors.White),

            // Fonts
            FontSans = GetValue("font-sans", "sans-serif"),
            FontSerif = GetValue("font-serif", "serif"),
            FontMono = GetValue("font-mono", "monospace"),

            // Radius
            Radius = GetValue("radius", "0.5rem"),

            // Shadows
            Shadow2Xs = GetValue("shadow-2xs", "0 1px 2px 0px hsl(0 0% 0% / 0.09)"),
            ShadowXs = GetValue("shadow-xs", "0 1px 2px 0px hsl(0 0% 0% / 0.09)"),
            ShadowSm = GetValue("shadow-sm", "0 1px 2px 0px hsl(0 0% 0% / 0.18), 0 1px 2px -1px hsl(0 0% 0% / 0.18)"),
            Shadow = GetValue("shadow", "0 1px 2px 0px hsl(0 0% 0% / 0.18), 0 1px 2px -1px hsl(0 0% 0% / 0.18)"),
            ShadowMd = GetValue("shadow-md", "0 1px 2px 0px hsl(0 0% 0% / 0.18), 0 2px 4px -1px hsl(0 0% 0% / 0.18)"),
            ShadowLg = GetValue("shadow-lg", "0 1px 2px 0px hsl(0 0% 0% / 0.18), 0 4px 6px -1px hsl(0 0% 0% / 0.18)"),
            ShadowXl = GetValue("shadow-xl", "0 1px 2px 0px hsl(0 0% 0% / 0.18), 0 8px 10px -1px hsl(0 0% 0% / 0.18)"),
            Shadow2Xl = GetValue("shadow-2xl", "0 1px 2px 0px hsl(0 0% 0% / 0.45)"),

            // Code Theme
            Code = isDark ? CodeThemes.DefaultDark : CodeThemes.Github,
            AdditionalProperties = variantVars.Count > 0 ? new(variantVars) : null  // Copy the remaining CSS variables to CustomProperties
        };

        return variant;
    }

    /// <summary>
    /// Creates a <see cref="Color"/> object from the CSS variables dictionary.
    /// </summary>
    private static Color CreateColor(Dictionary<string, string> cssVars, string key, Color? fallback = null)
    {
        if (cssVars.TryGetValue(key, out var value) && !string.IsNullOrEmpty(value))
        {
            cssVars.Remove(key); // Remove the key to prevent duplication in the theme
            return new Color(value, key);
        }
        return fallback ?? new Color("transparent", "transparent");
    }

    /// <summary>
    /// Writes a specified value as JSON. This method is not implemented.
    /// </summary>
    /// <param name="writer">The JSON writer.</param>
    /// <param name="value">The value to write.</param>
    /// <param name="options">The serializer options.</param>
    /// <exception cref="NotImplementedException">Thrown because serialization of RzTheme is not supported.</exception>
    public override void Write(Utf8JsonWriter writer, RzTheme value, JsonSerializerOptions options)
    {
        throw new NotImplementedException("Serialization of RzTheme to shadcn/ui format is not supported.");
    }
}

/// <summary>
/// A Data Transfer Object (DTO) representing the top-level structure of a shadcn/ui theme JSON file.
/// </summary>
internal record ShadcnThemeDto
{
    /// <summary>
    /// Gets or sets the name of the theme.
    /// </summary>
    [JsonPropertyName("name")]
    public string Name { get; init; } = string.Empty;

    /// <summary>
    /// Gets or sets the CSS variables for the theme.
    /// </summary>
    [JsonPropertyName("cssVars")]
    public CssVarsDto CssVars { get; init; } = new();
}

/// <summary>
/// A DTO representing the `cssVars` object within a shadcn/ui theme, containing dictionaries
/// for global, light mode, and dark mode variables.
/// </summary>
internal record CssVarsDto
{
    /// <summary>
    /// Gets or sets the global theme variables.
    /// </summary>
    [JsonPropertyName("theme")]
    public Dictionary<string, string> Theme { get; init; } = new();

    /// <summary>
    /// Gets or sets the light mode theme variables.
    /// </summary>
    [JsonPropertyName("light")]
    public Dictionary<string, string> Light { get; init; } = new();

    /// <summary>
    /// Gets or sets the dark mode theme variables.
    /// </summary>
    [JsonPropertyName("dark")]
    public Dictionary<string, string> Dark { get; init; } = new();
}