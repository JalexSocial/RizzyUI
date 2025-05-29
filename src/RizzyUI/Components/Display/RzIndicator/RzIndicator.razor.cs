
// src/RizzyUI/Components/Display/RzIndicator/RzIndicator.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A small visual indicator component, often used to denote status or notifications.
/// Its position, size, and color can be customized.
/// </summary>
public partial class RzIndicator : RzComponent
{
    /// <summary>
    /// Gets or sets the position of the indicator.
    /// Defaults to <see cref="IndicatorPosition.TopEnd"/>.
    /// </summary>
    [Parameter] public IndicatorPosition Position { get; set; } = IndicatorPosition.TopEnd;

    /// <summary>
    /// Gets or sets the size of the indicator.
    /// Defaults to <see cref="Size.Small"/>.
    /// </summary>
    [Parameter] public Size Size { get; set; } = Size.Small;

    /// <summary>
    /// Gets or sets a value indicating whether the indicator is visible.
    /// Defaults to true.
    /// </summary>
    [Parameter] public bool Visible { get; set; } = true;

    /// <summary>
    /// Gets or sets the color of the indicator.
    /// Defaults to a red color (<c>Colors.Red.L500</c>).
    /// </summary>
    [Parameter] public Color Color { get; set; } = Colors.Red.L500;

    /// <summary>
    /// Gets or sets the ARIA label for the indicator, providing an accessible name.
    /// If not set, a default localized label "Indicator" will be used.
    /// </summary>
    [Parameter] public string? AriaLabel { get; set; }

    /// <summary>
    /// Gets the effective ARIA label, using the provided AriaLabel or a localized default.
    /// </summary>
    protected string EffectiveAriaLabel => AriaLabel ?? Localizer["RzIndicator.DefaultAriaLabel"];

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        // Element defaults to "div" from RzComponent, which is suitable.
        AriaLabel ??= Localizer["RzIndicator.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzIndicator.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        var s = Theme.RzIndicator;
        return TwMerge.Merge(
            AdditionalAttributes,
            s.IndicatorBase,
            s.GetSizeCss(Size),
            s.GetPositionCss(Position)
        );
    }

    // DefaultAssets is empty as the Alpine component is minimal and globally registered.
    public static readonly string[] DefaultAssets = Array.Empty<string>();
}