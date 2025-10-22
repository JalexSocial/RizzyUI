
using TailwindVariants.NET;

namespace RizzyUI;

public sealed partial class TableCellSlots : ISlots
{
    public string? Base { get; set; }
}

public static class TableCellStyles
{
    public static readonly TvDescriptor<RzComponent<TableCellSlots>, TableCellSlots> DefaultDescriptor = new(
        @base: "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
    );
}