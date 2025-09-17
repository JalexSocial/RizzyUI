namespace RizzyUI;

/// <summary>
/// A strongly-typed representation of the Embla Carousel Auto Height plugin.
/// Use this class to configure the carousel to automatically adjust its height to the visible slides.
/// </summary>
public class AutoHeightPlugin : EmblaPlugin
{
    /// <summary>
    /// Initializes a new instance of the <see cref="AutoHeightPlugin"/> class with the specified options.
    /// </summary>
    /// <param name="options">The configuration options for the auto height plugin.</param>
    public AutoHeightPlugin(AutoHeightPluginOptions options)
    {
        Name = "EmblaCarouselAutoHeight";
        AssetKey = "EmblaAutoHeight";
        Options = options;
    }
}