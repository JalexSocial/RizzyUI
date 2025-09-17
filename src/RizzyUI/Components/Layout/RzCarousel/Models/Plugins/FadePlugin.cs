
namespace RizzyUI;

/// <summary>
/// A strongly-typed representation of the Embla Carousel Fade plugin.
/// Use this class to create a fade transition effect between slides.
/// </summary>
public class FadePlugin : EmblaPlugin
{
    /// <summary>
    /// Initializes a new instance of the <see cref="FadePlugin"/> class with the specified options.
    /// </summary>
    /// <param name="options">The configuration options for the fade plugin.</param>
    public FadePlugin(FadePluginOptions options)
    {
        Name = "EmblaCarouselFade";
        AssetKey = "EmblaFade";
        Options = options;
    }
}