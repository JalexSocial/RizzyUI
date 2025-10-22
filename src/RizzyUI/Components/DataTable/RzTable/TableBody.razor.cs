
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

public partial class TableBody<TItem> : RzComponent<TableBodySlots>
{
    [CascadingParameter(Name = "ParentRzTable")]
    protected RzTable<TItem>? ParentRzTable { get; set; }

    [Parameter] public IEnumerable<TItem>? Items { get; set; }
    [Parameter, EditorRequired] public RenderFragment<TItem> RowTemplate { get; set; } = default!;
    [Parameter] public RenderFragment? EmptyTemplate { get; set; }

    protected IEnumerable<TItem> EffectiveItems => Items ?? ParentRzTable?.Items ?? Enumerable.Empty<TItem>();
    protected int ColumnCount => ParentRzTable?.ColumnCount ?? 1;
    protected string SpinnerId => $"{Id}-spinner";

    protected string? EffectiveHxIndicatorSelector
    {
        get
        {
            if (AdditionalAttributes?.TryGetValue("hx-indicator", out var indicator) == true && indicator is string indicatorStr)
            {
                return indicatorStr;
            }
            return ParentRzTable?.HxIndicatorSelector ?? $"#{SpinnerId}";
        }
    }

    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "tbody";

        if (ParentRzTable == null)
        {
            throw new InvalidOperationException($"{GetType().Name} must be used within an RzTable.");
        }
        ParentRzTable.RegisterTableBodyId(Id);

        AdditionalAttributes ??= new Dictionary<string, object>();
        AdditionalAttributes[$"data-rztable-body-for"] = ParentRzTable.Id;
    }

    protected override TvDescriptor<RzComponent<TableBodySlots>, TableBodySlots> GetDescriptor() => Theme.TableBody;
}