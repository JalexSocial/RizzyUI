using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Renders a select-all checkbox for DataTable row selection.
/// </summary>
public partial class DataTableSelectAllCheckbox : RzComponent<DataTableSelectAllCheckbox.Slots>
{
    /// <summary>
    /// Defines the default styling for the <see cref="DataTableSelectAllCheckbox"/> component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "size-4 rounded border-border align-middle"
    );

    /// <summary>
    /// Gets or sets whether the checkbox acts on all rows or only the current page.
    /// </summary>
    [Parameter]
    public DataTableSelectionScope Scope { get; set; } = DataTableSelectionScope.Page;

    /// <summary>
    /// Gets or sets the ARIA label for the checkbox.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    private string DisabledExpr => "!hasRows";

    private string CheckedExpr => Scope == DataTableSelectionScope.All
        ? "selection.allRowsSelected()"
        : "selection.allPageRowsSelected()";

    private string IndeterminateExpr => Scope == DataTableSelectionScope.All
        ? "$el.indeterminate = selection.someRowsSelected() && !selection.allRowsSelected()"
        : "$el.indeterminate = selection.somePageRowsSelected() && !selection.allPageRowsSelected()";

    private string ChangeExpr => Scope == DataTableSelectionScope.All
        ? "selection.setAllRows($event.target.checked)"
        : "selection.setAllPageRows($event.target.checked)";

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
        {
            Element = "input";
        }

        AdditionalAttributes ??= new Dictionary<string, object>();
        AdditionalAttributes.TryAdd("type", "checkbox");

        AriaLabel ??= Localizer["DataTableSelectAllCheckbox.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["DataTableSelectAllCheckbox.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.DataTableSelectAllCheckbox;

    /// <summary>
    /// Defines the slots available for styling in the <see cref="DataTableSelectAllCheckbox"/> component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the checkbox.
        /// </summary>
        [Slot("data-table-select-all-checkbox")]
        public string? Base { get; set; }
    }
}
