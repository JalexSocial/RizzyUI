
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Options;
using System.Text.Json;
using System.Text.Json.Serialization;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A powerful, searchable combobox based on Tom Select.
/// Uses a native &lt;select&gt; element for robust data binding and SSR support.
/// Supports generic value binding and native support for ASP.NET Core SelectListItem.
/// </summary>
/// <typeparam name="TItem">The type of the items in the dropdown (e.g. SelectListItem or a custom POCO).</typeparam>
/// <typeparam name="TValue">The type of the bound value (string or IEnumerable&lt;string&gt;).</typeparam>
public partial class RzCombobox<TItem, TValue> : InputBase<TValue, RzComboboxSlots>, IHasRzComboboxStylingProperties
{
    /// <inheritdoc />
    /// <remarks><c>Id</c> is rendered on the Alpine root element; Tom Select labels its own control.</remarks>
    protected override bool IdIsLabelTarget => false;

    [Inject] private IOptions<RizzyUIConfig> RizzyUIConfig { get; set; } = default!;

    private string ConfigScriptId => $"{Id}-config";
    private string SelectId => $"{Id}-select";

    private string _serializedConfig = "{}";
    private string _assets = "[]";
    private ComboboxOptions _effectiveOptions = new();
    private bool _isSelectListItem;

    /// <summary>
    /// Configuration options for the Tom Select instance.
    /// </summary>
    [Parameter] public ComboboxOptions Options { get; set; } = new();

    /// <summary>
    /// The data source for the combobox items.
    /// </summary>
    [Parameter] public IEnumerable<TItem> Items { get; set; } = Enumerable.Empty<TItem>();

    /// <summary>
    /// Whether multiple items can be selected.
    /// </summary>
    [Parameter] public bool Multiple { get; set; }

    /// <summary>
    /// The placeholder text displayed when empty.
    /// </summary>
    [Parameter] public string? Placeholder { get; set; }

    /// <summary>
    /// Whether the control is disabled.
    /// </summary>
    [Parameter] public bool Disabled { get; set; }

    /// <summary>
    /// The name attribute for the input. If null, derived from the For expression.
    /// </summary>
    [Parameter] public string? Name { get; set; }

    /// <summary>
    /// Function to extract the ID/Value string from an item. 
    /// Automatically set if TItem is SelectListItem.
    /// </summary>
    [Parameter] public Func<TItem, string>? ValueSelector { get; set; }

    /// <summary>
    /// Function to extract the display text from an item.
    /// Automatically set if TItem is SelectListItem.
    /// </summary>
    [Parameter] public Func<TItem, string>? TextSelector { get; set; }

    /// <summary>
    /// Custom template for rendering dropdown options.
    /// </summary>
    [Parameter] public RenderFragment? OptionTemplate { get; set; }

    /// <summary>
    /// Custom template for rendering selected items.
    /// </summary>
    [Parameter] public RenderFragment? ItemTemplate { get; set; }

    /// <summary>
    /// Keys for assets to load. Defaults to ["TomSelect"].
    /// </summary>
    [Parameter] public string[] ComponentAssetKeys { get; set; } = ["TomSelect"];

    private string NameAttributeValue => Name ?? (For != null ? FieldIdentifier.Create(For).FieldName : string.Empty);

    // Implements IHasRzComboboxStylingProperties via InputBase.IsInvalid
    bool IHasRzComboboxStylingProperties.Invalid => IsInvalid;

    /// <summary>
    /// True if TItem is Microsoft.AspNetCore.Mvc.Rendering.SelectListItem.
    /// </summary>
    protected bool IsSelectListItem => _isSelectListItem;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element)) Element = "div";
        Placeholder ??= Localizer["RzCombobox.DefaultPlaceholder"];

        _isSelectListItem = typeof(TItem) == typeof(SelectListItem);

        UpdateConfiguration();
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();

        if (_isSelectListItem)
        {
            ValueSelector ??= i => ((SelectListItem)(object)i!).Value ?? string.Empty;
            TextSelector ??= i => ((SelectListItem)(object)i!).Text ?? string.Empty;
        }

        _effectiveOptions = Options.Clone();
        _effectiveOptions.Placeholder = Placeholder;

        if (Multiple)
        {
            _effectiveOptions.AddPlugin(new ComboboxRemoveButtonPlugin());
            _effectiveOptions.AddPlugin(new ComboboxCheckboxOptionsPlugin());
        }

        UpdateConfiguration();
    }

    private void UpdateConfiguration()
    {
        var assetUrls = RizzyUIConfig.Value.ResolveAssets(ComponentAssetKeys, RequestPathBase);
        _assets = JsonSerializer.Serialize(assetUrls);

        _effectiveOptions.ValueField = "value";
        _effectiveOptions.LabelField = "text";
        _effectiveOptions.SearchField = ["text"];

        _serializedConfig = JsonSerializer.Serialize(_effectiveOptions, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        });
    }

    /// <summary>
    /// Helper to get input attributes from base, filtered for the inner select element.
    /// </summary>
    protected Dictionary<string, object?> InnerInputAttributes
    {
        get
        {
            // InputAttributes from InputBase contains validation classes and Aria attributes.
            // We generally want to pass these to the select element.
            // However, we might want to exclude 'class' if we are controlling it via SlotClasses.
            var attrs = new Dictionary<string, object?>(InputAttributes);
            attrs.Remove("class");
            return attrs;
        }
    }

    private string GetValue(TItem item) => item == null ? "" : (ValueSelector?.Invoke(item) ?? item.ToString() ?? "");
    private string GetText(TItem item) => item == null ? "" : (TextSelector?.Invoke(item) ?? item.ToString() ?? "");

    /// <summary>
    /// Determines if an item is selected.
    /// Priority:
    /// 1. If Value was passed, use that.
    /// 2. Otherwise, if the value read from For is not null, an empty string or an empty collection, use that.
    /// 3. Otherwise, if the item is a SelectListItem, use SelectListItem.Selected.
    /// </summary>
    private bool IsSelected(TItem item, string val)
    {
        if (Value is { } value && (ValueIsParameter || !IsEmptySelection(value)))
        {
            if (Multiple && value is System.Collections.IEnumerable enumerable and not string)
            {
                foreach (var v in enumerable)
                {
                    if (v?.ToString() == val) return true;
                }
                return false;
            }
            return value.ToString() == val;
        }

        if (_isSelectListItem && item is SelectListItem sli)
        {
            return sli.Selected;
        }

        return false;
    }

    private static bool IsEmptySelection(object value) => value switch
    {
        string text => text.Length == 0,
        System.Collections.IEnumerable enumerable => !enumerable.GetEnumerator().MoveNext(),
        _ => false
    };

    private string SerializeItem(TItem item) => JsonSerializer.Serialize(item, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<RzComboboxSlots>, RzComboboxSlots> GetDescriptor() => Theme.RzCombobox;

}