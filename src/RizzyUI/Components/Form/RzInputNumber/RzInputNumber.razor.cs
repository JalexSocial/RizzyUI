
using Microsoft.AspNetCore.Components;
using Rizzy.Components.Form;
using TailwindVariants.NET;

namespace RizzyUI;

public partial class RzInputNumber<TValue> : InputBase<TValue, RzInputNumberSlots>, IHasInputNumberStylingProperties
{
    private RzInputNumberBase<TValue>? _elem;

    [Parameter] public string? Placeholder { get; set; }

    protected override TvDescriptor<RzComponent<RzInputNumberSlots>, RzInputNumberSlots> GetDescriptor() => Theme.RzInputNumber;
}