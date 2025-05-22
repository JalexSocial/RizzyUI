using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using System.Collections.Generic;
using System; // For Math

namespace RizzyUI;

/// <summary>
/// Renders a pagination control UI based on the provided or cascaded PaginationState.
/// Generates HTMX-enabled links to navigate through pages of data in an RzTable.
/// This component is generic and will infer TItem from its parent RzTable.
/// </summary>
[CascadingTypeParameter(nameof(TItem))] 
public partial class RzPagination<TItem> : RzComponent
{
    /// <summary>
    /// Cascaded parent RzTable instance, providing context like HxControllerUrl and CurrentTableRequest.
    /// </summary>
    [CascadingParameter(Name = "ParentRzTable")]
    protected RzTable<TItem>? ParentRzTable { get; set; }

    /// <summary>
    /// Optional. The pagination state. If not provided, it attempts to use the
    /// CurrentPaginationState from the cascaded ParentRzTable.
    /// </summary>
    [Parameter] public PaginationState? PaginationState { get; set; }

    /// <summary>
    /// Optional. The base URL for HTMX pagination requests.
    /// If not provided, it uses HxControllerUrl from the cascaded ParentRzTable.
    /// </summary>
    [Parameter] public string? HxControllerUrl { get; set; }

    /// <summary>
    /// Optional. The CSS selector for the HTMX target.
    /// If not provided, it uses EffectiveHxTargetSelector from the cascaded ParentRzTable.
    /// </summary>
    [Parameter] public string? HxTargetSelector { get; set; }

    /// <summary>
    /// Optional. The HTMX swap mode.
    /// If not provided, it uses HxSwapMode from the cascaded ParentRzTable.
    /// </summary>
    [Parameter] public string? HxSwapMode { get; set; }
    
    /// <summary>
    /// Optional. The HTMX indicator selector.
    /// If not provided, it uses HxIndicatorSelector from the cascaded ParentRzTable.
    /// </summary>
    [Parameter] public string? HxIndicatorSelector { get; set; }

    /// <summary>
    /// Optional dictionary of HTMX attributes to apply to each generated page link/button.
    /// These will merge with or override the component's default HTMX attributes.
    /// These are applied only to active (non-disabled, non-ellipsis) links.
    /// </summary>
    [Parameter] public Dictionary<string, object>? HxPageLinkAttributes { get; set; }

    /// <summary>
    /// The maximum number of page links to display directly (e.g., 1, 2, 3, ..., 10).
    /// Others will be represented by ellipses. Defaults to 7. Must be >= 5 for reasonable display.
    /// </summary>
    [Parameter] public int MaxVisiblePageLinks { get; set; } = 7;

    /// <summary>
    /// Label for the "Previous" page button. Defaults to a localized "Previous".
    /// </summary>
    [Parameter] public string? PreviousButtonLabel { get; set; }

    /// <summary>
    /// Label for the "Next" page button. Defaults to a localized "Next".
    /// </summary>
    [Parameter] public string? NextButtonLabel { get; set; }

    /// <summary>
    /// ARIA label for the pagination navigation container. Defaults to a localized "Pagination Navigation".
    /// </summary>
    [Parameter] public string? NavigationAriaLabel { get; set; }

    /// <summary>
    /// Gets the effective pagination state, using the parameter or falling back to the parent table or a default.
    /// </summary>
    protected PaginationState EffectivePaginationState => PaginationState ?? ParentRzTable?.CurrentPaginationState ?? new PaginationState(1, 0, 10, 0);

    /// <summary>
    /// Gets the current table request from the parent table or a new default.
    /// </summary>
    protected TableRequestModel CurrentTableRequest => ParentRzTable?.CurrentTableRequest ?? new TableRequestModel();

    /// <summary>
    /// Gets the effective controller URL for HTMX requests.
    /// </summary>
    protected string EffectiveHxControllerUrl => HxControllerUrl ?? ParentRzTable?.HxControllerUrl ?? string.Empty;

