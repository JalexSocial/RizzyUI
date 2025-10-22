
using Blazicons;
using Microsoft.AspNetCore.Components;
using Rizzy.Utility;
using TailwindVariants.NET;

namespace RizzyUI;

public interface IHasRadioGroupItemStylingProperties { }

/// <xmldoc>
///     Represents a single radio button item within an <see cref="RzRadioGroup{TValue}" />.
///     Includes support for labels, descriptions, and icons.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzRadioGroupItem<TValue> : RzComponent<RzRadioGroupItemSlots>, IHasRadioGroupItemStylingProperties
{
    private RzInputRadio<TValue>? _radioRef;

    [CascadingParameter]
    public RzRadioGroup<TValue>? ParentRadioGroup { get; set; }

    [Parameter]
    public SvgIcon? Icon { get; set; }

    [Parameter, EditorRequired]
    public string Label { get; set; } = string.Empty;

    [Parameter]
    public TValue? Value { get; set; }

    [Parameter]
    public RenderFragment? Description { get; set; }

    [Parameter]
    public string RadioInputId { get; set; } = IdGenerator.UniqueId("rzrd");

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    public RzInputRadio<TValue> InputRadioRef => _radioRef ?? throw new InvalidOperationException("RzInputRadio reference is not set.");

    protected SvgIcon EffectiveCheckboxIcon { get; set; } = default!;

    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (ParentRadioGroup == null)
            throw new InvalidOperationException($"{GetType()} must be used within an RzRadioGroup.");

        EffectiveCheckboxIcon = ParentRadioGroup.CheckboxIcon;
        ParentRadioGroup.AddRadioItem(this);
    }

    protected override TvDescriptor<RzComponent<RzRadioGroupItemSlots>, RzRadioGroupItemSlots> GetDescriptor() => Theme.RzRadioGroupItem;
}