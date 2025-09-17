namespace RizzyUI;

/// <summary>
/// A strongly-typed representation of the Embla Carousel Class Names plugin.
/// Use this class to add CSS classes to the carousel elements based on their state.
/// </summary>
public class ClassNamesPlugin : EmblaPlugin
{
    /// <summary>
    /// Initializes a new instance of the <see cref="ClassNamesPlugin"/> class with the specified options.
    /// </summary>
    /// <param name="options">The configuration options for the class names plugin.</param>
    public ClassNamesPlugin(ClassNamesPluginOptions options)
    {
        Name = "EmblaCarouselClassNames";
        AssetKey = "EmblaClassNames";
        Options = options;
    }
}