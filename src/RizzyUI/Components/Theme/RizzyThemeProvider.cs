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

        builder.AddMarkupContent(1, $"<style nonce=\"{RizzyNonceProvider.InlineStyleNonce}\">{css}</style>");
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
        sb.AppendLine($"--surface: {theme.Surface.ToCssRgbString()};");
        sb.AppendLine($"--onSurface: {theme.OnSurface.ToCssRgbString()};");
        sb.AppendLine($"--onSurfaceStrong: {theme.OnSurfaceStrong.ToCssRgbString()};");
        sb.AppendLine($"--surfaceAlt: {theme.SurfaceAlt.ToCssRgbString()};");
        sb.AppendLine($"--primary: {theme.Primary.ToCssRgbString()};");
        sb.AppendLine($"--onPrimary: {theme.OnPrimary.ToCssRgbString()};");
        sb.AppendLine($"--secondary: {theme.Secondary.ToCssRgbString()};");
        sb.AppendLine($"--onSecondary: {theme.OnSecondary.ToCssRgbString()};");
        sb.AppendLine($"--outline: {theme.Outline.ToCssRgbString()};");
        sb.AppendLine($"--outlineStrong: {theme.OutlineStrong.ToCssRgbString()};");

        sb.AppendLine($"--surfaceDark: {theme.SurfaceDark.ToCssRgbString()};");
        sb.AppendLine($"--onSurfaceDark: {theme.OnSurfaceDark.ToCssRgbString()};");
        sb.AppendLine($"--onSurfaceStrongDark: {theme.OnSurfaceStrongDark.ToCssRgbString()};");
        sb.AppendLine($"--surfaceAltDark: {theme.SurfaceAltDark.ToCssRgbString()};");
        sb.AppendLine($"--primaryDark: {theme.PrimaryDark.ToCssRgbString()};");
        sb.AppendLine($"--onPrimaryDark: {theme.OnPrimaryDark.ToCssRgbString()};");
        sb.AppendLine($"--secondaryDark: {theme.SecondaryDark.ToCssRgbString()};");
        sb.AppendLine($"--onSecondaryDark: {theme.OnSecondaryDark.ToCssRgbString()};");
        sb.AppendLine($"--outlineDark: {theme.OutlineDark.ToCssRgbString()};");
        sb.AppendLine($"--outlineStrongDark: {theme.OutlineStrongDark.ToCssRgbString()};");

        sb.AppendLine($"--danger: {theme.Danger.ToCssRgbString()};");
        sb.AppendLine($"--onDanger: {theme.OnDanger.ToCssRgbString()};");
        sb.AppendLine($"--info: {theme.Info.ToCssRgbString()};");
        sb.AppendLine($"--onInfo: {theme.OnInfo.ToCssRgbString()};");
        sb.AppendLine($"--warning: {theme.Warning.ToCssRgbString()};");
        sb.AppendLine($"--onWarning: {theme.OnWarning.ToCssRgbString()};");
        sb.AppendLine($"--success: {theme.Success.ToCssRgbString()};");
        sb.AppendLine($"--onSuccess: {theme.OnSuccess.ToCssRgbString()};");

        sb.AppendLine($"--borderWidth: {theme.BorderWidth};");
        sb.AppendLine($"--borderRadius: {theme.BorderRadius};");
        sb.AppendLine("}");

        return sb.ToString();
    }
}

