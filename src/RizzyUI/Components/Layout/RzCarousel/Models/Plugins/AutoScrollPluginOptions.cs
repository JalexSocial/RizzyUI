
using System.Text.Json.Serialization;

namespace RizzyUI;

/// <summary>
/// Provides strongly-typed options for the Embla Carousel Auto Scroll plugin.
/// </summary>
public class AutoScrollPluginOptions
{
    /// <summary>
    /// Gets or sets the speed of the scroll in pixels per second.
    /// Defaults to 1000.
    /// </summary>
    [JsonPropertyName("speed")]
    public int Speed { get; set; } = 1000;

    /// <summary>
    /// Gets or sets a value indicating whether to start playing the auto scroll on initialization.
    /// Defaults to true.
    /// </summary>
    [JsonPropertyName("playOnInit")]
    public bool PlayOnInit { get; set; } = true;

    /// <summary>
    /// Gets or sets a value indicating whether to stop the auto scroll when the carousel is interacted with.
    /// Defaults to true.
    /// </summary>
    [JsonPropertyName("stopOnInteraction")]
    public bool StopOnInteraction { get; set; } = true;

    /// <summary>
    /// Gets or sets a value indicating whether to stop the auto scroll when the carousel's root node is not visible in the viewport.
    /// Defaults to false.
    /// </summary>
    [JsonPropertyName("stopOnFocusIn")]
    public bool StopOnFocusIn { get; set; } = false;

    /// <summary>
    /// Gets or sets a value indicating whether to stop the auto scroll when the last slide is reached.
    /// This is only effective if `Loop` is false on the main `CarouselOptions`.
    /// Defaults to true.
    /// </summary>
    [JsonPropertyName("stopOnLastSnap")]
    public bool StopOnLastSnap { get; set; } = true;

    /// <summary>
    /// Gets or sets the direction of the auto scroll.
    /// "forward" or "backward". Defaults to "forward".
    /// </summary>
    [JsonPropertyName("direction")]
    public string Direction { get; set; } = "forward";

    /// <summary>
    /// Gets or sets the start delay in milliseconds before the auto scroll begins.
    /// Defaults to 0.
    /// </summary>
    [JsonPropertyName("startDelay")]
    public int StartDelay { get; set; }
}