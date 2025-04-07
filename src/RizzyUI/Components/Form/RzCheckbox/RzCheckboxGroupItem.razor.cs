using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Represents a single checkbox item within a <see cref="RzCheckboxGroup{TValue}" />.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzCheckboxGroupItem<TValue> : RzComponent
{
    /// <summary> Gets the parent checkbox group context. </summary>
    [CascadingParameter]
    public RzCheckboxGroup<TValue>? Parent { get; set; }

    /// <summary> Gets or sets the value associated with this checkbox item. Required. </summary>
    [Parameter]
    [EditorRequired]
    public TValue? Value { get; set; }

    /// <summary> Gets or sets the display title for this checkbox item. Required. </summary>
    [Parameter]
    [EditorRequired]
    public string Title { get; set; } = string.Empty;

    /// <summary> Gets or sets optional child content displayed alongside the title. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary> Gets or sets the custom Blazicon SVG icon to display when checked. Overrides the parent group's icon if set. </summary>
    [Parameter]
    public SvgIcon? CheckedIcon { get; set; }

    /// <summary> The actual icon to use, considering the parameter and the parent group's setting. </summary>
    protected SvgIcon EffectiveCheckedIcon { get; private set; } = default!;

    /// <summary> Gets or sets the checked state, bound to the parent group's selection. </summary>
    private bool IsChecked
    {
        get => Parent != null && Parent.IsSelected(Value!);
        set
        {
            if (Parent != null)
                // Invoke the parent's toggle method asynchronously
                InvokeAsync(() => Parent.ToggleValueAsync(Value!, value));
        }
    }

    // --- Style Properties derived from Theme ---
    /// <summary> Gets the computed CSS classes for the label element. </summary>
    protected string LabelClass => Theme.RzCheckboxGroupItem.Label;

    /// <summary> Gets the computed CSS classes for the checkbox wrapper div. </summary>
    protected string CheckboxWrapperClass => Theme.RzCheckboxGroupItem.CheckboxWrapper;

    /// <summary> Gets the computed CSS classes for the checkbox input element. </summary>
    protected string CheckboxInputClass => Theme.RzCheckboxGroupItem.CheckboxInput;

    /// <summary> Gets the computed CSS classes for the icon container div. </summary>
    protected string IconContainerClass => Theme.RzCheckboxGroupItem.IconContainer;

    /// <summary> Gets the computed CSS classes for the title span. </summary>
    protected string TitleSpanClass => Theme.RzCheckboxGroupItem.TitleSpan;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        
        if (Parent == null)
            throw new InvalidOperationException($"{GetType()} must be placed within an RzCheckboxGroup.");

        Element = "label"; // The root element is a label for accessibility
        SetEffectiveIcon();
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        // Update icon if parameter changes
        if (Theme != null) // Ensure theme is set before accessing Parent
            SetEffectiveIcon();
    }

    private void SetEffectiveIcon()
    {
        EffectiveCheckedIcon = CheckedIcon ?? Parent?.CheckedIcon ?? MdiIcon.CheckBold; // Fallback chain
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, LabelClass);
    }

    /// <summary> Gets the CSS class for icon visibility based on the checked state. </summary>
    /// <param name="isChecked">Current checked state.</param>
    /// <returns>CSS class string.</returns>
    protected string GetIconVisibilityCss(bool isChecked)
    {
        return Theme.RzCheckboxGroupItem.GetIconVisibilityCss(isChecked);
    }
}