
using System.Text.Json.Serialization;

namespace RizzyUI;

/// <summary>
/// Provides strongly-typed options for the Embla Carousel Fade plugin.
/// </summary>
public class FadePluginOptions
{
    /// <summary>
    /// Gets or sets the initial fade value.
    /// Defaults to 0.
    /// </summary>
    [JsonPropertyName("fade")]
    public int Fade { get; set; }
}