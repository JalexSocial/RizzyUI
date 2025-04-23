
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Represents a search button styled consistently with the application's theme,
///     displaying a search icon and a configurable text label.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzSearchButton : RzComponent
{
    // Theme is inherited from RzComponent

    /// <summary> Gets or sets the text label displayed on the button and used for the aria-label. Defaults to "Search". </summary>
    [Parameter] public string Label { get; set; } = "Search";

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzSearchButton.Button);
    }
}