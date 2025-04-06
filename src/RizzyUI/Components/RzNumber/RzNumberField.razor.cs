using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using System.Linq.Expressions;
using Blazicons;
using RizzyUI.Extensions;
using RizzyUI.Styling;
using Microsoft.AspNetCore.Components.Forms; // For EditContext
using System.Collections.Generic;
using System.Linq;

namespace RizzyUI;

/// <xmldoc>
/// Represents a complete form field for number input, including a label, the input itself (<see cref="RzNumberEdit{TValue}"/>),
/// optional help text, and validation message integration. Leverages <see cref="RzField"/> for structure.
/// Styling is determined by the active <see cref="RzTheme"/>.
/// </xmldoc>
public partial class RzNumberField<TValue> : RzComponent
{
    /// <summary> Get the currently active theme via Cascading Parameter. </summary>
    [CascadingParameter] protected RzTheme? CascadedTheme { get; set; }
    /// <summary> Gets the current edit context. </summary>
    [CascadingParameter] private EditContext? EditContext { get; set; }
    /// <summary> Injected configuration to get the default theme as fallback. </summary>
    [Inject] private IOptions<RizzyUIConfig>? Config { get; set; }
    /// <summary> The effective theme being used (Cascaded or Default). </summary>
    protected RzTheme Theme { get; set; } = default!;

    /// <summary> Specifies the field the number input is bound to. Required. </summary>
    [Parameter, EditorRequired] public Expression<Func<TValue>>? For { get; set; } = default!;
    /// <summary> Gets or sets optional text to prepend inside the input's visual container. </summary>
    [Parameter] public string? PrependText { get; set; }
    /// <summary> Gets or sets an optional Blazicon SVG icon to prepend inside the input's visual container. </summary>
    [Parameter] public SvgIcon? PrependIcon { get; set; }
    /// <summary> Gets or sets the placeholder text displayed in the input field. </summary>
    [Parameter] public string Placeholder { get; set; } = string.Empty;
    /// <summary> Gets or sets the display name for the field label. If not set, it's inferred from the 'For' expression. </summary>
    [Parameter] public string? DisplayName { get; set; }
    /// <summary> Gets or sets a value indicating whether the field is marked as required. Defaults to false. </summary>
    [Parameter] public bool Required { get; set; } = false;
    /// <summary> Gets or sets optional content displayed below the input as help text. </summary>
    [Parameter] public RenderFragment? FieldHelp { get; set; }

    /// <summary> Separates AdditionalAttributes intended for RzNumberEdit. </summary>
    protected Dictionary<string, object> InputAttributes => AdditionalAttributes?
        .Where(kvp => kvp.Key.ToLowerInvariant() != "class") // Exclude class from being passed down directly
        .ToDictionary(kvp => kvp.Key, kvp => kvp.Value) ?? new Dictionary<string, object>();

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Theme = CascadedTheme ?? Config?.Value.DefaultTheme ?? RzTheme.Default;
        if (Theme == null)
            throw new InvalidOperationException($"{GetType()} requires a cascading RzTheme or a default theme configured.");
        if (For == null)
             throw new InvalidOperationException($"{GetType()} requires a value for the 'For' parameter.");
        if (EditContext == null)
            throw new InvalidOperationException($"{GetType()} must be used within an EditForm.");
    }

    /// <inheritdoc/>
    protected override string? RootClass() =>
        // Merge class attribute specifically for the RzField container
        TwMerge.Merge(AdditionalAttributes?.GetValueOrDefault("class")?.ToString(), Theme.RzNumberField.Field);
}

