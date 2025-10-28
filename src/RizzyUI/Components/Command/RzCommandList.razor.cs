
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

public partial class RzCommandList : RzComponent<RzCommandList.Slots>
{
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto"
    );

    [CascadingParameter]
    protected RzCommand? ParentCommand { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentCommand == null)
            throw new InvalidOperationException($"{nameof(RzCommandList)} must be used within an {nameof(RzCommand)}.");
    }

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzCommandList;

    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}