using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
/// Represents the descriptive content (<c>p</c> tag by default) within an <see cref="RzAlert"/> component.
/// Provides supplementary information to the <see cref="RzAlertTitle"/>.
/// Styling is determined by the active <see cref="RzTheme"/>.
/// </xmldoc>
public partial class RzAlertDescription : RzComponent
{
    /// <summary> The descriptive content to be rendered. </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        Element = "p"; // Default to paragraph element
    }

    /// <inheritdoc/>
    protected override string? RootClass() =>
        TwMerge.Merge(AdditionalAttributes, Theme.RzAlertDescription.Description);
}