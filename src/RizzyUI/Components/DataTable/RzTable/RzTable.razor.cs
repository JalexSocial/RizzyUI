using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Provides a composable table container for SSR-rendered table markup.
/// </summary>
public partial class RzTable : RzComponent<RzTableSlots>, IHasTableStylingProperties
{
    /// <summary>
    /// Gets or sets the content rendered inside the <c>table</c> element.
    /// </summary>
    [Parameter, EditorRequired] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether table chrome (border and rounded corners) should be applied.
    /// </summary>
    [Parameter] public bool Border { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the table header should be sticky.
    /// </summary>
    [Parameter] public bool FixedHeader { get; set; }

    /// <summary>
    /// Gets the unique identifier for the inner table element.
    /// </summary>
    public string TableId => $"{Id}-table";

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<RzTableSlots>, RzTableSlots> GetDescriptor() => Theme.RzTable;
}
