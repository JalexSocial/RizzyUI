
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Represents the descriptive content (<c>p</c> tag by default) within an <see cref="RzAlert" /> component.
///     Provides supplementary information to the <see cref="AlertTitle" />.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class AlertDescription : RzComponent
{
    /// <summary> The descriptive content to be rendered. </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "p"; // Default to paragraph element
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.AlertDescription.Description);
    }
}