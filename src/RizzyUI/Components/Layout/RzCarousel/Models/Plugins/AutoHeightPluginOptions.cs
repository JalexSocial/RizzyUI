
using System.Text.Json.Serialization;

namespace RizzyUI;

/// <summary>
/// Provides strongly-typed options for the Embla Carousel Auto Height plugin.
/// </summary>
public class AutoHeightPluginOptions
{
    /// <summary>
    /// Gets or sets the alignment of the carousel content within the container when height is adjusted.
    /// Can be "top", "center", or "bottom". Defaults to "top".
    /// </summary>
    [JsonPropertyName("align")]
    public string Align { get; set; } = "top";

    /// <summary>
    /// Gets or sets the duration of the height adjustment animation in milliseconds.
    /// Defaults to 250.
    /// </summary>
    [JsonPropertyName("duration")]
    public int Duration { get; set; } = 250;

    /// <summary>
    /// Gets or sets the easing function for the height adjustment animation.
    /// This should be a valid CSS easing function string (e.g., "ease-in-out").
    /// Defaults to "ease-in-out".
    /// </summary>
    [JsonPropertyName("easing")]
    public string Easing { get; set; } = "ease-in-out";

    /// <summary>
    /// Gets or sets a value indicating whether to destroy the plugin when the carousel is destroyed.
    /// Defaults to true.
    /// </summary>
    [JsonPropertyName("destroyHeight")]
    public bool DestroyHeight { get; set; } = true;
}