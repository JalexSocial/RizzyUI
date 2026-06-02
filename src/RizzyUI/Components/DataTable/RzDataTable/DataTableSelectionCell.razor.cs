using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Renders an opinionated row-selection cell containing a row selection checkbox.
/// </summary>
public partial class DataTableSelectionCell : RzComponent<DataTableSelectionCell.Slots>
{
    /// <summary>
    /// Defines the default styling for the <see cref="DataTableSelectionCell"/> component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "w-10 text-center",
        slots: new()
        {
            [s => s.Content] = "flex items-center justify-center",
        }
    );

    /// <summary>
    /// Gets or sets the Alpine expression that resolves to the TanStack row object.
    /// </summary>
    [Parameter, EditorRequired]
    public string RowExpr { get; set; } = default!;

    /// <summary>
    /// Gets or sets the ARIA label propagated to the row checkbox.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
        {
            Element = "td";
        }

        AriaLabel ??= Localizer["DataTableRowSelectCheckbox.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["DataTableRowSelectCheckbox.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.DataTableSelectionCell;

    /// <summary>
    /// Defines the slots available for styling in the <see cref="DataTableSelectionCell"/> component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the table body cell.
        /// </summary>
        [Slot("data-table-selection-cell")]
        public string? Base { get; set; }

        /// <summary>
        /// The slot for the checkbox layout wrapper.
        /// </summary>
        [Slot("content")]
        public string? Content { get; set; }
    }
}
