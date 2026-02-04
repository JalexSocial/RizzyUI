
using System.Text.Json.Serialization;

namespace RizzyUI;

/// <summary>
/// Provides strongly-typed options for the Embla Carousel Autoplay plugin.
/// </summary>
public class AutoplayPluginOptions
{
    /// <summary>
    /// Gets or sets the delay in milliseconds between slides.
    /// Defaults to 4000.
    /// </summary>
    [JsonPropertyName("delay")]
    public int Delay { get; set; } = 4000;

    /// <summary>
    /// Gets or sets a value indicating whether to jump to the first slide when the last slide is reached.
    /// This is only effective if `Loop` is false on the main `CarouselOptions`.
    /// Defaults to true.
    /// </summary>
    [JsonPropertyName("jump")]
    public bool Jump { get; set; } = true;

    /// <summary>
    /// Gets or sets a value indicating whether to start playing the carousel automatically.
    /// Defaults to true.
    /// </summary>
    [JsonPropertyName("playOnInit")]
    public bool PlayOnInit { get; set; } = true;

    /// <summary>
    /// Gets or sets a value indicating whether to stop the autoplay when the carousel is interacted with.
    /// Defaults to true.
    /// </summary>
    [JsonPropertyName("stopOnInteraction")]
    public bool StopOnInteraction { get; set; } = true;

    /// <summary>
    /// Gets or sets a value indicating whether to stop the autoplay when the last slide is reached.
    /// This is only effective if `Loop` is false on the main `CarouselOptions`.
    /// Defaults to true.
    /// </summary>
    [JsonPropertyName("stopOnLastSnap")]
    public bool StopOnLastSnap { get; set; } = true;

    /// <summary>
    /// Gets or sets a value indicating whether to stop the autoplay when the carousel's root node is not visible in the viewport.
    /// Defaults to false.
    /// </summary>
    [JsonPropertyName("stopOnFocusIn")]
    public bool StopOnFocusIn { get; set; } = false;

    /// <summary>
    /// Gets or sets the direction of the autoplay.
    /// "forward" or "backward". Defaults to "forward".
    /// </summary>
    [JsonPropertyName("direction")]
    public string Direction { get; set; } = "forward";
}