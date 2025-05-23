
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Represents a subtitle within an <see cref="RzCardHeader" />. Typically renders as an H4 element.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzCardSubtitle : RzComponent
{
    /// <summary> The text or content to be rendered as the card subtitle. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "h4"; // Default element for a subtitle
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzCardSubtitle.Subtitle);
    }
}