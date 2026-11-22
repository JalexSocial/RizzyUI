using Microsoft.AspNetCore.Components;

namespace RizzyUI;

/// <summary>
/// The standard body rows of an <see cref="RzDataTable{TItem}"/> (Summit SF-056): one row per table row,
/// each cell rendered with its flex-render template, and optionally a selection checkbox cell. Place it in
/// <see cref="TableBody"/>; write the markup yourself for custom cells.
/// </summary>
public partial class DataTableBodyRows : ComponentBase;
