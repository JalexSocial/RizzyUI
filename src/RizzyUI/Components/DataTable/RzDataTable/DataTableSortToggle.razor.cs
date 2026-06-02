using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Renders a sort toggle button for a DataTable header using Alpine expression bindings.
/// </summary>
public partial class DataTableSortToggle : RzComponent<DataTableSortToggle.Slots>
{
    /// <summary>
    /// Defines the default styling for the <see cref="DataTableSortToggle"/> component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline-flex items-center gap-2 font-medium",
        slots: new()
        {
            [s => s.Label] = "truncate",
        }
    );

    /// <summary>
    /// Gets or sets the Alpine expression that resolves to the TanStack header object.
    /// </summary>
    [Parameter, EditorRequired]
    public string HeaderExpr { get; set; } = default!;

    /// <summary>
    /// Gets or sets whether the default header label should be rendered when <see cref="ChildContent"/> is null.
    /// </summary>
    [Parameter]
    public bool RenderLabel { get; set; } = true;

    /// <summary>
    /// Gets or sets whether the sort icon helper should be rendered.
    /// </summary>
    [Parameter]
    public bool RenderIcon { get; set; } = true;

    /// <summary>
    /// Gets or sets the optional custom child content for the toggle body.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    private string HeaderFlexExpr => $"_flex.header({HeaderExpr})";
    private string DisabledExpr => $"!sort.can({HeaderExpr})";
    private string AriaLabelExpr => $"sort.nextLabel({HeaderExpr})";
    private string DirectionExpr => $"sort.direction({HeaderExpr}) || 'none'";
    private string ClickExpr => $"sort.toggle({HeaderExpr})";

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
        {
            Element = "button";
        }

        AdditionalAttributes ??= new Dictionary<string, object>();
        AdditionalAttributes.TryAdd("type", "button");
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.DataTableSortToggle;

    /// <summary>
    /// Defines the slots available for styling in the <see cref="DataTableSortToggle"/> component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the toggle button.
        /// </summary>
        [Slot("data-table-sort-toggle")]
        public string? Base { get; set; }

        /// <summary>
        /// The label slot for the flex-rendered header text.
        /// </summary>
        [Slot("label")]
        public string? Label { get; set; }
    }
}
