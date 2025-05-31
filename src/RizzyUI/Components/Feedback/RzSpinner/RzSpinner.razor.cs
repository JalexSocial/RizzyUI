
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
/// Renders an SVG spinning animation to indicate loading or processing.
/// Styling (size and color) is determined by parameters and the active <see cref="RzTheme"/>.
/// </xmldoc>
public partial class RzSpinner : RzComponent
{
    /// <summary>
    /// Gets or sets the size of the spinner.
    /// Defaults to <see cref="Size.Medium"/>.
    /// </summary>
    [Parameter]
    public Size Size { get; set; } = Size.Medium;

    /// <summary>
    /// Gets or sets the semantic color of the spinner.
    /// Defaults to <see cref="SemanticColor.None"/>, which results in the theme's default 'Foreground' fill color being used.
    /// </summary>
    [Parameter]
    public SemanticColor Color { get; set; } = SemanticColor.None;

    /// <summary>
    /// Gets or sets the accessible label for the spinner, describing what is loading.
    /// Defaults to a localized "Loading...".
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        // Set default localized value if parameter is not provided
        AriaLabel ??= Localizer["RzSpinner.DefaultAriaLabel"]; // Assuming key exists in resx
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        // Ensure default is applied if parameter becomes null after initialization
        AriaLabel ??= Localizer["RzSpinner.DefaultAriaLabel"];
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        var styles = Theme.RzSpinner;
        return TwMerge.Merge(AdditionalAttributes,
            styles.SpinnerBase,          // Includes animation and default fill
            styles.GetSizeCss(Size),     // Applies size class
            styles.GetColorCss(Color)    // Applies fill color override if Color != None
        );
    }
}