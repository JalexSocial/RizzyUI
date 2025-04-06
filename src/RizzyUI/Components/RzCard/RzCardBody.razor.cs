using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;
using RizzyUI.Styling;

namespace RizzyUI;

/// <xmldoc>
/// Represents the main content area of an <see cref="RzCard"/>.
/// Styling is determined by the active <see cref="RzTheme"/>.
/// </xmldoc>
public partial class RzCardBody : RzComponent
{
    [CascadingParameter] protected RzTheme? CascadedTheme { get; set; }
    [Inject] private IOptions<RizzyUIConfig>? Config { get; set; }
    protected RzTheme Theme { get; set; } = default!;

    /// <summary> The content to be rendered inside the card body. </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }
    /// <summary> The background color for the card body. Defaults to None (inherits from card). </summary>
    [Parameter] public SemanticColor BackgroundColor { get; set; } = SemanticColor.None;
    /// <summary> The text color for the card body content. Defaults to None (inherits from card). </summary>
    [Parameter] public SemanticColor TextColor { get; set; } = SemanticColor.None;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Theme = CascadedTheme ?? Config?.Value.DefaultTheme ?? RzTheme.Default;
        if (Theme == null)
            throw new InvalidOperationException($"{GetType()} requires a cascading RzTheme or a default theme configured.");
    }

    /// <inheritdoc/>
    protected override string? RootClass() =>
        TwMerge.Merge(AdditionalAttributes,
            Theme.RzCardBody.Body,
            BackgroundColor != SemanticColor.None ? BackgroundColor.ToBackgroundClass() : "", // Only apply if set
            TextColor != SemanticColor.None ? TextColor.ToTextClass() : ""); // Only apply if set
}

