using System.Text;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.Extensions.Options;
using Rizzy.Htmx;
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
    ///     Builds the render tree for the component, injecting a &lt;style> tag with CSS variables
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
        sb.AppendLine(":root {");

        // --- Base (Light) Variables ---
        sb.AppendLine($"--color-surface: {theme.Light.Surface.ToCssColorString()};");
        sb.AppendLine($"--color-on-surface: {theme.Light.OnSurface.ToCssColorString()};");
        sb.AppendLine($"--color-on-surface-strong: {theme.Light.OnSurfaceStrong.ToCssColorString()};");
        sb.AppendLine($"--color-on-surface-muted: {theme.Light.OnSurfaceMuted.ToCssColorString()};");
        sb.AppendLine($"--color-surface-alt: {theme.Light.SurfaceAlt.ToCssColorString()};");
        sb.AppendLine($"--color-surface-tertiary: {theme.Light.SurfaceTertiary.ToCssColorString()};");
        sb.AppendLine($"--color-on-surface-tertiary: {theme.Light.OnSurfaceTertiary.ToCssColorString()};");
        sb.AppendLine($"--color-primary: {theme.Light.Primary.ToCssColorString()};");
        sb.AppendLine($"--color-on-primary: {theme.Light.OnPrimary.ToCssColorString()};");
        sb.AppendLine($"--color-secondary: {theme.Light.Secondary.ToCssColorString()};");
        sb.AppendLine($"--color-on-secondary: {theme.Light.OnSecondary.ToCssColorString()};");
        sb.AppendLine($"--color-outline: {theme.Light.Outline.ToCssColorString()};");
        sb.AppendLine($"--color-outline-strong: {theme.Light.OutlineStrong.ToCssColorString()};");

        // --- Status Colors (Same for Light/Dark in current definition) ---
        sb.AppendLine($"--color-danger: {theme.Danger.ToCssColorString()};");
        sb.AppendLine($"--color-on-danger: {theme.OnDanger.ToCssColorString()};");
        sb.AppendLine($"--color-info: {theme.Info.ToCssColorString()};");
        sb.AppendLine($"--color-on-info: {theme.OnInfo.ToCssColorString()};"); // Consistent naming needed
        sb.AppendLine($"--color-warning: {theme.Warning.ToCssColorString()};");
        sb.AppendLine($"--color-on-warning: {theme.OnWarning.ToCssColorString()};");
        sb.AppendLine($"--color-success: {theme.Success.ToCssColorString()};");
        sb.AppendLine($"--color-on-success: {theme.OnSuccess.ToCssColorString()};");

        // --- Border Variables ---
        sb.AppendLine($"--borderWidth: {theme.BorderWidth};");
        sb.AppendLine($"--borderRadius: {theme.BorderRadius};");

        // --- Highlight.js (Light) Variables ---
        sb.AppendLine($"--highlight-bg: {theme.Light.Code.Background.ToCssColorString()};");
        sb.AppendLine($"--highlight-color: {theme.Light.Code.Color.ToCssColorString()};");
        sb.AppendLine($"--highlight-comment: {theme.Light.Code.Comment.ToCssColorString()};");
        sb.AppendLine($"--highlight-keyword: {theme.Light.Code.Keyword.ToCssColorString()};");
        sb.AppendLine($"--highlight-attribute: {theme.Light.Code.Attribute.ToCssColorString()};");
        sb.AppendLine($"--highlight-symbol: {theme.Light.Code.Symbol.ToCssColorString()};");
        sb.AppendLine($"--highlight-namespace: {theme.Light.Code.Namespace.ToCssColorString()};");
        sb.AppendLine($"--highlight-variable: {theme.Light.Code.Variable.ToCssColorString()};");
        sb.AppendLine($"--highlight-literal: {theme.Light.Code.Literal.ToCssColorString()};");
        sb.AppendLine($"--highlight-punctuation: {theme.Light.Code.Punctuation.ToCssColorString()};");
        sb.AppendLine($"--highlight-deletion: {theme.Light.Code.Deletion.ToCssColorString()};");
        sb.AppendLine($"--highlight-addition: {theme.Light.Code.Addition.ToCssColorString()};");

        // Link highlight variables to Tailwind Prose variables
        sb.AppendLine(".prose {");
        sb.AppendLine("  --tw-prose-code: var(--highlight-color);");
        sb.AppendLine("  --tw-prose-pre-code: var(--highlight-color);"); // Ensure pre code also uses it
        sb.AppendLine("  --tw-prose-pre-bg: var(--highlight-bg);");
        sb.AppendLine("}");

        // --- Dark Mode Overrides
        sb.AppendLine("&:where(.dark, .dark *) {");
        sb.AppendLine($"  --color-surface: {theme.Dark.Surface.ToCssColorString()};");
        sb.AppendLine($"  --color-on-surface: {theme.Dark.OnSurface.ToCssColorString()};");
        sb.AppendLine($"  --color-on-surface-strong: {theme.Dark.OnSurfaceStrong.ToCssColorString()};");
        sb.AppendLine($"  --color-on-surface-muted: {theme.Dark.OnSurfaceMuted.ToCssColorString()};");
        sb.AppendLine($"  --color-surface-alt: {theme.Dark.SurfaceAlt.ToCssColorString()};");
        sb.AppendLine($"  --color-surface-tertiary: {theme.Dark.SurfaceTertiary.ToCssColorString()};");
        sb.AppendLine($"  --color-on-surface-tertiary: {theme.Dark.OnSurfaceTertiary.ToCssColorString()};");
        sb.AppendLine($"  --color-primary: {theme.Dark.Primary.ToCssColorString()};");
        sb.AppendLine($"  --color-on-primary: {theme.Dark.OnPrimary.ToCssColorString()};");
        sb.AppendLine($"  --color-secondary: {theme.Dark.Secondary.ToCssColorString()};");
        sb.AppendLine($"  --color-on-secondary: {theme.Dark.OnSecondary.ToCssColorString()};");
        sb.AppendLine($"  --color-outline: {theme.Dark.Outline.ToCssColorString()};");
        sb.AppendLine($"  --color-outline-strong: {theme.Dark.OutlineStrong.ToCssColorString()};");

        // Highlight.js (Dark) Variables
        sb.AppendLine($"  --highlight-bg: {theme.Dark.Code.Background.ToCssColorString()};");
        sb.AppendLine($"  --highlight-color: {theme.Dark.Code.Color.ToCssColorString()};");
        sb.AppendLine($"  --highlight-comment: {theme.Dark.Code.Comment.ToCssColorString()};");
        sb.AppendLine($"  --highlight-keyword: {theme.Dark.Code.Keyword.ToCssColorString()};");
        sb.AppendLine($"  --highlight-attribute: {theme.Dark.Code.Attribute.ToCssColorString()};");
        sb.AppendLine($"  --highlight-symbol: {theme.Dark.Code.Symbol.ToCssColorString()};");
        sb.AppendLine($"  --highlight-namespace: {theme.Dark.Code.Namespace.ToCssColorString()};");
        sb.AppendLine($"  --highlight-variable: {theme.Dark.Code.Variable.ToCssColorString()};");
        sb.AppendLine($"  --highlight-literal: {theme.Dark.Code.Literal.ToCssColorString()};");
        sb.AppendLine($"  --highlight-punctuation: {theme.Dark.Code.Punctuation.ToCssColorString()};");
        sb.AppendLine($"  --highlight-deletion: {theme.Dark.Code.Deletion.ToCssColorString()};");
        sb.AppendLine($"  --highlight-addition: {theme.Dark.Code.Addition.ToCssColorString()};");

        // Note: Status colors (Danger, Info, etc.) don't have dark overrides in RzTheme current definition
        sb.AppendLine("}"); // Close &:where(...)
        sb.AppendLine("}"); // Close :root
        return sb.ToString();
    }
}