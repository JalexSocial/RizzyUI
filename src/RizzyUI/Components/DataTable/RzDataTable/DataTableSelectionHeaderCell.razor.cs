using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Renders an opinionated selection header cell containing a select-all checkbox.
/// </summary>
public partial class DataTableSelectionHeaderCell : RzComponent<DataTableSelectionHeaderCell.Slots>
{
    /// <summary>
    /// Defines the default styling for the <see cref="DataTableSelectionHeaderCell"/> component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "w-10 text-center",
        slots: new()
        {
            [s => s.Content] = "flex items-center justify-center",
        }
    );

    /// <summary>
    /// Gets or sets whether selection applies to all rows or current page rows.
    /// </summary>
    [Parameter]
    public DataTableSelectionScope Scope { get; set; } = DataTableSelectionScope.Page;

    /// <summary>
    /// Gets or sets the ARIA label propagated to the select-all checkbox.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
        {
            Element = "th";
        }

        AdditionalAttributes ??= new Dictionary<string, object>();
        AdditionalAttributes.TryAdd("scope", "col");

        AriaLabel ??= Localizer["DataTableSelectAllCheckbox.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["DataTableSelectAllCheckbox.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.DataTableSelectionHeaderCell;

    /// <summary>
    /// Defines the slots available for styling in the <see cref="DataTableSelectionHeaderCell"/> component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the table header cell.
        /// </summary>
        [Slot("data-table-selection-header-cell")]
        public string? Base { get; set; }

        /// <summary>
        /// The slot for the checkbox layout wrapper.
        /// </summary>
        [Slot("content")]
        public string? Content { get; set; }
    }
}
