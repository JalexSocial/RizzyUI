using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents the body (&lt;tbody&gt;) of an RzTable. It's responsible for rendering rows based on the provided data
/// and templates. It infers its item type and data source from a parent RzTable if not explicitly provided.
/// It also registers its ID with the parent RzTable and adds a data-attribute for fallback targeting.
/// </summary>
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

    /// <summary>
    /// Gets the effective collection of items to display in the table body.
    /// Uses the Items parameter if provided, otherwise falls back to the parent RzTable's Items,
    /// or returns an empty collection if neither is available.
    /// </summary>
    protected IEnumerable<TItem> EffectiveItems => Items ?? ParentRzTable?.Items ?? Enumerable.Empty<TItem>();

    /// <summary>
    /// Gets the number of columns in the table.
    /// Uses the parent RzTable's ColumnCount if available, or defaults to 1.
    /// </summary>
    protected int ColumnCount => ParentRzTable?.ColumnCount ?? 1;

    /// <summary>
    /// Gets the ID to use for the loading spinner element.
    /// Constructed by appending "-spinner" to the component's ID.
    /// </summary>
    protected string SpinnerId => $"{Id}-spinner";

    /// <summary>
    /// Gets the effective HX indicator selector to use for HTMX loading indicators.
    /// Prioritizes any explicitly set "hx-indicator" in AdditionalAttributes,
    /// then falls back to ParentRzTable's HxIndicatorSelector,
    /// and finally uses a selector targeting this component's spinner by ID.
    /// </summary>
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

    /// <summary>
    /// Initializes the component by setting the HTML element to "tbody",
    /// verifying it's within an RzTable parent, registering its ID with the parent,
    /// and adding data attributes for HTMX targeting.
    /// </summary>
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

        // Add data-attribute for fallback targeting
        AdditionalAttributes ??= new Dictionary<string, object>();
        AdditionalAttributes[$"data-rztable-body-for"] = ParentRzTable.Id;
    }

    /// <summary>
    /// Determines the CSS classes to apply to the root element by merging theme-based
    /// table body styles with any additional class attributes.
    /// </summary>
    /// <returns>A string containing the merged CSS classes.</returns>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzTableBody.TableBody);
    }
}
