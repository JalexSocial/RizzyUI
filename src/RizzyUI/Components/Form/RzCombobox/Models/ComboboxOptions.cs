
using System.Text.Json.Serialization;

namespace RizzyUI;

/// <summary>
/// Configuration options for the Tom Select instance used by RzCombobox.
/// </summary>
public class ComboboxOptions
{
    /// <summary>
    /// If true, allows the user to create new items not present in the list.
    /// </summary>
    [JsonPropertyName("create")]
    public bool Create { get; set; } = false;

    /// <summary>
    /// The string to separate selected items in the input (for multi-select copy/paste).
    /// </summary>
    [JsonPropertyName("delimiter")]
    public string Delimiter { get; set; } = ",";

    /// <summary>
    /// The maximum number of items the user can select. 1 for single select, null for unlimited.
    /// </summary>
    [JsonPropertyName("maxItems")]
    public int? MaxItems { get; set; }

    /// <summary>
    /// If true, the dropdown will open when the control receives focus.
    /// </summary>
    [JsonPropertyName("openOnFocus")]
    public bool OpenOnFocus { get; set; } = true;

    /// <summary>
    /// If true, the original &lt;select&gt; or &lt;input&gt; element is retained in the DOM.
    /// </summary>
    [JsonPropertyName("persist")]
    public bool Persist { get; set; } = true;

    /// <summary>
    /// The placeholder text to display when no value is selected.
    /// </summary>
    [JsonPropertyName("placeholder")]
    public string? Placeholder { get; set; }

    /// <summary>
    /// The property on the data object to use as the value.
    /// </summary>
    [JsonPropertyName("valueField")]
    public string ValueField { get; set; } = "value";

    /// <summary>
    /// The property on the data object to use as the display label.
    /// </summary>
    [JsonPropertyName("labelField")]
    public string LabelField { get; set; } = "text";

    /// <summary>
    /// The property on the data object to use for searching.
    /// </summary>
    [JsonPropertyName("searchField")]
    public string[] SearchField { get; set; } = ["text"];

    /// <summary>
    /// A list of plugins to initialize with the instance.
    /// </summary>
    [JsonPropertyName("plugins")]
    public List<IComboboxPlugin> Plugins { get; set; } = new();

    /// <summary>
    /// Creates a shallow copy of the options, including a shallow copy of the plugin list.
    /// </summary>
    public ComboboxOptions Clone()
    {
        var clone = (ComboboxOptions)this.MemberwiseClone();
        clone.Plugins = new List<IComboboxPlugin>(this.Plugins);
        return clone;
    }

    /// <summary>
    /// Adds a plugin to the configuration if it is not already present.
    /// </summary>
    /// <param name="plugin">The plugin instance to add.</param>
    public void AddPlugin(IComboboxPlugin plugin)
    {
        if (!Plugins.Any(p => p.Name == plugin.Name))
        {
            Plugins.Add(plugin);
        }
    }
}