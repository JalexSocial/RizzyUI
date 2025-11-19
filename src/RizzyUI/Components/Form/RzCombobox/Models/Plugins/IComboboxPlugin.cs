
using System.Text.Json.Serialization;

namespace RizzyUI;

/// <summary>
/// Represents the configuration options for a specific Tom Select plugin.
/// Implementations should be simple POCOs serializable to JSON.
/// </summary>
public interface IComboboxPluginOptions
{
    // Marker interface for type safety and serialization polymorphism
}

/// <summary>
/// Defines a plugin to be registered with the Combobox.
/// </summary>
public interface IComboboxPlugin
{
    /// <summary>
    /// The unique name of the plugin as recognized by Tom Select (e.g., "remove_button").
    /// </summary>
    [JsonPropertyName("name")]
    string Name { get; }

    /// <summary>
    /// The configuration options for this plugin instance.
    /// </summary>
    [JsonPropertyName("options")]
    IComboboxPluginOptions? Options { get; }
}