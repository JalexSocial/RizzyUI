
using Microsoft.AspNetCore.Components;
using Rizzy.Utility;
using TailwindVariants.NET;

namespace RizzyUI;

public partial class RzCommandGroup : RzComponent<RzCommandGroup.Slots>
{
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "overflow-hidden p-1 text-foreground",
        slots: new()
        {
            [s => s.Heading] = "px-2 py-1.5 text-xs font-medium text-muted-foreground"
        }
    );

    [Parameter]
    public string? Heading { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzCommandGroup;

    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
        public string? Heading { get; set; }
    }
}