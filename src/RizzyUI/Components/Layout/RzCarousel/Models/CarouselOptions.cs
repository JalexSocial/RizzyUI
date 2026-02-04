
using System.Text.Json.Serialization;

namespace RizzyUI;

/// <summary>
/// Represents the configuration options for the Embla Carousel instance.
/// </summary>
public class CarouselOptions
{
    /// <summary>
    /// Aligns the slides to the "start", "center", or "end" of the viewport.
    /// </summary>
    [JsonPropertyName("align")]
    public string? Align { get; set; }

    /// <summary>
    /// The axis of the carousel, either "x" for horizontal or "y" for vertical.
    /// </summary>
    [JsonPropertyName("axis")]
    public string? Axis { get; set; }

    /// <summary>
    /// Determines how to handle slides when they are larger than the viewport.
    /// "trimSnaps" removes snaps that are out of view, "keepSnaps" does not.
    /// </summary>
    [JsonPropertyName("containScroll")]
    public string? ContainScroll { get; set; }

    /// <summary>
    /// The direction of the carousel, "ltr" (left-to-right) or "rtl" (right-to-left).
    /// </summary>
    [JsonPropertyName("direction")]
    public string? Direction { get; set; }

    /// <summary>
    /// Enables "free-scrolling" mode where the carousel slides without snapping to a specific slide.
    /// </summary>
    [JsonPropertyName("dragFree")]
    public bool? DragFree { get; set; }

    /// <summary>
    /// Enables or disables dragging the carousel with a pointer.
    /// </summary>
    [JsonPropertyName("draggable")]
    public bool? Draggable { get; set; }

    /// <summary>
    /// The percentage of a slide that needs to be visible in the viewport to be considered "in view".
    /// </summary>
    [JsonPropertyName("inViewThreshold")]
    public double? InViewThreshold { get; set; }

    /// <summary>
    /// Enables looping, allowing the carousel to seamlessly scroll from the last slide to the first and vice-versa.
    /// </summary>
    [JsonPropertyName("loop")]
    public bool? Loop { get; set; }

    /// <summary>
    /// Allows the carousel to skip scroll snaps when scrolling with momentum.
    /// </summary>
    [JsonPropertyName("skipSnaps")]
    public bool? SkipSnaps { get; set; }

    /// <summary>
    /// The zero-based index of the slide to show on initialization.
    /// </summary>
    [JsonPropertyName("startIndex")]
    public int? StartIndex { get; set; }
}