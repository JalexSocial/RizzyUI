
using Blazicons;
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

public interface IHasCheckboxGroupItemStylingProperties { }

/// <xmldoc>
///     Represents a single checkbox item within a <see cref="RzCheckboxGroup{TValue}" />.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzCheckboxGroupItem<TValue> : RzComponent<RzCheckboxGroupItemSlots>, IHasCheckboxGroupItemStylingProperties
{
    [CascadingParameter]
    public RzCheckboxGroup<TValue>? Parent { get; set; }

    [Parameter, EditorRequired]
    public TValue? Value { get; set; }

    [Parameter, EditorRequired]
    public string Title { get; set; } = string.Empty;

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter]
    public SvgIcon? CheckedIcon { get; set; }

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

    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (Parent == null)
            throw new InvalidOperationException($"{GetType()} must be placed within an RzCheckboxGroup.");

        if (string.IsNullOrEmpty(Element))
            Element = "label";

        SetEffectiveIcon();
    }

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

    protected override TvDescriptor<RzComponent<RzCheckboxGroupItemSlots>, RzCheckboxGroupItemSlots> GetDescriptor() => Theme.RzCheckboxGroupItem;
}