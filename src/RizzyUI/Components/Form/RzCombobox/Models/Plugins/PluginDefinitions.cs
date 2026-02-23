using System.Text.Json.Serialization;

namespace RizzyUI;

// ----------------------------------------------------------------------------
// Generic Plugin Base
// ----------------------------------------------------------------------------

/// <summary>
/// Base implementation for strong-typed plugins.
/// </summary>
/// <typeparam name="TOptions">The type of options object this plugin uses.</typeparam>
public abstract class ComboboxPluginBase<TOptions> : IComboboxPlugin where TOptions : IComboboxPluginOptions
{
    /// <inheritdoc/>
    public abstract string Name { get; }

    /// <summary>
    /// The strongly-typed options for this plugin.
    /// </summary>
    [JsonIgnore]
    public TOptions? TypedOptions { get; set; }

    /// <inheritdoc/>
    public IComboboxPluginOptions? Options => TypedOptions;

    /// <summary>
    /// Initializes a new instance of the plugin with optional settings.
    /// </summary>
    protected ComboboxPluginBase(TOptions? options = default)
    {
        TypedOptions = options;
    }
}

// ----------------------------------------------------------------------------
// Checkbox Options
// ----------------------------------------------------------------------------

/// <summary>
/// Configuration for the Checkbox Options plugin.
/// </summary>
public class ComboboxCheckboxOptionsSettings : IComboboxPluginOptions
{
    /// <summary>Class name for the checkbox.</summary>
    [JsonPropertyName("className")]
    public string ClassName { get; set; } = "ts-checkbox";

    /// <summary>Classes to apply when checked.</summary>
    [JsonPropertyName("checkedClassNames")]
    public string[]? CheckedClassNames { get; set; }

    /// <summary>Classes to apply when unchecked.</summary>
    [JsonPropertyName("uncheckedClassNames")]
    public string[]? UncheckedClassNames { get; set; }
}

/// <summary>
/// Plugin to render checkboxes next to options in the dropdown.
/// </summary>
public class ComboboxCheckboxOptionsPlugin : ComboboxPluginBase<ComboboxCheckboxOptionsSettings>
{
    /// <inheritdoc/>
    public override string Name => "checkbox_options";
    /// <summary>
    /// Initializes a new instance of the <see cref="ComboboxCheckboxOptionsPlugin"/> class.
    /// </summary>
    /// <param name="options">Optional plugin configuration.</param>
    public ComboboxCheckboxOptionsPlugin(ComboboxCheckboxOptionsSettings? options = null) : base(options) { }
}

// ----------------------------------------------------------------------------
// Clear Button
// ----------------------------------------------------------------------------

/// <summary>
/// Configuration for the Clear Button plugin.
/// </summary>
public class ComboboxClearButtonSettings : IComboboxPluginOptions
{
    /// <summary>Title attribute for the button.</summary>
    [JsonPropertyName("title")]
    public string Title { get; set; } = "Clear";

    /// <summary>Class name for the button.</summary>
    [JsonPropertyName("className")]
    public string ClassName { get; set; } = "clear-button";

    /// <summary>Label text for the button.</summary>
    [JsonPropertyName("label")]
    public string Label { get; set; } = "clear";

    /// <summary>
    /// HTML string for the button content. 
    /// Note: Passed as a string literal to JavaScript.
    /// </summary>
    [JsonPropertyName("html")]
    public string? Html { get; set; }
}

/// <summary>
/// Plugin to add a clear button to the control.
/// </summary>
public class ComboboxClearButtonPlugin : ComboboxPluginBase<ComboboxClearButtonSettings>
{
    /// <inheritdoc/>
    public override string Name => "clear_button";
    /// <summary>
    /// Initializes a new instance of the <see cref="ComboboxClearButtonPlugin"/> class.
    /// </summary>
    /// <param name="options">Optional plugin configuration.</param>
    public ComboboxClearButtonPlugin(ComboboxClearButtonSettings? options = null) : base(options) { }
}

// ----------------------------------------------------------------------------
// Remove Button
// ----------------------------------------------------------------------------

/// <summary>
/// Configuration for the Remove Button plugin.
/// </summary>
public class ComboboxRemoveButtonSettings : IComboboxPluginOptions
{
    /// <summary>Label for the remove button.</summary>
    [JsonPropertyName("label")]
    public string Label { get; set; } = "&times;";

    /// <summary>Title attribute.</summary>
    [JsonPropertyName("title")]
    public string Title { get; set; } = "Remove";

    /// <summary>CSS class.</summary>
    [JsonPropertyName("className")]
    public string ClassName { get; set; } = "remove";
}

/// <summary>
/// Plugin to add an 'x' button to selected items for removal.
/// </summary>
public class ComboboxRemoveButtonPlugin : ComboboxPluginBase<ComboboxRemoveButtonSettings>
{
    /// <inheritdoc/>
    public override string Name => "remove_button";
    /// <summary>
    /// Initializes a new instance of the <see cref="ComboboxRemoveButtonPlugin"/> class.
    /// </summary>
    /// <param name="options">Optional plugin configuration.</param>
    public ComboboxRemoveButtonPlugin(ComboboxRemoveButtonSettings? options = null) : base(options) { }
}

// ----------------------------------------------------------------------------
// Virtual Scroll
// ----------------------------------------------------------------------------

/// <summary>
/// Configuration for the Virtual Scroll plugin.
/// </summary>
public class ComboboxVirtualScrollSettings : IComboboxPluginOptions
{
    /// <summary>Throttle time in milliseconds.</summary>
    [JsonPropertyName("throttle")]
    public int Throttle { get; set; } = 50;
}

/// <summary>
/// Plugin to enable virtual scrolling for large datasets.
/// </summary>
public class ComboboxVirtualScrollPlugin : ComboboxPluginBase<ComboboxVirtualScrollSettings>
{
    /// <inheritdoc/>
    public override string Name => "virtual_scroll";
    /// <summary>
    /// Initializes a new instance of the <see cref="ComboboxVirtualScrollPlugin"/> class.
    /// </summary>
    /// <param name="options">Optional plugin configuration.</param>
    public ComboboxVirtualScrollPlugin(ComboboxVirtualScrollSettings? options = null) : base(options) { }
}