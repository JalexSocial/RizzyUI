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
        sb.AppendLine($"--color-surface: {theme.Surface.ToCssString()};");
        sb.AppendLine($"--color-onSurface: {theme.OnSurface.ToCssString()};");
        sb.AppendLine($"--color-onSurfaceStrong: {theme.OnSurfaceStrong.ToCssString()};");
        sb.AppendLine($"--color-surfaceAlt: {theme.SurfaceAlt.ToCssString()};");
        sb.AppendLine($"--color-primary: {theme.Primary.ToCssString()};");
        sb.AppendLine($"--color-onPrimary: {theme.OnPrimary.ToCssString()};");
        sb.AppendLine($"--color-secondary: {theme.Secondary.ToCssString()};");
        sb.AppendLine($"--color-onSecondary: {theme.OnSecondary.ToCssString()};");
        sb.AppendLine($"--color-outline: {theme.Outline.ToCssString()};");
        sb.AppendLine($"--color-outlineStrong: {theme.OutlineStrong.ToCssString()};");

        sb.AppendLine($"--color-surfaceDark: {theme.SurfaceDark.ToCssString()};");
        sb.AppendLine($"--color-onSurfaceDark: {theme.OnSurfaceDark.ToCssString()};");
        sb.AppendLine($"--color-onSurfaceStrongDark: {theme.OnSurfaceStrongDark.ToCssString()};");
        sb.AppendLine($"--color-surfaceAltDark: {theme.SurfaceAltDark.ToCssString()};");
        sb.AppendLine($"--color-primaryDark: {theme.PrimaryDark.ToCssString()};");
        sb.AppendLine($"--color-onPrimaryDark: {theme.OnPrimaryDark.ToCssString()};");
        sb.AppendLine($"--color-secondaryDark: {theme.SecondaryDark.ToCssString()};");
        sb.AppendLine($"--color-onSecondaryDark: {theme.OnSecondaryDark.ToCssString()};");
        sb.AppendLine($"--color-outlineDark: {theme.OutlineDark.ToCssString()};");
        sb.AppendLine($"--color-outlineStrongDark: {theme.OutlineStrongDark.ToCssString()};");

        sb.AppendLine($"--color-danger: {theme.Danger.ToCssString()};");
        sb.AppendLine($"--color-onDanger: {theme.OnDanger.ToCssString()};");
        sb.AppendLine($"--color-info: {theme.Info.ToCssString()};");
        sb.AppendLine($"--color-onInfo: {theme.OnInfo.ToCssString()};");
        sb.AppendLine($"--color-warning: {theme.Warning.ToCssString()};");
        sb.AppendLine($"--color-onWarning: {theme.OnWarning.ToCssString()};");
        sb.AppendLine($"--color-success: {theme.Success.ToCssString()};");
        sb.AppendLine($"--color-onSuccess: {theme.OnSuccess.ToCssString()};");

        sb.AppendLine($"--borderWidth: {theme.BorderWidth};");
        sb.AppendLine($"--borderRadius: {theme.BorderRadius};");
        sb.AppendLine("}");

        return sb.ToString();
    }
}