    /// <summary>
    /// Gets the effective HTMX target selector.
    /// </summary>
    protected string EffectiveHxTargetSelector => HxTargetSelector ?? ParentRzTable?.EffectiveHxTargetSelector ?? $"#{(ParentRzTable?.TableBodyIdInternal ?? ParentRzTable?.Id + "-tbody-default")}";

    /// <summary>
    /// Gets the effective HTMX swap mode.
    /// </summary>
    protected string EffectiveHxSwapMode => HxSwapMode ?? ParentRzTable?.HxSwapMode ?? "innerHTML";

    /// <summary>
    /// Gets the effective HTMX indicator selector.
    /// </summary>
    protected string? EffectiveHxIndicatorSelector => HxIndicatorSelector ?? ParentRzTable?.HxIndicatorSelector ?? $"#{(ParentRzTable?.TableBodyIdInternal ?? ParentRzTable?.Id + "-tbody-default")}-spinner";

    /// <summary>
    /// Gets a value indicating whether the "Previous" button should be enabled.
    /// </summary>
    protected bool CanGoPrevious => EffectivePaginationState.CurrentPage > 1;

    /// <summary>
    /// Gets a value indicating whether the "Next" button should be enabled.
    /// </summary>
    protected bool CanGoNext => EffectivePaginationState.CurrentPage < EffectivePaginationState.TotalPages;

    /// <summary>
    /// Called when the component is initialized.
    /// </summary>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        
        if (string.IsNullOrEmpty(Element))
            Element = "nav"; 

        if (ParentRzTable == null && (PaginationState == null || string.IsNullOrEmpty(HxControllerUrl)))
        {
            throw new InvalidOperationException($"{GetType().Name} requires either to be within an RzTable, or to have PaginationState and HxControllerUrl parameters provided.");
        }
        
