using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;
using RizzyUI.Styling;

namespace RizzyUI;

/// <xmldoc>
/// A flexible container component for displaying content in a card format.
/// Styling is determined by the active <see cref="RzTheme"/>.
/// </xmldoc>
public partial class RzCard : RzComponent
{
    /// <summary> Get the currently active theme via Cascading Parameter. </summary>
    [CascadingParameter] protected RzTheme? CascadedTheme { get; set; }
    /// <summary> Injected configuration to get the default theme as fallback. </summary>
    [Inject] private IOptions<RizzyUIConfig>? Config { get; set; }
    /// <summary> The effective theme being used (Cascaded or Default). </summary>
    protected RzTheme Theme { get; set; } = default!;

    /// <summary> The content to be rendered inside the card. </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }
    /// <summary> The background color for the card. Defaults to Surface. </summary>
    [Parameter] public SemanticColor BackgroundColor { get; set; } = SemanticColor.Surface;
    /// <summary> The text color for the card content. Defaults to OnSurface. </summary>
    [Parameter] public SemanticColor TextColor { get; set; } = SemanticColor.OnSurface;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Theme = CascadedTheme ?? Config?.Value.DefaultTheme ?? RzTheme.Default;
        if (Theme == null)
            throw new InvalidOperationException($"{GetType()} requires a cascading RzTheme or a default theme configured.");

        this.Element = "div";
    }

    /// <inheritdoc />
    protected override string? RootClass() =>
        TwMerge.Merge(AdditionalAttributes,
            Theme.RzCard.Container,
            BackgroundColor != SemanticColor.None ? BackgroundColor.ToBackgroundClass() : Theme.Light.Surface.ToCssClassString("bg"), // Apply BG color
            TextColor != SemanticColor.None ? TextColor.ToTextClass() : Theme.Light.OnSurface.ToCssClassString("text")); // Apply Text color
}

