
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Renders a paragraph (<c>p</c>) element typically used to provide help text or descriptions
///     for a form field within an <see cref="RzField" />.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzFieldHelp : RzComponent
{
    /// <summary> The help text or other content to be rendered. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzFieldHelp.HelpText);
    }
}