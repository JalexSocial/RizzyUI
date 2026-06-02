using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Renders a row-selection checkbox bound to a runtime Alpine row expression.
/// </summary>
public partial class DataTableRowSelectCheckbox : RzComponent<DataTableRowSelectCheckbox.Slots>
{
    /// <summary>
    /// Defines the default styling for the <see cref="DataTableRowSelectCheckbox"/> component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "size-4 rounded border-border align-middle"
    );

    /// <summary>
    /// Gets or sets the Alpine expression that resolves to the TanStack row object.
    /// </summary>
    [Parameter, EditorRequired]
    public string RowExpr { get; set; } = default!;

    /// <summary>
    /// Gets or sets the ARIA label for the checkbox.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    private string CheckedExpr => $"selection.isSelected({RowExpr})";
    private string DisabledExpr => $"!selection.canSelect({RowExpr})";
    private string IndeterminateExpr => $"$el.indeterminate = selection.isSomeSelected({RowExpr}) && !selection.isSelected({RowExpr})";
    private string ChangeExpr => $"selection.setRowSelected({RowExpr}, $event.target.checked)";

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

        AriaLabel ??= Localizer["DataTableRowSelectCheckbox.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["DataTableRowSelectCheckbox.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.DataTableRowSelectCheckbox;

    /// <summary>
    /// Defines the slots available for styling in the <see cref="DataTableRowSelectCheckbox"/> component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the checkbox.
        /// </summary>
        [Slot("data-table-row-select-checkbox")]
        public string? Base { get; set; }
    }
}
