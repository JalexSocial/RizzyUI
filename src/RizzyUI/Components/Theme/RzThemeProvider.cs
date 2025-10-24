
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.Extensions.Options;
using Rizzy.Htmx;
using RizzyUI.Extensions;
using System.Text;
// Required for HeadContent

namespace RizzyUI;

/// <summary>
///     A Blazor component that provides the current theme's CSS variables and initial dark mode script
///     into the document head via <see cref="HeadOutlet" />. It also cascades the resolved theme
///     to its child content. If no theme parameter is provided, it uses the default theme specified
///     in <see cref="RizzyUIConfig" /> or falls back to <see cref="RzTheme.Default" />.
/// </summary>
public class RzThemeProvider : ComponentBase
{
    [Inject] private IOptions<RizzyUIConfig>? RizzyConfig { get; set; }

    /// <summary>
    ///     NonceProvider service that provides scoped per-request nonce values to RizzyUI components.
    /// </summary>
    [Inject]
    protected IRizzyNonceProvider RizzyNonceProvider { get; set; } = default!;

    /// <summary>
    ///     Gets or sets the theme to apply. If null, defaults to the theme configured in
    ///     <see cref="RizzyUIConfig.DefaultTheme" /> or <see cref="RzTheme.Default" />.
    /// </summary>
    [Parameter]
    public RzTheme? Theme { get; set; }

