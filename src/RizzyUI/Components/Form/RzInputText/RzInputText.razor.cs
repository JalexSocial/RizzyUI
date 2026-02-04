
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

public partial class RzInputText : InputBase<string, RzInputText.Slots>
{
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor =
        new(extends: FormInputStyles.DefaultDescriptor);

    private RzInputTextBase? _elem;

    [Parameter] public TextRole Role { get; set; } = TextRole.Text;
    [Parameter] public string? Placeholder { get; set; }

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzInputText;

    public sealed partial class Slots : ISlots
    {
        [Slot("input")]
        public string? Base { get; set; }
    }
}