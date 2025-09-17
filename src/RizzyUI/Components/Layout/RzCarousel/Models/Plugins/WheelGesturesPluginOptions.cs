
using System.Text.Json.Serialization;

namespace RizzyUI;

/// <summary>
/// Provides strongly-typed options for the Embla Carousel Wheel Gestures plugin.
/// </summary>
public class WheelGesturesPluginOptions
{
    /// <summary>
    /// Gets or sets a value indicating whether to force the wheel gestures on a specific axis.
    /// Can be "x" or "y". If not set, it will be inferred from the carousel's axis.
    /// </summary>
    [JsonPropertyName("forceWheelAxis")]
    public string? ForceWheelAxis { get; set; }

    /// <summary>
    /// Gets or sets the speed of the wheel gestures.
    /// Defaults to 1.
    /// </summary>
    [JsonPropertyName("speed")]
    public int Speed { get; set; } = 1;
}