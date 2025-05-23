
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Represents the header section of an <see cref="RzCard" />.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzCardHeader : RzComponent
{
    /// <summary> The content to be rendered inside the card header. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary> The background color for the card header. Defaults to SurfaceAlt. </summary>
    [Parameter]
    public SemanticColor BackgroundColor { get; set; } = SemanticColor.SurfaceAlt;

    /// <summary> The text color for the card header content. Defaults to OnSurface. </summary>
    [Parameter]
    public SemanticColor TextColor { get; set; } = SemanticColor.OnSurface;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "div"; // Often a div, but could be header semantically
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
            Theme.RzCardHeader.Header,
            bgColorClass,
            textColorClass);
    }
}