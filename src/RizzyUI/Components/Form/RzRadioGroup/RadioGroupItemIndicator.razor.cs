using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

public partial class RadioGroupItemIndicator : RzComponent<RadioGroupItemIndicator.Slots>
{
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "relative flex size-4 shrink-0 items-center justify-center rounded-full border border-input bg-background group-has-[.peer:focus-visible]:ring-2 group-has-[.peer:focus-visible]:ring-ring group-has-[.peer:focus-visible]:ring-offset-2 group-has-[.peer:checked]:border-primary",
        slots: new()
        {
            [s => s.Dot] = "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rounded-full bg-primary opacity-0 transition-opacity group-has-[.peer:checked]:opacity-100",
            [s => s.CustomContentWrapper] = "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity group-has-[.peer:checked]:opacity-100"
        }
    );

    [CascadingParameter] private IRadioGroupItem? ParentItem { get; set; }
    [CascadingParameter(Name = "ShowIndicators")] private bool ShowIndicators { get; set; } = true;

    /// <summary>
    /// Gets or sets the custom content to be rendered inside the indicator when the item is checked.
    /// If not provided, a default dot will be rendered.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    protected override void OnInitialized()
    {
        base.OnInitialized();
        ParentItem?.RegisterIndicator();
    }

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RadioGroupItemIndicator;

    public sealed partial class Slots : ISlots
    {
        [Slot("indicator-wrapper")]
        public string? Base { get; set; }

        [Slot("indicator")]
        public string? Dot { get; set; }

        [Slot("custom-indicator")]
        public string? CustomContentWrapper { get; set; }
    }
}