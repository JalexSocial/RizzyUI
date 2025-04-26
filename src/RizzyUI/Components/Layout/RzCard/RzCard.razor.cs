
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     A flexible container component for displaying content in a card format.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzCard : RzComponent
{
    /// <summary> The content to be rendered inside the card. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary> The background color for the card. Defaults to Surface. </summary>
    [Parameter]
    public SemanticColor BackgroundColor { get; set; } = SemanticColor.Surface;

    /// <summary> The text color for the card content. Defaults to OnSurface. </summary>
    [Parameter]
    public SemanticColor TextColor { get; set; } = SemanticColor.OnSurface;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "div";
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        var bgColorClass = BackgroundColor != SemanticColor.None
            ? BackgroundColor.ToBackgroundClass()
            : Theme.Light.Surface.ToCssClassString("bg"); // Use theme default if None

        var textColorClass = TextColor != SemanticColor.None
            ? TextColor.ToTextClass()
            : Theme.Light.OnSurface.ToCssClassString("text"); // Use theme default if None

        return TwMerge.Merge(AdditionalAttributes,
            Theme.RzCard.Container,
            bgColorClass,
            textColorClass);
    }
}