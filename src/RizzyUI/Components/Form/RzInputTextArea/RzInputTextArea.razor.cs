
using Microsoft.AspNetCore.Components;
using Rizzy.Components.Form;
using TailwindVariants.NET;

namespace RizzyUI;

public partial class RzInputTextArea : InputBase<string, RzInputTextArea.Slots>
{
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        extends: FormInputStyles.DefaultDescriptor,
        @base: "flex field-sizing-content min-h-16 resize-none"
    );

    private RzInputTextAreaBase? _elem;

    [Parameter] public string? Placeholder { get; set; }

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzInputTextArea;

    public new sealed partial class Slots : ISlots
    {
        [Slot("textarea")]
        public string? Base { get; set; }
    }
}