    /// <summary>
    ///     Gets or sets the child content to render within the theme provider context.
    ///     The resolved theme will be cascaded to this content.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    ///     Builds the render tree for the component, injecting a &lt;style&gt; tag with CSS variables
    ///     and an initial dark mode script into the head via <see cref="HeadContent" />. It also
    ///     renders the <see cref="ChildContent" /> wrapped in a <see cref="CascadingValue{TValue}" />
    ///     providing the resolved <see cref="RzTheme" />.
    /// </summary>
    /// <param name="builder">The <see cref="RenderTreeBuilder" /> used to build the component's output.</param>
    protected override void BuildRenderTree(RenderTreeBuilder builder)
    {
        // Determine the theme to use based on priority: Parameter > Config > Default
        var actualTheme = Theme ?? RizzyConfig?.Value.DefaultTheme ?? RzTheme.Default;

        // Generate the CSS variables string
        var css = GenerateRootVariables(actualTheme);
        var nonce = RizzyNonceProvider.GetNonce(); // Get nonce once for efficiency

        // Render HeadContent to inject style and script into <head>
        builder.OpenComponent<RzHeadContent>(0);
        builder.AddAttribute(1, "ChildContent", (RenderFragment)(headBuilder =>
        {
            // Inject the style tag with theme variables
            headBuilder.AddMarkupContent(2, $"<style nonce=\"{nonce}\">{css}</style>");

            // Inject the initial dark mode script
            headBuilder.AddMarkupContent(3, $@"<script nonce=""{nonce}"">
                const storedMode = localStorage.getItem('darkMode') ?? 'auto';
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.classList.toggle('dark', storedMode === 'dark' || (storedMode === 'auto' && prefersDark));
            </script>");
        }));
        builder.CloseComponent(); // Close HeadContent

        // Render ChildContent wrapped in a CascadingValue to provide the theme
        builder.OpenComponent<CascadingValue<RzTheme>>(4); // Use specific type RzTheme
        builder.AddAttribute(5, "Value", actualTheme);
        builder.AddAttribute(6, "IsFixed", true); // Theme instance is fixed for this provider's scope
        builder.AddAttribute(7, "ChildContent", (RenderFragment)(cascadeBuilder =>
        {
            cascadeBuilder.AddContent(8, ChildContent); // Render the actual child content
        }));
        builder.CloseComponent(); // Close CascadingValue<RzTheme>
    }

    /// <summary>
    ///     Generates the CSS variable definitions for the given theme.
    /// </summary>
    /// <param name="theme">The theme to generate variables from.</param>
    /// <returns>A string containing a :root CSS block with the theme variables.</returns>
    private string GenerateRootVariables(RzTheme theme)
    {
        var sb = new StringBuilder();

        // --- Light Theme (:root) ---
        sb.AppendLine(":root {");
        // Radius from the root theme
        sb.AppendLine($"  --radius: {theme.Radius};");

        // Global theme properties
        if (theme.AdditionalProperties != null)
        {
            foreach (var kvp in theme.AdditionalProperties)
            {
                sb.AppendLine($"  --{kvp.Key.ToKebabCase()}: {kvp.Value};");
            }
        }
        // All variables from the Light variant
        AppendVariantVariables(sb, theme.Light);
        sb.AppendLine("}");

        // --- Dark Theme (.dark) ---
        sb.AppendLine();
        sb.AppendLine(".dark {");
        AppendVariantVariables(sb, theme.Dark);
        sb.AppendLine("}");

        return sb.ToString();
    }

    private void AppendVariantVariables(StringBuilder sb, RzThemeVariant variant)
    {
        // Colors
        sb.AppendLine($"  --background: {variant.Background.ToCssColorString()};");
        sb.AppendLine($"  --foreground: {variant.Foreground.ToCssColorString()};");
        sb.AppendLine($"  --card: {variant.Card.ToCssColorString()};");
        sb.AppendLine($"  --card-foreground: {variant.CardForeground.ToCssColorString()};");
        sb.AppendLine($"  --popover: {variant.Popover.ToCssColorString()};");
        sb.AppendLine($"  --popover-foreground: {variant.PopoverForeground.ToCssColorString()};");
        sb.AppendLine($"  --primary: {variant.Primary.ToCssColorString()};");
        sb.AppendLine($"  --primary-foreground: {variant.PrimaryForeground.ToCssColorString()};");
        sb.AppendLine($"  --secondary: {variant.Secondary.ToCssColorString()};");
        sb.AppendLine($"  --secondary-foreground: {variant.SecondaryForeground.ToCssColorString()};");
        sb.AppendLine($"  --muted: {variant.Muted.ToCssColorString()};");
        sb.AppendLine($"  --muted-foreground: {variant.MutedForeground.ToCssColorString()};");
        sb.AppendLine($"  --accent: {variant.Accent.ToCssColorString()};");
        sb.AppendLine($"  --accent-foreground: {variant.AccentForeground.ToCssColorString()};");
        sb.AppendLine($"  --destructive: {variant.Destructive.ToCssColorString()};");
        sb.AppendLine($"  --destructive-foreground: {variant.DestructiveForeground.ToCssColorString()};");
        sb.AppendLine($"  --border: {variant.Border.ToCssColorString()};");
        sb.AppendLine($"  --input: {variant.Input.ToCssColorString()};");
        sb.AppendLine($"  --ring: {variant.Ring.ToCssColorString()};");

        // Chart Colors
        sb.AppendLine($"  --chart-1: {variant.Chart1.ToCssColorString()};");
        sb.AppendLine($"  --chart-2: {variant.Chart2.ToCssColorString()};");
        sb.AppendLine($"  --chart-3: {variant.Chart3.ToCssColorString()};");
        sb.AppendLine($"  --chart-4: {variant.Chart4.ToCssColorString()};");
        sb.AppendLine($"  --chart-5: {variant.Chart5.ToCssColorString()};");

        // Sidebar Colors
        sb.AppendLine($"  --sidebar: {variant.Sidebar.ToCssColorString()};");
        sb.AppendLine($"  --sidebar-foreground: {variant.SidebarForeground.ToCssColorString()};");
        sb.AppendLine($"  --sidebar-primary: {variant.SidebarPrimary.ToCssColorString()};");
        sb.AppendLine($"  --sidebar-primary-foreground: {variant.SidebarPrimaryForeground.ToCssColorString()};");
        sb.AppendLine($"  --sidebar-accent: {variant.SidebarAccent.ToCssColorString()};");
        sb.AppendLine($"  --sidebar-accent-foreground: {variant.SidebarAccentForeground.ToCssColorString()};");
        sb.AppendLine($"  --sidebar-border: {variant.SidebarBorder.ToCssColorString()};");
        sb.AppendLine($"  --sidebar-ring: {variant.SidebarRing.ToCssColorString()};");

        // Status Colors
        sb.AppendLine($"  --info: {variant.Info.ToCssColorString()};");
        sb.AppendLine($"  --info-foreground: {variant.InfoForeground.ToCssColorString()};");
        sb.AppendLine($"  --warning: {variant.Warning.ToCssColorString()};");
        sb.AppendLine($"  --warning-foreground: {variant.WarningForeground.ToCssColorString()};");
        sb.AppendLine($"  --success: {variant.Success.ToCssColorString()};");
        sb.AppendLine($"  --success-foreground: {variant.SuccessForeground.ToCssColorString()};");

        // Fonts
        sb.AppendLine($"  --font-sans: {variant.FontSans};");
        sb.AppendLine($"  --font-serif: {variant.FontSerif};");
        sb.AppendLine($"  --font-mono: {variant.FontMono};");

        // Radius (from variant)
        sb.AppendLine($"  --radius: {variant.Radius};");

        // Shadows
        sb.AppendLine($"  --shadow-2xs: {variant.Shadow2Xs};");
        sb.AppendLine($"  --shadow-xs: {variant.ShadowXs};");
        sb.AppendLine($"  --shadow-sm: {variant.ShadowSm};");
        sb.AppendLine($"  --shadow: {variant.Shadow};");
        sb.AppendLine($"  --shadow-md: {variant.ShadowMd};");
        sb.AppendLine($"  --shadow-lg: {variant.ShadowLg};");
        sb.AppendLine($"  --shadow-xl: {variant.ShadowXl};");
        sb.AppendLine($"  --shadow-2xl: {variant.Shadow2Xl};");

        // Additional Properties from the variant (e.g., letter-spacing, spacing)
        if (variant.AdditionalProperties != null)
        {
            foreach (var kvp in variant.AdditionalProperties)
            {
                sb.AppendLine($"  --{kvp.Key}: {kvp.Value};");
            }
        }
    }
}