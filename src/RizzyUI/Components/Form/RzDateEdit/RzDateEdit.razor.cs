
using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.Extensions.Options;
using Rizzy.Utility;
using RizzyUI.Extensions;
using System.Globalization;
using System.Linq.Expressions;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace RizzyUI;

/// <xmldoc>
///     A date input component enhanced with the Flatpickr JavaScript library for a calendar popup.
///     Supports binding to nullable DateTime and configuration via <see cref="FlatpickrOptions" />.
///     Styling is determined by the active <see cref="RzTheme" />. Should be used within an EditForm.
/// </xmldoc>
public sealed partial class RzDateEdit : RzComponent
{
    private readonly string _uid = IdGenerator.UniqueId("rzdate");
    private string _assets = "[]";
    private DateTime? _currentValue;
    private FieldIdentifier _fieldIdentifier;
    private string _inputValue = string.Empty;
    private string _serializedConfig = "{}";

    [Inject]
    private IOptions<RizzyUIConfig> RizzyUIConfig { get; set; } = default!;

    [CascadingParameter] private EditContext? EditContext { get; set; }

    private string _uidInputId => $"{_uid}-input";

    [Parameter][EditorRequired] public Expression<Func<DateTime?>>? For { get; set; }
    [Parameter] public FlatpickrOptions Options { get; set; } = new() { Locale = "en" };
    [Parameter] public string Placeholder { get; set; } = string.Empty;
    [Parameter] public string? PrependText { get; set; }
    [Parameter] public SvgIcon? PrependIcon { get; set; }
    [Parameter] public string[] ComponentAssetKeys { get; set; } = ["FlatpickrCore"];

    private string CurrentValue
    {
        get => _inputValue;
        set
        {
            if (_inputValue == value) return;

            _inputValue = value;
            if (DateTime.TryParseExact(value, GetFlatpickrFormat(), CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
                UpdateValue(parsedDate);
            else if (string.IsNullOrEmpty(value)) 
                UpdateValue(null);
        }
    }

    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (For == null) throw new InvalidOperationException($"{GetType()} requires a 'For' parameter.");
        if (EditContext == null) throw new InvalidOperationException($"{GetType()} must be used within an EditForm.");

        _fieldIdentifier = FieldIdentifier.Create(For);
        _currentValue = For.Compile().Invoke();
        FormatInputValue();
        SerializeConfigAndAssets();
    }

    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        var modelValue = For?.Compile().Invoke();
        if (_currentValue != modelValue)
        {
            _currentValue = modelValue;
            FormatInputValue();
        }
        SerializeConfigAndAssets();
    }

    private void UpdateValue(DateTime? newValue)
    {
        var valueChanged = _currentValue != newValue;
        _currentValue = newValue;
        if (valueChanged) EditContext?.NotifyFieldChanged(_fieldIdentifier);
    }

    private void FormatInputValue()
    {
        if (_currentValue.HasValue)
            _inputValue = _currentValue.Value.ToString(GetFlatpickrFormat(), CultureInfo.InvariantCulture);
        else
            _inputValue = string.Empty;
    }

    private string GetFlatpickrFormat() => Options.DateFormat ?? "Y-m-d";

    private void SerializeConfigAndAssets()
    {
        if (string.IsNullOrEmpty(Options.DefaultDate) && _currentValue.HasValue)
            Options.DefaultDate = _currentValue.Value.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);

        var alpineData = new { options = Options, placeholder = Placeholder, prependText = PrependText ?? string.Empty };
        _serializedConfig = JsonSerializer.Serialize(alpineData, new JsonSerializerOptions { DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull });

        var assetUrls = ComponentAssetKeys
            .Select(key => RizzyUIConfig.Value.AssetUrls.TryGetValue(key, out var url) ? url : null)
            .Where(url => !string.IsNullOrEmpty(url))
            .ToList();
        _assets = JsonSerializer.Serialize(assetUrls);
    }

    protected override string? RootClass() => TwMerge.Merge(AdditionalAttributes, Theme.RzDateEdit.Container);
}