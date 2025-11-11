
using Microsoft.AspNetCore.Components;
using Rizzy.Components.Form;
using TailwindVariants.NET;

namespace RizzyUI;

public partial class RadioGroupItem<TValue> : RzComponent<RadioGroupItemSlots>, IHasRadioGroupItemStylingProperties
{
    private RzInputRadioBase<TValue>? _elem;

    [Parameter] public TValue? Value { get; set; }

    protected override TvDescriptor<RzComponent<RadioGroupItemSlots>, RadioGroupItemSlots> GetDescriptor() => Theme.RadioGroupItem;
}