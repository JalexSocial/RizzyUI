
namespace RizzyUI;

/// <summary>
/// A generic implementation of <see cref="EmblaPlugin"/> that can be used to configure
/// Embla Carousel plugins that do not have a specific, strongly-typed class provided by RizzyUI.
/// This provides an "escape hatch" for users to integrate any Embla-compatible plugin.
/// </summary>
public class GenericEmblaPlugin : EmblaPlugin
{
    /// <summary>
    /// Initializes a new instance of the <see cref="GenericEmblaPlugin"/> class.
    /// </summary>
    /// <param name="name">The JavaScript constructor name of the plugin (e.g., "SomeOtherPlugin").</param>
    /// <param name="assetKey">The key to look up the asset URL in `RizzyUIConfig.AssetUrls`.</param>
    /// <param name="options">An anonymous or strongly-typed object containing the plugin's configuration options.</param>
    public GenericEmblaPlugin(string name, string assetKey, object options)
    {
        Name = name;
        AssetKey = assetKey;
        Options = options;
    }
}