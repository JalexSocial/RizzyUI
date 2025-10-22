
using TailwindVariants.NET;

namespace RizzyUI;

public sealed partial class RzRadioGroupItemSlots : ISlots
{
    public string? Base { get; set; }
    public string? RadioInput { get; set; }
    public string? IconContainer { get; set; }
    public string? ClickableContainer { get; set; }
    public string? ContentWrapper { get; set; }
    public string? LeadingIconContainer { get; set; }
    public string? TextContainer { get; set; }
    public string? LabelText { get; set; }
    public string? DescriptionText { get; set; }
}

public static class RzRadioGroupItemStyles
{
    public static readonly TvDescriptor<RzComponent<RzRadioGroupItemSlots>, RzRadioGroupItemSlots> DefaultDescriptor = new(
        @base: "flex items-center gap-2 cursor-pointer",
        slots: new()
        {
            [s => s.RadioInput] = "appearance-none peer absolute",
            [s => s.IconContainer] = "relative size-4 shrink-0 rounded-full border border-input shadow-xs text-primary focus-visible:border-ring focus-visible:ring-ring/50 peer-checked:border-primary peer-checked:before:bg-primary peer-checked:before:content-[''] peer-checked:before:absolute peer-checked:before:top-1/2 peer-checked:before:left-1/2 peer-checked:before:-translate-x-1/2 peer-checked:before:-translate-y-1/2 peer-checked:before:size-2 peer-checked:before:rounded-full dark:bg-input/30 dark:peer-checked:border-primary dark:peer-checked:before:bg-primary",
            [s => s.ClickableContainer] = "flex-1",
            [s => s.ContentWrapper] = "flex items-center gap-2",
            [s => s.LeadingIconContainer] = "text-muted-foreground size-4",
            [s => s.TextContainer] = "grid gap-0.5",
            [s => s.LabelText] = "font-normal text-sm peer-disabled:opacity-50",
            [s => s.DescriptionText] = "text-xs text-muted-foreground peer-disabled:opacity-50"
        }
    );
}