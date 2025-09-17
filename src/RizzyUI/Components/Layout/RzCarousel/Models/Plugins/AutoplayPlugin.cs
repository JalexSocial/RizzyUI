
namespace RizzyUI;

/// <summary>
/// A strongly-typed representation of the Embla Carousel Autoplay plugin.
/// Use this class to configure and enable autoplay functionality for an <see cref="RzCarousel"/>.
/// </summary>
public class AutoplayPlugin : EmblaPlugin
{
    /// <summary>
    /// Initializes a new instance of the <see cref="AutoplayPlugin"/> class with the specified options.
    /// </summary>
    /// <param name="options">The configuration options for the autoplay plugin.</param>
    public AutoplayPlugin(AutoplayPluginOptions options)
    {
        Name = "EmblaCarouselAutoplay"; // The JavaScript constructor name
        AssetKey = "EmblaAutoplay";      // The key to look up the asset URL in RizzyUIConfig
        Options = options;
    }
}