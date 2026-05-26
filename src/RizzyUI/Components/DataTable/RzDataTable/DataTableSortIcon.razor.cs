using Blazicons;
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Renders a sort direction indicator driven by DataTable Alpine sort helpers.
/// </summary>
public partial class DataTableSortIcon : RzComponent<DataTableSortIcon.Slots>
{
    /// <summary>
    /// Defines the default styling for the <see cref="DataTableSortIcon"/> component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline-flex items-center text-muted-foreground",
        slots: new()
        {
            [s => s.Ascending] = "inline-flex",
            [s => s.Descending] = "inline-flex",
            [s => s.Unsorted] = "inline-flex",
        }
    );

    /// <summary>
    /// Gets or sets the Alpine expression that resolves to the TanStack header object.
    /// </summary>
    [Parameter, EditorRequired]
    public string HeaderExpr { get; set; } = default!;

    /// <summary>
    /// Gets or sets the icon rendered when sorting direction is ascending.
    /// </summary>
    [Parameter]
    public SvgIcon AscendingIcon { get; set; } = Lucide.ArrowUp;

    /// <summary>
    /// Gets or sets the icon rendered when sorting direction is descending.
    /// </summary>
    [Parameter]
    public SvgIcon DescendingIcon { get; set; } = Lucide.ArrowDown;

    /// <summary>
    /// Gets or sets the icon rendered when no sort direction is active.
    /// </summary>
    [Parameter]
    public SvgIcon UnsortedIcon { get; set; } = Lucide.ArrowUpDown;

    private string CanExpr => $"sort.can({HeaderExpr})";
    private string AscExpr => $"sort.direction({HeaderExpr}) === 'asc'";
    private string DescExpr => $"sort.direction({HeaderExpr}) === 'desc'";
    private string NoneExpr => $"!sort.direction({HeaderExpr})";

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
        {
            Element = "span";
        }
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.DataTableSortIcon;

    /// <summary>
    /// Defines the slots available for styling in the <see cref="DataTableSortIcon"/> component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the icon container.
        /// </summary>
        [Slot("data-table-sort-icon")]
        public string? Base { get; set; }

        /// <summary>
        /// The slot for ascending icon content.
        /// </summary>
        [Slot("ascending")]
        public string? Ascending { get; set; }

        /// <summary>
        /// The slot for descending icon content.
        /// </summary>
        [Slot("descending")]
        public string? Descending { get; set; }

        /// <summary>
        /// The slot for unsorted icon content.
        /// </summary>
        [Slot("unsorted")]
        public string? Unsorted { get; set; }
    }
}
