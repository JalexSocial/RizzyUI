
namespace RizzyUI;

/// <summary>
/// Abstract base class for all Embla Carousel plugins.
/// This class provides the core properties needed to identify and configure a plugin on the client-side.
/// </summary>
public abstract class EmblaPlugin
{
    /// <summary>
    /// Gets or sets the name of the plugin's JavaScript constructor (e.g., "EmblaCarouselAutoplay").
    /// This is used by the client-side script to instantiate the correct plugin.
    /// </summary>
    public string Name { get; protected set; } = string.Empty;

    /// <summary>
    /// Gets or sets the logical key used to look up the plugin's asset URL from the central `RizzyUIConfig.AssetUrls` dictionary.
    /// </summary>
    public string AssetKey { get; protected set; } = string.Empty;

    /// <summary>
    /// Gets or sets the configuration options for the plugin. This object will be serialized to JSON
    /// and passed to the plugin's constructor on the client-side.
    /// </summary>
    public object Options { get; set; } = new();
}