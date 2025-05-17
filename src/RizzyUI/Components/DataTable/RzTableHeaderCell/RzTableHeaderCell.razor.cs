using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using Blazicons; 
using Rizzy.Utility;

namespace RizzyUI;

/// <summary>
/// Represents a header cell (&lt;th&gt;) in an RzTable.
/// It can define a column, enable sorting via HTMX, display sort direction indicators,
/// include ARIA attributes for accessibility, and conditionally render a border.
/// </summary>
public partial class RzTableHeaderCell<TItem> : RzComponent
{
    private string? _columnKeyInternal;
    private string? _effectiveHxGetUrl;
    private SortDirection _currentSortDirection = SortDirection.Unset;
    private SortDirection _nextSortDirection = SortDirection.Ascending;
    private string _ariaSortValue = "none";
    private string _sortButtonAriaLabel = string.Empty;

    /// <summary>
    /// Cascaded parent RzTable instance.
    /// </summary>
    [CascadingParameter(Name = "ParentRzTable")]
    protected RzTable<TItem>? ParentRzTable { get; set; }

    /// <summary>
    /// An expression that identifies the property of TItem this header cell is associated with.
    /// Used to determine the column key for sorting if `ColumnKey` is not explicitly set.
    /// For nested properties (e.g., `p => p.Category.Name`), provide the full path via the `ColumnKey` parameter
    /// as automatic inference only supports direct members.
    /// </summary>
    [Parameter] public Expression<Func<TItem, object?>>? For { get; set; }

    /// <summary>
    /// Explicitly sets the key for this column (e.g., "Name", "Category.Name").
    /// If not provided, it's inferred from the `For` expression (for direct members only).
    /// This key is used in `TableRequestModel.SortBy`.
    /// </summary>
    [Parameter] public string? ColumnKey { get; set; }

    /// <summary>
    /// If true, this column header will be interactive for sorting. Defaults to false.
    /// </summary>
    [Parameter] public bool Sortable { get; set; }

    /// <summary>
    /// The initial sort direction for this column if it's the primary sort column on first load.
    /// This is primarily for visual indication; actual sorting is driven by `ParentRzTable.CurrentTableRequest`.
    /// </summary>
    [Parameter] public SortDirection InitialSortDirection { get; set; } = SortDirection.Unset;
    
    /// <summary>
    /// The content to be rendered inside the header cell (e.g., column title).
    /// </summary>
    [Parameter, EditorRequired] public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Optional dictionary of HTMX attributes to apply to the sortable button.
    /// These will merge with or override the component's default HTMX attributes.
    /// </summary>
    [Parameter] public Dictionary<string, object>? HxAttributes { get; set; }

    /// <summary>
    /// Gets the effective column key, derived from `ColumnKey` or the `For` expression.
    /// </summary>
    public string EffectiveColumnKey => _columnKeyInternal ?? "unknown_column";
    
    /// <summary>
    /// Gets the current sort direction for this column.
    /// This is determined based on the parent table's CurrentTableRequest.
    /// </summary>
    protected SortDirection CurrentSortDirection => _currentSortDirection;

    /// <summary>
    /// Gets the next sort direction that would be applied when clicking the header.
    /// The sequence typically cycles: Unset -> Ascending -> Descending -> Unset.
    /// </summary>
    protected SortDirection NextSortDirection => _nextSortDirection;

    /// <summary>
    /// Gets the value for the aria-sort attribute, which helps screen readers announce the current sort state.
    /// Values can be "none", "ascending", or "descending".
    /// </summary>
    protected string AriaSortValue => _ariaSortValue;

    /// <summary>
    /// Gets the aria-label for the sort button, which provides accessible description of the column and its current sort state.
    /// </summary>
    protected string SortButtonAriaLabel => _sortButtonAriaLabel;

    /// <summary>
    /// Gets the CSS class string for the sort direction indicator icon.
    /// The styling changes based on current sort direction to provide visual cues.
    /// </summary>
    protected string SortIndicatorClass => Theme.RzTableHeaderCell.GetSortIndicatorCss(_currentSortDirection);

    /// <summary>
    /// Gets the appropriate icon to display based on the current sort direction.
    /// Returns different icons for ascending, descending, and unsorted states.
    /// </summary>
    protected SvgIcon? SortIndicatorIcon => Theme.RzTableHeaderCell.GetSortIndicatorIcon(_currentSortDirection);

    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentRzTable == null)
        {
            throw new InvalidOperationException($"{GetType().Name} must be used within an RzTable.");
        }

        Element = "th"; 
        AdditionalAttributes ??= new Dictionary<string, object>();
        AdditionalAttributes.TryAdd("scope", "col");

        ResolveColumnKeyAndRegister();
    }

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
            } else {
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
                nextRequestParameters = currentRequest with { 
                    SortBy = _columnKeyInternal, 
                    SortDir = _nextSortDirection == SortDirection.Ascending ? "asc" : "desc",
                    Page = 1 
                };
            }
            _effectiveHxGetUrl = $"{ParentRzTable.HxControllerUrl}{nextRequestParameters.ToQueryString()}";
        }
        else
        {
            _effectiveHxGetUrl = null;
        }
    }

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

    protected override string? RootClass()
    {
        var styles = Theme.RzTableHeaderCell;
        var classBuilder = new List<string> { styles.HeaderCellBase };

        if (Sortable)
        {
            classBuilder.Add(styles.SortableHeaderCell);
        }
        if (ParentRzTable is { Border: true })
        {
            classBuilder.Add(styles.HeaderCellBordered);
        }
        return TwMerge.Merge(AdditionalAttributes, classBuilder.ToArray());
    }
}
