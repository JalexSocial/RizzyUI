
using TailwindVariants.NET;

namespace RizzyUI;

public sealed partial class TableRowSlots : ISlots
{
    public string? Base { get; set; }
}

public static class TableRowStyles
{
    public static readonly TvDescriptor<RzComponent<TableRowSlots>, TableRowSlots> DefaultDescriptor = new(
        @base: "border-b transition-colors",
        variants: new()
        {
            [c => ((IHasTableRowStylingProperties)c).IsEven] = new Variant<bool, TableRowSlots>
            {
                [true] = "bg-secondary",
                [false] = "bg-background"
            },
            [c => ((IHasTableRowStylingProperties)c).IsHoverable] = new Variant<bool, TableRowSlots>
            {
                [true] = "hover:bg-muted/50"
            }
        }
    );
}