
using TailwindVariants.NET;

namespace RizzyUI;

public sealed partial class TableBodySlots : ISlots
{
    public string? Base { get; set; }
}

public static class TableBodyStyles
{
    public static readonly TvDescriptor<RzComponent<TableBodySlots>, TableBodySlots> DefaultDescriptor = new(
        @base: "[&_tr:last-child]:border-0"
    );
}