        EnsureParameterDefaults();
    }
    
    /// <summary>
    /// Called when component parameters are set.
    /// </summary>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        if (MaxVisiblePageLinks < 5) MaxVisiblePageLinks = 5; // Enforce a minimum for sensible layout
        EnsureParameterDefaults();
    }

    /// <summary>
    /// Ensures that parameter defaults are set for labels and ARIA attributes.
    /// </summary>
    private void EnsureParameterDefaults()
    {
        PreviousButtonLabel ??= Localizer["RzPagination.PreviousButtonLabel"];
        NextButtonLabel ??= Localizer["RzPagination.NextButtonLabel"];
        NavigationAriaLabel ??= Localizer["RzPagination.NavigationAriaLabel"];
    }

    /// <summary>
    /// Gets the URL for a specific page number.
    /// </summary>
    /// <param name="pageNumber">The page number.</param>
    /// <returns>The URL for the page.</returns>
    protected string GetPageUrl(int pageNumber)
    {
        if (string.IsNullOrEmpty(EffectiveHxControllerUrl) || pageNumber < 1) return "#";

        var requestParams = CurrentTableRequest with { Page = pageNumber, PageSize = EffectivePaginationState.PageSize };
        return $"{EffectiveHxControllerUrl}{requestParams.ToQueryString()}";
    }

    /// <summary>
    /// Gets the HTMX attributes for a page link.
    /// </summary>
    /// <param name="pageNumber">The page number.</param>
    /// <returns>A dictionary of HTMX attributes.</returns>
    protected Dictionary<string, object> GetPageLinkHxAttributes(int pageNumber)
    {
        var defaultAttributes = new Dictionary<string, object>
        {
            { "hx-get", GetPageUrl(pageNumber) },
            { "hx-target", EffectiveHxTargetSelector },
            { "hx-swap", EffectiveHxSwapMode }
        };
        if(!string.IsNullOrEmpty(EffectiveHxIndicatorSelector))
        {
            defaultAttributes["hx-indicator"] = EffectiveHxIndicatorSelector;
        }

        if (HxPageLinkAttributes != null)
        {
            foreach (var attr in HxPageLinkAttributes)
            {
                defaultAttributes[attr.Key] = attr.Value; 
            }
        }
        return defaultAttributes;
    }
    
    /// <summary>
    /// Gets the list of page links to display in the pagination control.
    /// </summary>
    /// <returns>A list of page links.</returns>
    protected List<PageLink> GetPageLinks()
    {
        var links = new List<PageLink>();
        var totalPages = EffectivePaginationState.TotalPages;
        var currentPage = EffectivePaginationState.CurrentPage;

        if (totalPages <= 0) return links;

        if (totalPages <= MaxVisiblePageLinks)
        {
            for (int i = 1; i <= totalPages; i++)
            {
                links.Add(new PageLink(i.ToString(), i, i == currentPage, false));
            }
        }
        else
        {
            // MaxVisiblePageLinks must be at least 5 for this logic (first, last, current, 2 ellipses or 2 numbers)
            // Calculate how many numbers to show on each side of current page
            int linksToShow = MaxVisiblePageLinks - 2; // slots for first, last
            bool hasStartEllipsis = false;
            bool hasEndEllipsis = false;

            if (currentPage > linksToShow / 2 + 1 && totalPages > linksToShow)
            {
                hasStartEllipsis = true;
                linksToShow--; // for start ellipsis
            }
            if (currentPage < totalPages - linksToShow / 2 && totalPages > linksToShow)
            {
                hasEndEllipsis = true;
                linksToShow--; // for end ellipsis
            }
            
            links.Add(new PageLink("1", 1, currentPage == 1, false));

            if (hasStartEllipsis)
            {
                links.Add(new PageLink("...", -1, false, true));
            }

            int rangeStart = Math.Max(2, currentPage - (linksToShow / 2) + (hasStartEllipsis && !hasEndEllipsis && (MaxVisiblePageLinks % 2 == 0) ? 1 : 0) );
            int rangeEnd = Math.Min(totalPages - 1, rangeStart + linksToShow -1);

            // Adjust rangeStart if rangeEnd is too small due to proximity to totalPages
            if (rangeEnd == totalPages -1 && (rangeEnd - rangeStart + 1) < linksToShow) {
                rangeStart = Math.Max(2, rangeEnd - linksToShow +1);
            }


            for (int i = rangeStart; i <= rangeEnd; i++)
            {
                if (i == 1 && links.Any(l => l.PageNumber == 1)) continue; // Already added
                if (i == totalPages && links.Any(l=>l.PageNumber == totalPages)) continue; // Will be added
                links.Add(new PageLink(i.ToString(), i, i == currentPage, false));
            }
            
            if (hasEndEllipsis)
            {
                 if(links.Last().PageNumber < totalPages -1 ) // ensure ellipsis is not redundant with last page
                    links.Add(new PageLink("...", -2, false, true)); // Use -2 for end ellipsis to differentiate
            }
            if(totalPages > 1) // Only add last page if it's not the same as the first page
                links.Add(new PageLink(totalPages.ToString(), totalPages, totalPages == currentPage, false));
        }
        // Deduplicate (e.g. if totalPages = 1, it might be added twice)
        // Simple distinct by PageNumber, then by IsEllipsis to prioritize numbers over ellipses if they overlap
        return links.GroupBy(l => l.PageNumber)
                    .Select(g => g.OrderBy(l => l.IsEllipsis).First())
                    .OrderBy(l => l.PageNumber == -2 ? totalPages -0.5 : (l.PageNumber == -1 ? 1.5 : l.PageNumber )   ) // Sort ellipses correctly
                    .ToList();
    }

    /// <summary>
    /// Returns the CSS class for the root element of the pagination component.
    /// </summary>
    /// <returns>The merged CSS class string.</returns>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzPagination.Container);
    }

    /// <summary>
    /// Represents a link in the pagination control.
    /// </summary>
    /// <param name="Text">The text of the link.</param>
    /// <param name="PageNumber">The page number the link points to.</param>
    /// <param name="IsCurrent">Indicates if the link is for the current page.</param>
    /// <param name="IsEllipsis">Indicates if the link is an ellipsis.</param>
    protected record PageLink(string Text, int PageNumber, bool IsCurrent, bool IsEllipsis);
}
