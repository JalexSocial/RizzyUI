
using System.Text.Json.Serialization;

namespace RizzyUI;

/// <summary>
/// Provides strongly-typed options for the Embla Carousel Class Names plugin.
/// </summary>
public class ClassNamesPluginOptions
{
    /// <summary>
    /// Gets or sets the class name to add to the selected slide.
    /// Defaults to "is-selected".
    /// </summary>
    [JsonPropertyName("selected")]
    public string Selected { get; set; } = "is-selected";

    /// <summary>
    /// Gets or sets the class name to add to slides that are not selected.
    /// Defaults to "is-not-selected".
    /// </summary>
    [JsonPropertyName("notSelected")]
    public string NotSelected { get; set; } = "is-not-selected";

    /// <summary>
    /// Gets or sets the class name to add to the carousel container when it is being dragged.
    /// Defaults to "is-dragging".
    /// </summary>
    [JsonPropertyName("dragging")]
    public string Dragging { get; set; } = "is-dragging";
}