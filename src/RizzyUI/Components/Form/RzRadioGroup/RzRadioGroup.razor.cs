
using Microsoft.AspNetCore.Components;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

public partial class RzRadioGroup<TValue> : RzComponent<RzRadioGroupSlots>, IHasRadioGroupStylingProperties
{
    [Parameter, EditorRequired] public Expression<Func<TValue>> For { get; set; } = default!;
    [Parameter] public TValue? Value { get; set; }
    [Parameter] public EventCallback<TValue> ValueChanged { get; set; }
    [Parameter] public RenderFragment? ChildContent { get; set; }

    protected override TvDescriptor<RzComponent<RzRadioGroupSlots>, RzRadioGroupSlots> GetDescriptor() => Theme.RzRadioGroup;
}