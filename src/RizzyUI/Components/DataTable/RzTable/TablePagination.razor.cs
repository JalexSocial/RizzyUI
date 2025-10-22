
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

[CascadingTypeParameter(nameof(TItem))]
public partial class TablePagination<TItem> : RzComponent<TablePaginationSlots>
{
    [CascadingParameter(Name = "ParentRzTable")]
    protected RzTable<TItem>? ParentRzTable { get; set; }

    [Parameter] public PaginationState? PaginationState { get; set; }
    [Parameter] public string? HxControllerUrl { get; set; }
    [Parameter] public string? HxTargetSelector { get; set; }
    [Parameter] public string? HxSwapMode { get; set; }
    [Parameter] public string? HxIndicatorSelector { get; set; }
    [Parameter] public Dictionary<string, object>? HxPageLinkAttributes { get; set; }
    [Parameter] public int MaxVisiblePageLinks { get; set; } = 7;
    [Parameter] public string? PreviousButtonLabel { get; set; }
    [Parameter] public string? NextButtonLabel { get; set; }
    [Parameter] public string? NavigationAriaLabel { get; set; }

    protected PaginationState EffectivePaginationState => PaginationState ?? ParentRzTable?.CurrentPaginationState ?? new PaginationState(1, 0, 10, 0);
    protected TableRequestModel CurrentTableRequest => ParentRzTable?.CurrentTableRequest ?? new TableRequestModel();
    protected string EffectiveHxControllerUrl => HxControllerUrl ?? ParentRzTable?.HxControllerUrl ?? string.Empty;
    protected string EffectiveHxTargetSelector => HxTargetSelector ?? ParentRzTable?.EffectiveHxTargetSelector ?? $"#{(ParentRzTable?.TableBodyIdInternal ?? ParentRzTable?.Id + "-tbody-default")}";
    protected string EffectiveHxSwapMode => HxSwapMode ?? ParentRzTable?.HxSwapMode ?? "innerHTML";
    protected string? EffectiveHxIndicatorSelector => HxIndicatorSelector ?? ParentRzTable?.HxIndicatorSelector ?? $"#{(ParentRzTable?.TableBodyIdInternal ?? ParentRzTable?.Id + "-tbody-default")}-spinner";
    protected bool CanGoPrevious => EffectivePaginationState.CurrentPage > 1;
    protected bool CanGoNext => EffectivePaginationState.CurrentPage < EffectivePaginationState.TotalPages;

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

    protected string GetPageUrl(int pageNumber)
    {
        if (string.IsNullOrEmpty(EffectiveHxControllerUrl) || pageNumber < 1) return "#";

        var requestParams = CurrentTableRequest with { Page = pageNumber, PageSize = EffectivePaginationState.PageSize };
        return $"{EffectiveHxControllerUrl}{requestParams.ToQueryString()}";
    }

    protected Dictionary<string, object> GetPageLinkHxAttributes(int pageNumber)
    {
        var defaultAttributes = new Dictionary<string, object>
        {
            { "hx-get", GetPageUrl(pageNumber) },
            { "hx-target", EffectiveHxTargetSelector },
            { "hx-swap", EffectiveHxSwapMode }
        };
        if (!string.IsNullOrEmpty(EffectiveHxIndicatorSelector))
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

    protected override TvDescriptor<RzComponent<TablePaginationSlots>, TablePaginationSlots> GetDescriptor() => Theme.TablePagination;

    protected record PageLink(string Text, int PageNumber, bool IsCurrent, bool IsEllipsis);
}