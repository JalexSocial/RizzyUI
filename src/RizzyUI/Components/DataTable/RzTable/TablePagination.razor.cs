using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Provides a wrapper region for table pagination controls.
/// </summary>
public partial class TablePagination : RzComponent<TablePaginationSlots>
{
    /// <summary>
    /// Gets or sets content rendered inside the pagination wrapper.
    /// </summary>
    [Parameter, EditorRequired] public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override string DefaultElement => "div";

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<TablePaginationSlots>, TablePaginationSlots> GetDescriptor() => Theme.TablePagination;
}
