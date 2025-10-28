
using Microsoft.AspNetCore.Components;
using System.Text.Json;
using TailwindVariants.NET;

namespace RizzyUI;

public partial class RzCommandItem : RzComponent<RzCommandItem.Slots>
{
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        slots: new()
        {
            [s => s.Active] = "bg-accent text-accent-foreground"
        }
    );

    private string _serializedKeywords = "[]";

    [CascadingParameter]
    protected RzCommand? ParentCommand { get; set; }

    [CascadingParameter]
    protected RzCommandGroup? ParentGroup { get; set; }

    [Parameter]
    public string? Value { get; set; }

    [Parameter]
    public IEnumerable<string> Keywords { get; set; } = Enumerable.Empty<string>();

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter]
    public bool Disabled { get; set; }

    [Parameter]
    public bool ForceMount { get; set; }

    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentCommand == null)
            throw new InvalidOperationException($"{nameof(RzCommandItem)} must be used within an {nameof(RzCommand)}.");
    }

    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        _serializedKeywords = JsonSerializer.Serialize(Keywords);
    }

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzCommandItem;

    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
        public string? Active { get; set; }
    }
}