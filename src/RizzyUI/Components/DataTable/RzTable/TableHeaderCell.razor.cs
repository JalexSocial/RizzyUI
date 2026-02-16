
using Blazicons;
using Microsoft.AspNetCore.Components;
using Rizzy.Utility;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A component representing a header cell in a data table
/// </summary>
/// <typeparam name="TItem">The type of data item in the table</typeparam>
public partial class TableHeaderCell<TItem> : RzComponent<TableHeaderCellSlots>, IHasTableHeaderCellStylingProperties
{
    private string? _columnKeyInternal;
    private string? _effectiveHxGetUrl;
    private SortDirection _currentSortDirection = SortDirection.Unset;
    private SortDirection _nextSortDirection = SortDirection.Ascending;
    private string _ariaSortValue = "none";
    private string _sortButtonAriaLabel = string.Empty;

    /// <summary>
    /// Gets or sets the parent RzTable component that contains this header cell
    /// </summary>
    [CascadingParameter(Name = "ParentRzTable")]
    protected RzTable<TItem>? ParentRzTable { get; set; }

    /// <summary>
    /// Gets or sets the expression used to bind the column to a property of TItem
    /// </summary>
    [Parameter] public Expression<Func<TItem, object?>>? For { get; set; }

    /// <summary>
    /// Gets or sets the unique key for the column
    /// </summary>
    [Parameter] public string? ColumnKey { get; set; }

    /// <summary>
    /// Gets or sets whether the column can be sorted
    /// </summary>
    [Parameter] public bool Sortable { get; set; }

    /// <summary>
    /// Gets or sets the initial sort direction for the column
    /// </summary>
    [Parameter] public SortDirection InitialSortDirection { get; set; } = SortDirection.Unset;

    /// <summary>
    /// Gets or sets the content to be displayed in the header cell
    /// </summary>
    [Parameter, EditorRequired] public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets additional HTMX attributes for the header cell
    /// </summary>
    [Parameter] public Dictionary<string, object>? HxAttributes { get; set; }

    /// <summary>
    /// Gets the effective column key used for identification.
    /// </summary>
    public string EffectiveColumnKey => _columnKeyInternal ?? "unknown_column";

    /// <summary>
    /// Gets the current sort direction of the column.
    /// </summary>
    public SortDirection CurrentSortDirection => _currentSortDirection;

    /// <summary>
    /// Gets the next sort direction that will be applied when the header is clicked
    /// </summary>
    protected SortDirection NextSortDirection => _nextSortDirection;

    /// <summary>
    /// Gets the ARIA sort value for accessibility
    /// </summary>
    protected string AriaSortValue => _ariaSortValue;

    /// <summary>
    /// Gets the ARIA label for the sort button
    /// </summary>
    protected string SortButtonAriaLabel => _sortButtonAriaLabel;

    /// <summary>
    /// Gets the appropriate sort indicator icon based on the current sort direction
    /// </summary>
    protected SvgIcon? SortIndicatorIcon => _currentSortDirection switch
    {
        SortDirection.Ascending => MdiIcon.ArrowUp,
        SortDirection.Descending => MdiIcon.ArrowDown,
        SortDirection.Unset => MdiIcon.ArrowUpDownBoldOutline,
        _ => null
    };

    /// <summary>
    /// Initializes the component and validates its parent context
    /// </summary>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentRzTable == null)
        {
            throw new InvalidOperationException($"{GetType().Name} must be used within an RzTable.");
        }

        if (string.IsNullOrEmpty(Element))
            Element = "th";

        AdditionalAttributes ??= new Dictionary<string, object>();
        AdditionalAttributes.TryAdd("scope", "col");

