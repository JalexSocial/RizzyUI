using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.Extensions.Options;
using System.Linq.Expressions;
using System.Text.Json;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents an SSR-first one-time passcode input with Alpine-powered visual slot rendering.
/// </summary>
public partial class RzInputOTP : RzComponent<RzInputOTP.Slots>
{
    /// <summary>
    /// Defines the supported OTP filtering modes.
    /// </summary>
    public enum InputOtpType
    {
        /// <summary>
        /// Restricts OTP input to numeric characters.
        /// </summary>
        Numeric,

        /// <summary>
        /// Allows alphanumeric OTP input.
        /// </summary>
        Alphanumeric
    }


    /// <summary>
    /// Defines text transformation options applied to OTP text input.
    /// </summary>
    public enum InputOtpTextTransform
    {
        /// <summary>
        /// Leaves OTP text unchanged.
        /// </summary>
        None,

        /// <summary>
        /// Transforms OTP text to lowercase.
        /// </summary>
        ToLower,

        /// <summary>
        /// Transforms OTP text to uppercase.
        /// </summary>
        ToUpper
    }

    /// <summary>
    /// Defines the default styling for the <see cref="RzInputOTP"/> component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex items-center gap-2 has-disabled:opacity-50",
        slots: new()
        {
            [s => s.Input] = "disabled:cursor-not-allowed"
        }
    );

    private string _assets = "[]";
    private FieldIdentifier _fieldIdentifier;

    [Inject]
    private IOptions<RizzyUIConfig> RizzyUIConfig { get; set; } = default!;

    [CascadingParameter]
    private EditContext? EditContext { get; set; }

    /// <summary>
    /// Gets or sets the number of OTP characters.
    /// </summary>
    [Parameter, EditorRequired]
    public required int Length { get; set; }

    /// <summary>
    /// Gets or sets the input name used in form submission.
    /// </summary>
    [Parameter]
    public string? Name { get; set; }

    /// <summary>
    /// Gets or sets the initial server-rendered OTP value.
    /// </summary>
    [Parameter]
    public string? Value { get; set; }

    /// <summary>
    /// Gets or sets whether the input is disabled.
    /// </summary>
    [Parameter]
    public bool Disabled { get; set; }

    /// <summary>
    /// Gets or sets whether the input is required.
    /// </summary>
    [Parameter]
    public bool Required { get; set; }

    /// <summary>
    /// Gets or sets additional classes for the OTP container.
    /// </summary>
    [Parameter]
    public string? ContainerClass { get; set; }

    /// <summary>
    /// Gets or sets the autocomplete behavior. Defaults to one-time-code.
    /// </summary>
    [Parameter]
    public string Autocomplete { get; set; } = "one-time-code";

    /// <summary>
    /// Gets or sets the input mode for the native input.
    /// </summary>
    [Parameter]
    public string? InputMode { get; set; }

    /// <summary>
    /// Gets or sets the OTP filter mode.
    /// </summary>
    [Parameter]
    public InputOtpType OtpType { get; set; } = InputOtpType.Numeric;

    /// <summary>
    /// Gets or sets the text transformation mode for OTP character input.
    /// </summary>
    [Parameter]
    public InputOtpTextTransform TextTransform { get; set; } = InputOtpTextTransform.None;

    /// <summary>
    /// Gets or sets the child content for grouped OTP slots.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the bound form expression for validation metadata.
    /// </summary>
    [Parameter]
    public Expression<Func<string>>? For { get; set; }

    /// <summary>
    /// Gets or sets a value that forces invalid visual state.
    /// </summary>
    [Parameter]
    public bool? Invalid { get; set; }

    /// <summary>
    /// Gets or sets the input aria-label.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <summary>
    /// Gets or sets the input aria-describedby value.
    /// </summary>
    [Parameter]
    public string? AriaDescribedBy { get; set; }

    /// <summary>
    /// Gets or sets logical asset keys used to resolve script dependencies.
    /// </summary>
    [Parameter]
    public string[] ComponentAssetKeys { get; set; } = [];

    private bool IsInvalid => Invalid ?? (For is not null && EditContext?.GetValidationMessages(_fieldIdentifier).Any() == true);

    internal string InputId => $"{Id}-input";

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        AriaLabel ??= Localizer["RzInputOTP.DefaultAriaLabel"];
        SetElementDefault();
        UpdateFieldIdentifier();
        UpdateAssets();
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzInputOTP.DefaultAriaLabel"];
        SetElementDefault();
        UpdateFieldIdentifier();
        UpdateAssets();
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzInputOTP;

    private void SetElementDefault()
    {
        if (string.IsNullOrEmpty(Element))
            Element = "div";
    }

    private void UpdateAssets()
    {
        var assetUrls = ComponentAssetKeys
            .Select(key => RizzyUIConfig.Value.AssetUrls.TryGetValue(key, out var url) ? url : null)
            .Where(url => !string.IsNullOrEmpty(url))
            .ToList();

        _assets = JsonSerializer.Serialize(assetUrls);
    }

    private void UpdateFieldIdentifier()
    {
        if (For is not null)
            _fieldIdentifier = FieldIdentifier.Create(For);
    }

    internal bool GetInvalidValue() => IsInvalid;

    internal string GetContainerClasses() => string.IsNullOrWhiteSpace(ContainerClass) ? (SlotClasses.GetBase() ?? string.Empty) : $"{SlotClasses.GetBase()} {ContainerClass}";

    internal string GetInputClasses() => string.IsNullOrWhiteSpace(Class) ? (SlotClasses.GetInput() ?? string.Empty) : $"{SlotClasses.GetInput()} {Class}";

    internal string GetNameAttribute() => string.IsNullOrWhiteSpace(Name) ? _fieldIdentifier.FieldName : Name;

    internal string GetInputModeValue() => InputMode ?? (OtpType == InputOtpType.Numeric ? "numeric" : "text");

    /// <summary>
    /// Defines the slots available for styling in the component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets classes for the root container.
        /// </summary>
        [Slot("input-otp")]
        public string? Base { get; set; }

        /// <summary>
        /// Gets or sets classes for the native hidden input.
        /// </summary>
        [Slot("input")]
        public string? Input { get; set; }
    }
}
