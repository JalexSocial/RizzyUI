
namespace RizzyUI;

/// <summary>
/// A strongly-typed representation of the Embla Carousel Auto Scroll plugin.
/// Use this class to configure the carousel to scroll automatically.
/// </summary>
public class AutoScrollPlugin : EmblaPlugin
{
    /// <summary>
    /// Initializes a new instance of the <see cref="AutoScrollPlugin"/> class with the specified options.
    /// </summary>
    /// <param name="options">The configuration options for the auto scroll plugin.</param>
    public AutoScrollPlugin(AutoScrollPluginOptions options)
    {
        Name = "EmblaCarouselAutoScroll";
        AssetKey = "EmblaAutoScroll";
        Options = options;
    }
}