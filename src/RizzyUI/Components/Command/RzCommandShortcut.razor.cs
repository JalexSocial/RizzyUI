
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

public partial class RzCommandShortcut : RzComponent<RzCommandShortcut.Slots>
{
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "ml-auto text-xs tracking-widest text-muted-foreground"
    );

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzCommandShortcut;

    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}