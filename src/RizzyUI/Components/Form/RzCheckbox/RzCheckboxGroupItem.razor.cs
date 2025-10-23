
using Blazicons;
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines styling properties for a CheckboxGroupItem component.
/// </summary>
public interface IHasCheckboxGroupItemStylingProperties { }

/// <xmldoc>
///     Represents a single checkbox item within a <see cref="RzCheckboxGroup{TValue}" />.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzCheckboxGroupItem<TValue> : RzComponent<RzCheckboxGroupItemSlots>, IHasCheckboxGroupItemStylingProperties
{
    /// <summary>
    /// Gets or sets the parent <see cref="RzCheckboxGroup{TValue}"/> component.
    /// </summary>
    [CascadingParameter]
    public RzCheckboxGroup<TValue>? Parent { get; set; }

    /// <summary>
    /// Gets or sets the value associated with this checkbox item. This is a required parameter.
    /// </summary>
    [Parameter, EditorRequired]
    public TValue? Value { get; set; }

    /// <summary>
    /// Gets or sets the display title for this checkbox item. This is a required parameter.
    /// </summary>
    [Parameter, EditorRequired]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets optional child content displayed alongside the title.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets a custom Blazicon SVG icon to display when checked, overriding the parent group's icon if set.
    /// </summary>
    [Parameter]
    public SvgIcon? CheckedIcon { get; set; }

    /// <summary>
    /// Gets the effective icon to be displayed when the checkbox is checked.
    /// </summary>
    protected SvgIcon EffectiveCheckedIcon { get; private set; } = default!;

    private bool IsChecked
    {
        get => Parent != null && Parent.IsSelected(Value!);
        set
        {
            if (Parent != null)
                InvokeAsync(() => Parent.ToggleValueAsync(Value!, value));
        }
    }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (Parent == null)
            throw new InvalidOperationException($"{GetType()} must be placed within an RzCheckboxGroup.");

        if (string.IsNullOrEmpty(Element))
            Element = "label";

        SetEffectiveIcon();
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        if (Theme != null)
            SetEffectiveIcon();
    }

    private void SetEffectiveIcon()
    {
        EffectiveCheckedIcon = CheckedIcon ?? Parent?.CheckedIcon ?? MdiIcon.CheckBold;
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<RzCheckboxGroupItemSlots>, RzCheckboxGroupItemSlots> GetDescriptor() => Theme.RzCheckboxGroupItem;
}