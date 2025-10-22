
using TailwindVariants.NET;

namespace RizzyUI;

public interface IHasTableStylingProperties
{
    public bool FixedHeader { get; }
}

public sealed partial class RzTableSlots : ISlots
{
    public string? Base { get; set; }
    public string? Table { get; set; }
    public string? Thead { get; set; }
    public string? Tfoot { get; set; }
}

public static class RzTableStyles
{
    public static readonly TvDescriptor<RzComponent<RzTableSlots>, RzTableSlots> DefaultDescriptor = new(
        @base: "relative w-full overflow-x-auto rounded-lg border",
        slots: new()
        {
            [s => s.Table] = "w-full caption-bottom text-sm",
            [s => s.Thead] = "[&_tr]:border-b",
            [s => s.Tfoot] = "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0"
        },
        variants: new()
        {
            [c => ((IHasTableStylingProperties)c).FixedHeader] = new Variant<bool, RzTableSlots>
            {
                [true] = new()
                {
                    [s => s.Base] = "relative overflow-y-auto",
                    [s => s.Thead] = "sticky top-0 z-10 bg-card",
                    [s => s.Tfoot] = "sticky bottom-0 z-10 bg-muted/50"
                }
            }
        }
    );
}