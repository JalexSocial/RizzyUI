namespace RizzyUI;

/// <summary>
/// A strongly-typed representation of the Embla Carousel Wheel Gestures plugin.
/// Use this class to enable carousel interaction with mouse wheel gestures.
/// </summary>
public class WheelGesturesPlugin : EmblaPlugin
{
    /// <summary>
    /// Initializes a new instance of the <see cref="WheelGesturesPlugin"/> class with the specified options.
    /// </summary>
    /// <param name="options">The configuration options for the wheel gestures plugin.</param>
    public WheelGesturesPlugin(WheelGesturesPluginOptions options)
    {
        Name = "EmblaCarouselWheelGestures";
        AssetKey = "EmblaWheelGestures";
        Options = options;
    }
}