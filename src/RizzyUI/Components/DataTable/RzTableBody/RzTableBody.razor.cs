
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using System.Collections.Generic;
using System.Linq;

namespace RizzyUI;

/// <xmldoc>
/// Represents the body (&lt;tbody>) of an RzTable. It's responsible for rendering rows based on the provided data
/// and templates. It infers its item type and data source from a parent RzTable if not explicitly provided.
/// It also registers its ID with the parent RzTable and adds a data-attribute for fallback targeting.
/// </xmldoc>
public partial class RzTableBody<TItem> : RzComponent
{
    /// <summary>
    /// Cascaded parent RzTable instance.
    /// </summary>
    [CascadingParameter(Name = "ParentRzTable")]
    protected RzTable<TItem>? ParentRzTable { get; set; }

    /// <summary>
    /// Optional. The collection of items to display in the table body.
    /// If not provided, it will attempt to use the Items collection cascaded
    /// from the ParentRzTable.
    /// </summary>
    [Parameter] public IEnumerable<TItem>? Items { get; set; }

    /// <summary>
    /// Required. The template for rendering each row in the table body.
    /// The context of the RenderFragment is an instance of TItem.
    /// </summary>
    [Parameter, EditorRequired] public RenderFragment<TItem> RowTemplate { get; set; } = default!;

    /// <summary>
    /// Optional. The template to display when there are no items to render in the table body.
    /// If not provided, a default message will be shown.
    /// </summary>
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
        Element = "tbody"; 

        if (ParentRzTable == null)
        {
            throw new InvalidOperationException($"{GetType().Name} must be used within an RzTable.");
        }
        ParentRzTable.RegisterTableBodyId(Id);

        // Add data-attribute for fallback targeting
        AdditionalAttributes ??= new Dictionary<string, object>();
        AdditionalAttributes[$"data-rztable-body-for"] = ParentRzTable.Id;
    }
    
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzTableBody.TableBody);
    }
}