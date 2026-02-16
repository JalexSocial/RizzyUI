
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A component that renders pagination controls for an <see cref="RzTable{TItem}"/>.
/// It generates page links and previous/next buttons, with HTMX attributes for dynamic page loading.
/// </summary>
/// <typeparam name="TItem">The type of data item in the table.</typeparam>
[CascadingTypeParameter(nameof(TItem))]
public partial class TablePagination<TItem> : RzComponent<TablePaginationSlots>
{
    /// <summary>
    /// Gets or sets the parent <see cref="RzTable{TItem}"/> component.
    /// </summary>
    [CascadingParameter(Name = "ParentRzTable")]
    protected RzTable<TItem>? ParentRzTable { get; set; }

    /// <summary>
    /// Gets or sets the pagination state. If not provided, it's inherited from the parent <see cref="RzTable{TItem}"/>.
    /// </summary>
    [Parameter] public PaginationState? PaginationState { get; set; }

    /// <summary>
    /// Gets or sets the base URL for HTMX requests. If not provided, it's inherited from the parent <see cref="RzTable{TItem}"/>.
    /// </summary>
    [Parameter] public string? HxControllerUrl { get; set; }

    /// <summary>
    /// Gets or sets the CSS selector for the HTMX target. If not provided, it's inherited from the parent <see cref="RzTable{TItem}"/>.
    /// </summary>
    [Parameter] public string? HxTargetSelector { get; set; }

    /// <summary>
    /// Gets or sets the HTMX swap mode. If not provided, it's inherited from the parent <see cref="RzTable{TItem}"/>.
    /// </summary>
    [Parameter] public string? HxSwapMode { get; set; }

    /// <summary>
    /// Gets or sets the CSS selector for the HTMX loading indicator. If not provided, it's inherited from the parent <see cref="RzTable{TItem}"/>.
    /// </summary>
    [Parameter] public string? HxIndicatorSelector { get; set; }

    /// <summary>
    /// Gets or sets additional HTMX attributes to apply to each page link.
    /// </summary>
    [Parameter] public Dictionary<string, object>? HxPageLinkAttributes { get; set; }

    /// <summary>
    /// Gets or sets the maximum number of visible page links to display. Defaults to 7.
    /// </summary>
    [Parameter] public int MaxVisiblePageLinks { get; set; } = 7;

    /// <summary>
    /// Gets or sets the label for the 'Previous' button. Defaults to a localized value.
    /// </summary>
    [Parameter] public string? PreviousButtonLabel { get; set; }

    /// <summary>
    /// Gets or sets the label for the 'Next' button. Defaults to a localized value.
    /// </summary>
    [Parameter] public string? NextButtonLabel { get; set; }

    /// <summary>
    /// Gets or sets the ARIA label for the pagination navigation container. Defaults to a localized value.
    /// </summary>
    [Parameter] public string? NavigationAriaLabel { get; set; }

    /// <summary>
    /// Gets the effective pagination state, falling back to the parent table's state if not directly provided.
    /// </summary>
    protected PaginationState EffectivePaginationState => PaginationState ?? ParentRzTable?.CurrentPaginationState ?? new PaginationState(1, 0, 10, 0);

    /// <summary>
    /// Gets the current table request model from the parent table.
    /// </summary>
    protected TableRequestModel CurrentTableRequest => ParentRzTable?.CurrentTableRequest ?? new TableRequestModel();

    /// <summary>
    /// Gets the effective controller URL for HTMX requests.
    /// </summary>
    protected string EffectiveHxControllerUrl => HxControllerUrl ?? ParentRzTable?.HxControllerUrl ?? string.Empty;

    /// <summary>
    /// Gets the effective CSS selector for the HTMX target.
    /// </summary>
    protected string EffectiveHxTargetSelector => HxTargetSelector ?? ParentRzTable?.EffectiveHxTargetSelector ?? $"#{(ParentRzTable?.TableBodyIdInternal ?? ParentRzTable?.Id + "-tbody-default")}";

    /// <summary>
    /// Gets the effective HTMX swap mode.
    /// </summary>
    protected string EffectiveHxSwapMode => HxSwapMode ?? ParentRzTable?.HxSwapMode ?? "innerHTML";

    /// <summary>
    /// Gets the effective CSS selector for the HTMX loading indicator.
    /// </summary>
    protected string? EffectiveHxIndicatorSelector => HxIndicatorSelector ?? ParentRzTable?.HxIndicatorSelector ?? $"#{(ParentRzTable?.TableBodyIdInternal ?? ParentRzTable?.Id + "-tbody-default")}-spinner";

    /// <summary>
    /// Gets a value indicating whether it's possible to navigate to a previous page.
    /// </summary>
    protected bool CanGoPrevious => EffectivePaginationState.CurrentPage > 1;

    /// <summary>
    /// Gets a value indicating whether it's possible to navigate to a next page.
    /// </summary>
    protected bool CanGoNext => EffectivePaginationState.CurrentPage < EffectivePaginationState.TotalPages;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "nav";

