
using TailwindVariants.NET;

namespace RizzyUI;

public sealed partial class RzTabStripSlots : ISlots
{
    public string? Base { get; set; }
    public string? Marker { get; set; }
    public string? MarkerInner { get; set; }
}

public static class RzTabStripStyles
{
    public static readonly TvDescriptor<RzComponent<RzTabStripSlots>, RzTabStripSlots> DefaultDescriptor = new(
        @base: "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        slots: new()
        {
            [s => s.Marker] = "hidden",
            [s => s.MarkerInner] = ""
        },
        variants: new()
        {
            [c => ((IHasTabStripStylingProperties)c).SelectedTabUnderlineColor] = new Variant<SemanticColor, RzTabStripSlots>
            {
                [SemanticColor.Primary] = new() { [s => s.Marker] = "after:bg-primary" },
                [SemanticColor.Secondary] = new() { [s => s.Marker] = "after:bg-secondary" },
                [SemanticColor.Success] = new() { [s => s.Marker] = "after:bg-success" },
                [SemanticColor.Warning] = new() { [s => s.Marker] = "after:bg-warning" },
                [SemanticColor.Destructive] = new() { [s => s.Marker] = "after:bg-destructive" },
                [SemanticColor.Info] = new() { [s => s.Marker] = "after:bg-info" }
            }
        }
    );
}