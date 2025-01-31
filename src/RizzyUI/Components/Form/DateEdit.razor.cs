using System.Text.Json.Serialization;
using Blazicons;
using Microsoft.AspNetCore.Components;

namespace RizzyUI;

using System.Linq.Expressions;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Globalization;
using RizzyUI.Extensions;
using Rizzy.Utility;

/// <summary>
/// A date-editing component using Flatpickr for calendar picking.
/// </summary>
public sealed partial class DateEdit : RizzyComponent
{
    private static readonly string BaseStyle = "w-full"; // Root container styling
    private string PrependStyle { get; set; } = string.Empty;

    private static readonly string InputBaseStyle =
        "block w-full rounded-theme border border-outline px-3 py-2 leading-6 " +
        "placeholder-on-surface focus:border-primary focus:ring focus:ring-primary " +
        "focus:ring-opacity-50 dark:border-outline-dark dark:bg-surface-dark-alt " +
        "dark:placeholder-on-surface-dark dark:focus:border-primary-dark";

    private static readonly string[] DefaultAssets =
    [
        // Flatpickr CSS
        /*"https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css",*/
        // Flatpickr JS
        "https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.js"
    ];

    // Serialized Alpine data for the external rzDateEdit definition.
    private string _serializedConfig = string.Empty;
    private string _assets = string.Empty;
    private string _uid = IdGenerator.UniqueId("frmDate");
    private string _inputStyle = string.Empty;
    private DateTime? _value;

    /// <summary>
    /// Gets or sets the expression identifying the current field.
    /// </summary>
    public Expression<Func<DateTime?>>? For { get; set; }

    /// <summary>
    /// Gets or sets the Flatpickr configuration options.
    /// </summary>
    [Parameter]
    public FlatpickrOptions Options { get; set; } = new()
    {
        Locale = "en"
    };

    /// <summary>
    /// Gets or sets the placeholder text for the date input.
    /// </summary>
    [Parameter]
    public string Placeholder { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the text to prepend inside the input field.
    /// </summary>
    [Parameter]
    public string? PrependText { get; set; }

    /// <summary>
    /// Gets or sets the text to prepend icon inside the input field.
    /// </summary>
    /// <remarks>Only one of PrependText or PrependIcon can be defined</remarks>
    [Parameter]
    public SvgIcon? PrependIcon { get; set; }

    /// <summary>
    /// Gets or sets the CDN or local asset URLs required by this component.
    /// By default, uses the Flatpickr CDN paths.
    /// </summary>
    [Parameter]
    public string[] ComponentAssets { get; set; } = DefaultAssets;

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        // In this example, we only merge the base container class.
        return TwMerge.Merge(AdditionalAttributes, BaseStyle);
    }

    internal record FlatpickrDataOptions(FlatpickrOptions options, string placeholder, string prependText);

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        Nonce = RizzyNonceProvider.GetNonceValues();

        // If the user has provided a binding expression, we can attempt to read the current value.
        if (For is not null)
        {
            _value = For.Compile().Invoke();
            if (_value.HasValue)
            {
                // Store default date in the Options
                Options.DefaultDate = _value.Value.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
            }
        }

        // Construct the input style (Tailwind classes for the <input>).
        // If we have prepend text, shift the input left padding accordingly.
        bool hasPrepend = !string.IsNullOrEmpty(PrependText);
        _inputStyle = hasPrepend
            ? $"{InputBaseStyle} plch-{PrependText!.Length + 3}"
            : InputBaseStyle;

        // Prepare the data object for Alpine, matching the original shape if needed.
        var alpineData = new FlatpickrDataOptions(Options, Placeholder, PrependText);

        // Serialize the data for the 'rzDateEdit' Alpine component.
        _serializedConfig = JsonSerializer.Serialize(alpineData, options: new JsonSerializerOptions() { DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull }  );

        // Serialize the array of assets so we can load them via loadjs in the external Alpine code.
        _assets = JsonSerializer.Serialize(ComponentAssets);
    }
}