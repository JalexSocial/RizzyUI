
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

public partial class RzCommandEmpty : RzComponent<RzCommandEmpty.Slots>
{
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "py-6 text-center text-sm"
    );

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzCommandEmpty;

    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}