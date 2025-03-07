using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using Microsoft.AspNetCore.Components.Web;
using Rizzy.Nonce;
using System.Text;

namespace RizzyUI;

/// <summary>
/// A Blazor component that provides the current theme's CSS variables in the document head.
/// If no theme is provided, uses <see cref="RizzyTheme.Default"/>.
/// </summary>
public class RizzyThemeProvider : ComponentBase
{
    /// <summary>
    /// NonceProvider service that provides scoped per-request nonce values to RizzyUI
    /// components
    /// </summary>
    [Inject] protected IRizzyNonceProvider RizzyNonceProvider { get; set; } = default!;

    /// <summary>
    /// Gets or sets the theme to apply. If null, defaults to <see cref="RizzyTheme.Default"/>.
    /// </summary>
    [Parameter]
    public RizzyTheme? Theme { get; set; }

    /// <summary>
    /// Builds the render tree for the component, injecting a &lt;style&gt; tag with CSS variables into the head via <see cref="HeadOutlet"/>.
    /// </summary>
    /// <param name="builder">The <see cref="RenderTreeBuilder"/> used to build the component's output.</param>
    protected override void BuildRenderTree(RenderTreeBuilder builder)
    {
        var actualTheme = Theme ?? RizzyTheme.Default;
        var css = GenerateRootVariables(actualTheme);

        builder.AddMarkupContent(1, $"<style nonce=\"{RizzyNonceProvider.GetNonceFor(NonceType.Style)}\">{css}</style>");
        builder.AddMarkupContent(2, $@"<script nonce=""{RizzyNonceProvider.GetNonceFor(NonceType.Script)}"">
		    const storedMode = localStorage.getItem('darkMode') ?? 'auto';
		    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		    document.documentElement.classList.toggle('dark', storedMode === 'dark' || (storedMode === 'auto' && prefersDark));
        </script>");
    }

    /// <summary>
    /// Generates the CSS variable definitions for the given theme.
    /// </summary>
    /// <param name="theme">The theme to generate variables from.</param>
    /// <returns>A string containing a :root CSS block with the theme variables.</returns>
    private string GenerateRootVariables(RizzyTheme theme)
    {
        var sb = new StringBuilder();
        sb.AppendLine(":root {");
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
        sb.AppendLine($"--color-danger: {theme.Danger.ToCssColorString()};");
        sb.AppendLine($"--color-on-danger: {theme.OnDanger.ToCssColorString()};");
        sb.AppendLine($"--color-info: {theme.Info.ToCssColorString()};");
        sb.AppendLine($"--color-onInfo: {theme.OnInfo.ToCssColorString()};");
        sb.AppendLine($"--color-warning: {theme.Warning.ToCssColorString()};");
        sb.AppendLine($"--color-on-warning: {theme.OnWarning.ToCssColorString()};");
        sb.AppendLine($"--color-success: {theme.Success.ToCssColorString()};");
        sb.AppendLine($"--color-on-success: {theme.OnSuccess.ToCssColorString()};");
        sb.AppendLine($"--borderWidth: {theme.BorderWidth};");
        sb.AppendLine($"--borderRadius: {theme.BorderRadius};");
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
        sb.AppendLine("}");

        sb.AppendLine("&:where(.dark, .dark *) {");
        sb.AppendLine($"--color-surface: {theme.Dark.Surface.ToCssColorString()};");
        sb.AppendLine($"--color-on-surface: {theme.Dark.OnSurface.ToCssColorString()};");
        sb.AppendLine($"--color-on-surface-strong: {theme.Dark.OnSurfaceStrong.ToCssColorString()};");
        sb.AppendLine($"--color-on-surface-muted: {theme.Dark.OnSurfaceMuted.ToCssColorString()};");
        sb.AppendLine($"--color-surface-alt: {theme.Dark.SurfaceAlt.ToCssColorString()};");
        sb.AppendLine($"--color-surface-tertiary: {theme.Dark.SurfaceTertiary.ToCssColorString()};");
        sb.AppendLine($"--color-on-surface-tertiary: {theme.Dark.OnSurfaceTertiary.ToCssColorString()};");
        sb.AppendLine($"--color-primary: {theme.Dark.Primary.ToCssColorString()};");
        sb.AppendLine($"--color-on-primary: {theme.Dark.OnPrimary.ToCssColorString()};");
        sb.AppendLine($"--color-secondary: {theme.Dark.Secondary.ToCssColorString()};");
        sb.AppendLine($"--color-on-secondary: {theme.Dark.OnSecondary.ToCssColorString()};");
        sb.AppendLine($"--color-outline: {theme.Dark.Outline.ToCssColorString()};");
        sb.AppendLine($"--color-outline-strong: {theme.Dark.OutlineStrong.ToCssColorString()};");
        sb.AppendLine($"--highlight-bg: {theme.Dark.Code.Background.ToCssColorString()};");
        sb.AppendLine($"--highlight-color: {theme.Dark.Code.Color.ToCssColorString()};");
        sb.AppendLine($"--highlight-comment: {theme.Dark.Code.Comment.ToCssColorString()};");
        sb.AppendLine($"--highlight-keyword: {theme.Dark.Code.Keyword.ToCssColorString()};");
        sb.AppendLine($"--highlight-attribute: {theme.Dark.Code.Attribute.ToCssColorString()};");
        sb.AppendLine($"--highlight-symbol: {theme.Dark.Code.Symbol.ToCssColorString()};");
        sb.AppendLine($"--highlight-namespace: {theme.Dark.Code.Namespace.ToCssColorString()};");
        sb.AppendLine($"--highlight-variable: {theme.Dark.Code.Variable.ToCssColorString()};");
        sb.AppendLine($"--highlight-literal: {theme.Dark.Code.Literal.ToCssColorString()};");
        sb.AppendLine($"--highlight-punctuation: {theme.Dark.Code.Punctuation.ToCssColorString()};");
        sb.AppendLine($"--highlight-deletion: {theme.Dark.Code.Deletion.ToCssColorString()};");
        sb.AppendLine($"--highlight-addition: {theme.Dark.Code.Addition.ToCssColorString()};");
        sb.AppendLine("}");

        return sb.ToString();
    }
}