        if (ParentRzTable == null && PaginationState == null)
        {
            throw new InvalidOperationException($"{GetType().Name} requires either to be within an RzTable, or to have PaginationState provided.");
        }

        EnsureParameterDefaults();
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        if (MaxVisiblePageLinks < 5) MaxVisiblePageLinks = 5;
        EnsureParameterDefaults();
    }

    private void EnsureParameterDefaults()
    {
        PreviousButtonLabel ??= Localizer["RzPagination.PreviousButtonLabel"];
        NextButtonLabel ??= Localizer["RzPagination.NextButtonLabel"];
        NavigationAriaLabel ??= Localizer["RzPagination.NavigationAriaLabel"];
    }

    /// <summary>
    /// Generates the URL for a specific page number.
    /// </summary>
    /// <param name="pageNumber">The page number to generate the URL for.</param>
    /// <returns>The generated URL string.</returns>
    protected string GetPageUrl(int pageNumber)
    {
        if (string.IsNullOrEmpty(EffectiveHxControllerUrl) || pageNumber < 1) return "#";

        var requestParams = CurrentTableRequest with { Page = pageNumber, PageSize = EffectivePaginationState.PageSize };
        return $"{EffectiveHxControllerUrl}{requestParams.ToQueryString()}";
    }

    /// <summary>
    /// Generates the HTMX attributes for a page link button.
    /// </summary>
    /// <param name="pageNumber">The page number the link navigates to.</param>
    /// <returns>A dictionary of HTMX attributes.</returns>
    protected Dictionary<string, object> GetPageLinkHxAttributes(int pageNumber)
    {
        var defaultAttributes = new Dictionary<string, object>();

        if (!string.IsNullOrEmpty(EffectiveHxControllerUrl))
        {
            defaultAttributes["hx-get"] = GetPageUrl(pageNumber);
            defaultAttributes["hx-target"] = EffectiveHxTargetSelector;
            defaultAttributes["hx-swap"] = EffectiveHxSwapMode;

            if (!string.IsNullOrEmpty(EffectiveHxIndicatorSelector))
            {
                defaultAttributes["hx-indicator"] = EffectiveHxIndicatorSelector;
            }
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
    /// Generates the list of page links to be displayed in the pagination control.
    /// </summary>
    /// <returns>A list of <see cref="PageLink"/> records.</returns>
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
            int linksToShow = MaxVisiblePageLinks - 2;
            bool hasStartEllipsis = false;
            bool hasEndEllipsis = false;

            if (currentPage > linksToShow / 2 + 1 && totalPages > linksToShow)
            {
                hasStartEllipsis = true;
                linksToShow--;
            }
            if (currentPage < totalPages - linksToShow / 2 && totalPages > linksToShow)
            {
                hasEndEllipsis = true;
                linksToShow--;
            }

            links.Add(new PageLink("1", 1, currentPage == 1, false));

            if (hasStartEllipsis)
            {
                links.Add(new PageLink("...", -1, false, true));
            }

            int rangeStart = Math.Max(2, currentPage - (linksToShow / 2) + (hasStartEllipsis && !hasEndEllipsis && (MaxVisiblePageLinks % 2 == 0) ? 1 : 0));
            int rangeEnd = Math.Min(totalPages - 1, rangeStart + linksToShow - 1);

            if (rangeEnd == totalPages - 1 && (rangeEnd - rangeStart + 1) < linksToShow)
            {
                rangeStart = Math.Max(2, rangeEnd - linksToShow + 1);
            }

            for (int i = rangeStart; i <= rangeEnd; i++)
            {
                if (i == 1 && links.Any(l => l.PageNumber == 1)) continue;
                if (i == totalPages && links.Any(l => l.PageNumber == totalPages)) continue;
                links.Add(new PageLink(i.ToString(), i, i == currentPage, false));
            }

            if (hasEndEllipsis)
            {
                if (links.Last().PageNumber < totalPages - 1)
                    links.Add(new PageLink("...", -2, false, true));
            }
            if (totalPages > 1)
                links.Add(new PageLink(totalPages.ToString(), totalPages, totalPages == currentPage, false));
        }
        return links.GroupBy(l => l.PageNumber)
                    .Select(g => g.OrderBy(l => l.IsEllipsis).First())
                    .OrderBy(l => l.PageNumber == -2 ? totalPages - 0.5 : (l.PageNumber == -1 ? 1.5 : l.PageNumber))
                    .ToList();
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<TablePaginationSlots>, TablePaginationSlots> GetDescriptor() => Theme.TablePagination;

    /// <summary>
    /// Represents a single link in the pagination control.
    /// </summary>
    /// <param name="Text">The text to display for the link.</param>
    /// <param name="PageNumber">The page number this link navigates to.</param>
    /// <param name="IsCurrent">Indicates if this is the current page.</param>
    /// <param name="IsEllipsis">Indicates if this is an ellipsis placeholder.</param>
    protected record PageLink(string Text, int PageNumber, bool IsCurrent, bool IsEllipsis);
}