
using Blazicons;
using Microsoft.AspNetCore.Components;
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

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (Parent == null)
            throw new InvalidOperationException($"{GetType()} must be placed within an RzCheckboxGroup.");

        Element = "label";
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
        return TwMerge.Merge(AdditionalAttributes, Theme.RzCheckboxGroupItem.Label);
    }

    /// <summary> Gets the CSS class for icon visibility based on the checked state. </summary>
    /// <param name="isChecked">Current checked state.</param>
    /// <returns>CSS class string.</returns>
    protected string GetIconVisibilityCss(bool isChecked)
    {
        return Theme.RzCheckboxGroupItem.GetIconVisibilityCss(isChecked);
    }
}