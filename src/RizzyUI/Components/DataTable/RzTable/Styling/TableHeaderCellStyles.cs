
using TailwindVariants.NET;

namespace RizzyUI;

public sealed partial class TableHeaderCellSlots : ISlots
{
    public string? Base { get; set; }
    public string? SortableButton { get; set; }
    public string? TitleSpan { get; set; }
    public string? SortIndicator { get; set; }
}

public static class TableHeaderCellStyles
{
    public static readonly TvDescriptor<RzComponent<TableHeaderCellSlots>, TableHeaderCellSlots> DefaultDescriptor = new(
        @base: "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        slots: new()
        {
            [s => s.SortableButton] = "flex items-center justify-between gap-2 w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background rounded-sm",
            [s => s.TitleSpan] = "flex-grow",
            [s => s.SortIndicator] = "size-4"
        },
        variants: new()
        {
            [c => ((IHasTableHeaderCellStylingProperties)c).Sortable] = new Variant<bool, TableHeaderCellSlots>
            {
                [true] = new() { [s => s.Base] = "cursor-pointer hover:bg-muted/50" }
            },
            [c => ((IHasTableHeaderCellStylingProperties)c).CurrentSortDirection] = new Variant<SortDirection, TableHeaderCellSlots>
            {
                [SortDirection.Ascending] = new() { [s => s.SortIndicator] = "text-foreground" },
                [SortDirection.Descending] = new() { [s => s.SortIndicator] = "text-foreground" },
                [SortDirection.Unset] = new() { [s => s.SortIndicator] = "text-muted-foreground opacity-60" }
            }
        }
    );
}