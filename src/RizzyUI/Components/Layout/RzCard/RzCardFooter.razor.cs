
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Represents the footer section of an <see cref="RzCard" />.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzCardFooter : RzComponent
{
    /// <summary> The content to be rendered inside the card footer. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary> The background color for the card footer. Defaults to SurfaceAlt. </summary>
    [Parameter]
    public SemanticColor BackgroundColor { get; set; } = SemanticColor.SurfaceAlt;

    /// <summary> The text color for the card footer content. Defaults to OnSurface. </summary>
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
           : Theme.Light.SurfaceAlt.ToCssClassString("bg"); // Use theme default if None

        var textColorClass = TextColor != SemanticColor.None
            ? TextColor.ToTextClass()
            : Theme.Light.OnSurface.ToCssClassString("text"); // Use theme default if None

        return TwMerge.Merge(AdditionalAttributes,
            Theme.RzCardFooter.Footer,
            bgColorClass,
            textColorClass);
    }
}