
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
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     A date input component enhanced with the Flatpickr JavaScript library for a calendar popup.
///     Supports binding to nullable DateTime and configuration via <see cref="FlatpickrOptions" />.
///     Styling is determined by the active <see cref="RzTheme" />. Should be used within an EditForm.
/// </xmldoc>
public sealed partial class RzDateEdit : RzComponent<RzDateEdit.Slots>
{
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "w-full",
        slots: new()
        {
            [s => s.InputWrapper] = "relative",
            [s => s.PrependElement] = "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pr-2 text-muted-foreground",
            [s => s.PrependIconContainer] = "size-4",
            [s => s.Input] = "appearance-none file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flatpickr-input"
        }
    );

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

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzDateEdit;

    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
        public string? InputWrapper { get; set; }
        public string? PrependElement { get; set; }
        public string? PrependIconContainer { get; set; }
        public string? Input { get; set; }
    }
}