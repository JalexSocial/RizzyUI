
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

    /// <summary>
    /// Gets or sets the text label displayed on the button and used for the aria-label.
    /// Defaults to a localized "Search" value.
    /// </summary>
    [Parameter] public string? Label { get; set; }

     /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Label ??= Localizer["RzSearchButton.DefaultLabel"];
        
        if (string.IsNullOrEmpty(Element))
            Element = "button"; // Set the root element tag
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        // Ensure default is applied if parameter becomes null after initialization
        Label ??= Localizer["RzSearchButton.DefaultLabel"];
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzSearchButton.Button);
    }
}