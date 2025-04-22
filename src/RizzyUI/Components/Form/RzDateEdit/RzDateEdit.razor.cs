using System.Globalization;
using System.Linq.Expressions;
using System.Text.Json;
using System.Text.Json.Serialization;
using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Rizzy.Utility;
using RizzyUI.Extensions;

// For EditContext, FieldIdentifier

namespace RizzyUI;

/// <xmldoc>
///     A date input component enhanced with the Flatpickr JavaScript library for a calendar popup.
///     Supports binding to nullable DateTime and configuration via <see cref="FlatpickrOptions" />.
///     Styling is determined by the active <see cref="RzTheme" />. Should be used within an EditForm.
/// </xmldoc>
public sealed partial class RzDateEdit : RzComponent
{
    private static readonly string[] DefaultAssets =
    [
        // Flatpickr JS - CSS is often included via CDN link or build process
        "https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.js"
    ];

    private readonly string _uid = IdGenerator.UniqueId("rzdate");
    private string _assets = "[]";
    private DateTime? _currentValue;
    private FieldIdentifier _fieldIdentifier;
    private string _inputValue = string.Empty; // Value for the input element itself

    private string _serializedConfig = "{}";

    // Theme is inherited from RzComponent
    [CascadingParameter] private EditContext? EditContext { get; set; }

    /// <summary> Gets the unique ID for the input element. </summary>
    private string _uidInputId => $"{_uid}-input";

    /// <summary> Gets or sets the expression identifying the DateTime? field to bind to. Required. </summary>
    [Parameter] [EditorRequired] public Expression<Func<DateTime?>>? For { get; set; }

    /// <summary> Gets or sets the Flatpickr configuration options. </summary>
    [Parameter] public FlatpickrOptions Options { get; set; } = new() { Locale = "en" }; // Ensure default locale

    /// <summary> Gets or sets the placeholder text for the date input. </summary>
    [Parameter] public string Placeholder { get; set; } = string.Empty;

    /// <summary> Gets or sets optional text to prepend inside the input's visual container. </summary>
    [Parameter] public string? PrependText { get; set; }

    /// <summary> Gets or sets an optional Blazicon SVG icon to prepend inside the input's visual container. </summary>
    [Parameter] public SvgIcon? PrependIcon { get; set; }

    /// <summary> Optional array of asset URLs (JS/CSS) for Flatpickr. Defaults to Flatpickr CDN JS. </summary>
    [Parameter] public string[] ComponentAssets { get; set; } = DefaultAssets;

    /// <summary> Internal property for binding the input value. </summary>
    private string CurrentValue
    {
        get => _inputValue;
        set
        {
            // This setter might be called by Flatpickr changing the input value.
            // We need to parse it back to DateTime? and update the model.
            if (_inputValue == value) return;

            _inputValue = value;
            if (DateTime.TryParseExact(value, GetFlatpickrFormat(), CultureInfo.InvariantCulture, DateTimeStyles.None,
                    out var parsedDate))
                UpdateValue(parsedDate);
            else if (string.IsNullOrEmpty(value)) UpdateValue(null); // Handle clearing the input
            // If parsing fails, we might want to keep _currentValue as is, or set to null,
            // depending on desired behavior for invalid manual input.
            // For now, we only update if parsing succeeds or input is cleared.
        }
    }

    // --- Style Properties derived from Theme ---
    private string ContainerClass => Theme.RzDateEdit.Container;
    private string InputWrapperClass => Theme.RzDateEdit.InputWrapper;
    private string PrependElementClass => Theme.RzDateEdit.PrependElement;
    private string PrependIconContainerClass => Theme.RzDateEdit.PrependIconContainer;
    private string InputClass => Theme.RzDateEdit.Input; // Base input style

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized(); // Initializes Theme
        if (For == null) throw new InvalidOperationException($"{GetType()} requires a 'For' parameter.");
        if (EditContext == null) throw new InvalidOperationException($"{GetType()} must be used within an EditForm.");

        _fieldIdentifier = FieldIdentifier.Create(For);
        _currentValue = For.Compile().Invoke(); // Get initial value from model
        FormatInputValue(); // Format initial value for display
        SerializeConfigAndAssets(); // Prepare data for Alpine
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        // If the bound value changes externally, update our internal state
        var modelValue = For?.Compile().Invoke();
        if (_currentValue != modelValue)
        {
            _currentValue = modelValue;
            FormatInputValue(); // Reformat display value
            // Reserializing might be needed if Options changed, but can be costly.
            // Consider if Options are likely to change dynamically. If not, only do this in OnInitialized.
            // SerializeConfigAndAssets();
        }

        // Re-serialize if options or assets change
        SerializeConfigAndAssets();
    }

    private void UpdateValue(DateTime? newValue)
    {
        var valueChanged = _currentValue != newValue;
        _currentValue = newValue;
        if (valueChanged) EditContext?.NotifyFieldChanged(_fieldIdentifier);
        // Note: We don't invoke a ValueChanged event here as binding is handled by RzInput* components usually.
        // If direct binding support without RzInput* is needed, add [Parameter] Value/ValueChanged.
    }

    private void FormatInputValue()
    {
        // Format the DateTime? value into the string format expected by Flatpickr/the input
        if (_currentValue.HasValue)
            _inputValue = _currentValue.Value.ToString(GetFlatpickrFormat(), CultureInfo.InvariantCulture);
        else
            _inputValue = string.Empty;
    }

    private string GetFlatpickrFormat()
    {
        // Determine the format string based on Flatpickr options
        // This needs to match how Flatpickr parses/formats dates.
        // Defaulting to ISO 8601 date format. Adjust if Options.DateFormat is different.
        return Options.DateFormat ?? "Y-m-d";
    }


    private void SerializeConfigAndAssets()
    {
        // Store default date based on current value if not explicitly set in Options
        if (string.IsNullOrEmpty(Options.DefaultDate) && _currentValue.HasValue)
            // Use a format Flatpickr understands by default
            Options.DefaultDate = _currentValue.Value.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);

        // Prepare data object for Alpine
        var alpineData = new
            { options = Options, placeholder = Placeholder, prependText = PrependText ?? string.Empty };
        _serializedConfig = JsonSerializer.Serialize(alpineData,
            new JsonSerializerOptions { DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull });
        _assets = JsonSerializer.Serialize(ComponentAssets);
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, ContainerClass);
    }
}