using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     A badge component for displaying labels with various styles and colors, determined by the active
///     <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzBadge : RzComponent
{
    /// <summary> Get the currently active theme via Cascading Parameter. </summary>
    [CascadingParameter]
    protected RzTheme? CascadedTheme { get; set; }

    /// <summary> Injected configuration to get the default theme as fallback. </summary>
    [Inject]
    private IOptions<RizzyUIConfig>? Config { get; set; }

    /// <summary> The effective theme being used (Cascaded or Default). </summary>
    protected RzTheme Theme { get; set; } = default!;

    /// <summary> The semantic color of the badge. Defaults to SurfaceAlt. </summary>
    [Parameter]
    public SemanticColor Color { get; set; } = SemanticColor.SurfaceAlt;

    /// <summary> When set to true, applies a softer styling to the badge. </summary>
    [Parameter]
    public bool Soft { get; set; }

    /// <summary> Optional icon to display within the badge. </summary>
    [Parameter]
    public SvgIcon? Icon { get; set; }

    /// <summary> Optional text label for the badge. Used if ChildContent is not provided. </summary>
    [Parameter]
    public string Label { get; set; } = string.Empty;

    /// <summary> Child content for the badge, allowing for text and additional elements. Overrides Label if set. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    // --- Style Properties derived from Theme ---
    /// <summary> Gets the computed CSS classes for the inner span element. </summary>
    protected string InnerSpanClass => Theme.RzBadge.InnerSpan;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Theme = CascadedTheme ?? Config?.Value.DefaultTheme ?? RzTheme.Default;
        if (Theme == null)
            throw new InvalidOperationException(
                $"{GetType()} requires a cascading RzTheme or a default theme configured.");
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        var styles = Theme.RzBadge;
        return TwMerge.Merge(AdditionalAttributes,
            styles.Badge,
            Soft ? styles.GetVariantSoftCss(Color) : styles.GetVariantCss(Color));
    }
}