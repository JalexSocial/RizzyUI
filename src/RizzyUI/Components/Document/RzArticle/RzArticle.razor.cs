
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     A layout component rendering a responsive two-column layout, typically for main article content
///     and a side navigation or information panel (<see cref="RzQuickReference" />).
///     Styling and layout details are determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzArticle : RzComponent
{
    /// <summary> Gets or sets the maximum character width of the main article content area. Defaults to Full. </summary>
    [Parameter]
    public ProseWidth ProseWidth { get; set; } = ProseWidth.Full;

    /// <summary> Gets or sets the width of the side column. Defaults to Large. </summary>
    [Parameter]
    public Size ColumnWidth { get; set; } = Size.Large;

    /// <summary> Gets or sets the content to render in the side column (e.g., QuickReference). </summary>
    [Parameter]
    public RenderFragment? SideContent { get; set; }

    /// <summary> Gets or sets the main content to render in the primary article area. Required. </summary>
    [Parameter]
    [EditorRequired]
    public required RenderFragment MainContent { get; set; }

    /// <summary>
    ///     Gets or sets a value indicating whether the side column should be fixed-positioned on larger screens.
    ///     Defaults to true.
    /// </summary>
    [Parameter]
    public bool IsSideFixed { get; set; } = true;

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzArticle.Container,
            Theme.RzArticle.GetContainerPaddingCss(ColumnWidth));
    }
}