using Microsoft.AspNetCore.Components;

namespace RizzyUI;

/// <summary>
/// The standard header rows of an <see cref="RzDataTable{TItem}"/> (Summit SF-056): one row per header
/// group, each header rendered with its flex-render template, a sort toggle and <c>aria-sort</c>, and
/// optionally a select-all cell. Place it in <see cref="TableHeader"/>; write the markup yourself when a
/// header needs more (decision D-22 keeps the table headless).
/// </summary>
public partial class DataTableHeaderRows : ComponentBase;
