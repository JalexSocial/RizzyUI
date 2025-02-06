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
        sb.AppendLine($"--color-surface: {theme.Surface.ToCssColorString()};");
        sb.AppendLine($"--color-on-surface: {theme.OnSurface.ToCssColorString()};");
        sb.AppendLine($"--color-on-surface-strong: {theme.OnSurfaceStrong.ToCssColorString()};");
        sb.AppendLine($"--color-on-surface-muted: {theme.OnSurfaceMuted.ToCssColorString()};");
        sb.AppendLine($"--color-surface-alt: {theme.SurfaceAlt.ToCssColorString()};");
        sb.AppendLine($"--color-primary: {theme.Primary.ToCssColorString()};");
        sb.AppendLine($"--color-on-primary: {theme.OnPrimary.ToCssColorString()};");
        sb.AppendLine($"--color-secondary: {theme.Secondary.ToCssColorString()};");
        sb.AppendLine($"--color-on-secondary: {theme.OnSecondary.ToCssColorString()};");
        sb.AppendLine($"--color-outline: {theme.Outline.ToCssColorString()};");
        sb.AppendLine($"--color-outline-strong: {theme.OutlineStrong.ToCssColorString()};");

        sb.AppendLine($"--color-surface-dark: {theme.SurfaceDark.ToCssColorString()};");
        sb.AppendLine($"--color-on-surface-dark: {theme.OnSurfaceDark.ToCssColorString()};");
        sb.AppendLine($"--color-on-surface-dark-strong: {theme.OnSurfaceDarkStrong.ToCssColorString()};");
        sb.AppendLine($"--color-on-surface-dark-muted: {theme.OnSurfaceDarkMuted.ToCssColorString()};");
        sb.AppendLine($"--color-surface-dark-alt: {theme.SurfaceAltDark.ToCssColorString()};");
        sb.AppendLine($"--color-primary-dark: {theme.PrimaryDark.ToCssColorString()};");
        sb.AppendLine($"--color-on-primary-dark: {theme.OnPrimaryDark.ToCssColorString()};");
        sb.AppendLine($"--color-secondary-dark: {theme.SecondaryDark.ToCssColorString()};");
        sb.AppendLine($"--color-on-secondary-dark: {theme.OnSecondaryDark.ToCssColorString()};");
        sb.AppendLine($"--color-outline-dark: {theme.OutlineDark.ToCssColorString()};");
        sb.AppendLine($"--color-outline-dark-strong: {theme.OutlineDarkStrong.ToCssColorString()};");

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
        sb.AppendLine("}");

        return sb.ToString();
    }
}

