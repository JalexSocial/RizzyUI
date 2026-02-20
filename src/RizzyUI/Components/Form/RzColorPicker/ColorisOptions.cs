namespace RizzyUI;

/// <summary>
/// Represents configurable options passed to the Coloris JavaScript plugin.
/// </summary>
public sealed record ColorisOptions
{
    /// <summary>
    /// Gets or sets the preferred color format.
    /// </summary>
    public string Format { get; init; } = "hex";

    /// <summary>
    /// Gets or sets a value indicating whether alpha selection is enabled.
    /// </summary>
    public bool Alpha { get; init; }

    /// <summary>
    /// Gets or sets available swatches.
    /// </summary>
    public IEnumerable<string>? Swatches { get; init; }

    /// <summary>
    /// Gets or sets a value indicating whether only swatches are selectable.
    /// </summary>
    public bool SwatchesOnly { get; init; }

    /// <summary>
    /// Gets or sets a value indicating whether a close button is shown.
    /// </summary>
    public bool CloseButton { get; init; }

    /// <summary>
    /// Gets or sets a value indicating whether a clear button is shown.
    /// </summary>
    public bool ClearButton { get; init; }

    /// <summary>
    /// Gets or sets localized accessibility labels.
    /// </summary>
    public ColorisA11yOptions A11y { get; init; } = new();
}

/// <summary>
/// Represents localized accessibility text for Coloris.
/// </summary>
public sealed record ColorisA11yOptions
{
    /// <summary>
    /// Gets or sets the label for opening the picker.
    /// </summary>
    public string Open { get; init; } = string.Empty;

    /// <summary>
    /// Gets or sets the label for closing the picker.
    /// </summary>
    public string Close { get; init; } = string.Empty;

    /// <summary>
    /// Gets or sets the label for clearing the current color.
    /// </summary>
    public string Clear { get; init; } = string.Empty;

    /// <summary>
    /// Gets or sets marker instruction text.
    /// </summary>
    public string Marker { get; init; } = string.Empty;

    /// <summary>
    /// Gets or sets the hue slider label.
    /// </summary>
    public string HueSlider { get; init; } = string.Empty;

    /// <summary>
    /// Gets or sets the alpha slider label.
    /// </summary>
    public string AlphaSlider { get; init; } = string.Empty;

    /// <summary>
    /// Gets or sets the format selector label.
    /// </summary>
    public string Format { get; init; } = string.Empty;

    /// <summary>
    /// Gets or sets the swatch label format text.
    /// </summary>
    public string Swatch { get; init; } = string.Empty;

    /// <summary>
    /// Gets or sets the color value input label.
    /// </summary>
    public string Input { get; init; } = string.Empty;

    /// <summary>
    /// Gets or sets keyboard instruction text for marker control.
    /// </summary>
    public string Instruction { get; init; } = string.Empty;
}
