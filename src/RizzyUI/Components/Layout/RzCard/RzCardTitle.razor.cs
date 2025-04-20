using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Represents the main title within an <see cref="RzCardHeader" />. Typically renders as an H3 element.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzCardTitle : RzComponent
{
    /// <summary> The text or content to be rendered as the card title. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        Element = "h3"; // Default element for a title
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzCardTitle.Title);
    }
}