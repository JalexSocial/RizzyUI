
using Blazicons;
using Microsoft.AspNetCore.Components;
using Rizzy.Utility;

// For RzInputRadio
// For IdGenerator

namespace RizzyUI;

/// <xmldoc>
///     Represents a single radio button item within an <see cref="RzRadioGroup{TValue}" />.
///     Includes support for labels, descriptions, and icons.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzRadioGroupItem<TValue> : RzComponent
{
    /// <summary> Gets the parent radio group. </summary>
    [CascadingParameter]
    public RzRadioGroup<TValue>? ParentRadioGroup { get; set; }

    /// <summary> Gets or sets the Blazicon SVG icon displayed next to the label (optional). </summary>
    [Parameter]
    public SvgIcon? Icon { get; set; }

    /// <summary> Gets or sets the main text label for the radio item. Required. </summary>
    [Parameter]
    [EditorRequired]
    public string Label { get; set; } = string.Empty;

    /// <summary> Gets or sets the value associated with this radio item. </summary>
    [Parameter]
    public TValue? Value { get; set; }

    /// <summary> Gets or sets optional descriptive text displayed below the label. </summary>
    [Parameter]
    public RenderFragment? Description { get; set; }

    /// <summary> Gets or sets the unique ID for the radio input element. Defaults to a generated ID. </summary>
    [Parameter]
    public string Id { get; set; } = IdGenerator.UniqueId("rzrd");

    /// <summary> Optional child content rendered within the text container. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary> The effective icon used for the checkmark, determined by the parent group. </summary>
    protected SvgIcon EffectiveCheckboxIcon { get; set; } = default!;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (ParentRadioGroup == null)
            throw new InvalidOperationException($"{GetType()} must be used within an RzRadioGroup.");

        EffectiveCheckboxIcon = ParentRadioGroup.CheckboxIcon; // Get icon from parent
        ParentRadioGroup.AddRadioItem(this); // Register with parent
    }

    // No RootClass needed as the root is the label with styles applied directly
}