        ResolveColumnKeyAndRegister();
    }

    /// <summary>
    /// Updates the component when parameters are set
    /// </summary>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        UpdateSortStateAndHxUrl();
    }

    private void ResolveColumnKeyAndRegister()
    {
        string resolvedKey;
        if (!string.IsNullOrWhiteSpace(ColumnKey))
        {
            resolvedKey = ColumnKey;
        }
        else if (For?.Body is MemberExpression memberExpression)
        {
            resolvedKey = memberExpression.Member.Name;
        }
        else if (For?.Body is UnaryExpression { Operand: MemberExpression unaryMemberExpression })
        {
            resolvedKey = unaryMemberExpression.Member.Name;
        }
        else
        {
            resolvedKey = ChildContent.AsMarkupString().Trim().Replace(" ", "_") + "_" + IdGenerator.UniqueId("col");
            if (string.IsNullOrWhiteSpace(resolvedKey) || resolvedKey.StartsWith("_"))
            {
                resolvedKey = IdGenerator.UniqueId("col_anon_");
            }
        }
        _columnKeyInternal = resolvedKey;

        ParentRzTable!.AddColumnDefinition(new ColumnDefinition<TItem>(
            EffectiveColumnKey,
            ChildContent,
            Sortable,
            InitialSortDirection,
            For
        ));
    }

    private void UpdateSortStateAndHxUrl()
    {
        if (ParentRzTable == null) return;

        var currentRequest = ParentRzTable.CurrentTableRequest;
        _currentSortDirection = SortDirection.Unset;
        _nextSortDirection = Sortable ? (InitialSortDirection != SortDirection.Unset ? InitialSortDirection : SortDirection.Ascending) : SortDirection.Unset;
        _ariaSortValue = "none";
        _sortButtonAriaLabel = string.Format(Localizer["RzTable.SortButtonAriaLabelFormat"], ChildContent.AsMarkupString(), Localizer["RzTable.SortDirectionNone"]);

        if (Sortable && !string.IsNullOrWhiteSpace(_columnKeyInternal))
        {
            if (currentRequest.SortBy == _columnKeyInternal)
            {
                if (currentRequest.SortDir?.ToLowerInvariant() == "asc")
                {
                    _currentSortDirection = SortDirection.Ascending;
                    _nextSortDirection = SortDirection.Descending;
                    _ariaSortValue = "ascending";
                    _sortButtonAriaLabel = string.Format(Localizer["RzTable.SortButtonAriaLabelFormat"], ChildContent.AsMarkupString(), Localizer["RzTable.SortDirectionAscendingLong"]);
                }
                else if (currentRequest.SortDir?.ToLowerInvariant() == "desc")
                {
                    _currentSortDirection = SortDirection.Descending;
                    _nextSortDirection = SortDirection.Unset;
                    _ariaSortValue = "descending";
                    _sortButtonAriaLabel = string.Format(Localizer["RzTable.SortButtonAriaLabelFormat"], ChildContent.AsMarkupString(), Localizer["RzTable.SortDirectionDescendingLong"]);
                }
            }
            else
            {
                if (InitialSortDirection != SortDirection.Unset && string.IsNullOrEmpty(currentRequest.SortBy))
                {
                    _currentSortDirection = InitialSortDirection;
                    _ariaSortValue = InitialSortDirection == SortDirection.Ascending ? "ascending" : "descending";
                }
            }

            TableRequestModel nextRequestParameters;
            if (_nextSortDirection == SortDirection.Unset)
            {
                nextRequestParameters = currentRequest with { SortBy = null, SortDir = null, Page = 1 };
            }
            else
            {
                nextRequestParameters = currentRequest with
                {
                    SortBy = _columnKeyInternal,
                    SortDir = _nextSortDirection == SortDirection.Ascending ? "asc" : "desc",
                    Page = 1
                };
            }
            _effectiveHxGetUrl = string.IsNullOrEmpty(ParentRzTable.HxControllerUrl)
                ? null
                : $"{ParentRzTable.HxControllerUrl}{nextRequestParameters.ToQueryString()}";
        }
        else
        {
            _effectiveHxGetUrl = null;
        }
    }

    /// <summary>
    /// Gets the effective HTMX attributes for the header cell, including sorting functionality
    /// </summary>
    /// <returns>A dictionary containing the HTMX attributes</returns>
    protected Dictionary<string, object> GetEffectiveHxAttributes()
    {
        var defaultAttributes = new Dictionary<string, object>();
        if (Sortable && !string.IsNullOrEmpty(_effectiveHxGetUrl) && ParentRzTable != null)
        {
            defaultAttributes["hx-get"] = _effectiveHxGetUrl;
            defaultAttributes["hx-target"] = ParentRzTable.EffectiveHxTargetSelector;
            defaultAttributes["hx-swap"] = ParentRzTable.HxSwapMode;
            if (!string.IsNullOrEmpty(ParentRzTable.HxIndicatorSelector))
            {
                defaultAttributes["hx-indicator"] = ParentRzTable.HxIndicatorSelector;
            }
        }

        if (HxAttributes != null)
        {
            foreach (var attr in HxAttributes)
            {
                defaultAttributes[attr.Key] = attr.Value;
            }
        }
        return defaultAttributes;
    }

    /// <summary>
    /// Gets the theme descriptor for the table header cell
    /// </summary>
    /// <returns>The theme descriptor for styling the component</returns>
    protected override TvDescriptor<RzComponent<TableHeaderCellSlots>, TableHeaderCellSlots> GetDescriptor() => Theme.TableHeaderCell;
}
