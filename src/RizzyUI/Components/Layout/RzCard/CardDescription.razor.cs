
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Represents a subtitle within an <see cref="CardHeader" />. Typically renders as an H4 element.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class CardDescription : RzComponent
{
    /// <summary> The text or content to be rendered as the card subtitle. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "p"; // Default element for a subtitle
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.CardDescription.Subtitle);
    }
}