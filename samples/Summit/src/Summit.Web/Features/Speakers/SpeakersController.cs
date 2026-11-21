using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Rizzy;
using Rizzy.Framework.Mvc;
using Rizzy.Htmx;
using Summit.Web.Data;

namespace Summit.Web.Features.Speakers;

public sealed class SpeakersController(SummitDbContext db, IHtmxSwapService swaps) : RzController
{
    public const int PageSize = 12;

    // Full page for normal and boosted requests; only the results for the search box and the pager
    // (hx-get with hx-target="#speaker-results"), plus the live result count out of band.
    [HttpGet("/speakers")]
    public async Task<IResult> Index([FromQuery(Name = "q")] string? query, int page = 1)
    {
        var result = await SearchAsync(query, page);
        if (!Request.Htmx().IsPartial)
            return View<SpeakersPage>(new { Result = result });

        Response.Htmx(h => h.PushUrl(result.PageUrl(result.Page)));
        swaps.AddSwappableComponent<SpeakerCount>("speaker-count", new { Result = result });
        return PartialView<SpeakerResults>(new { Result = result });
    }

    private async Task<SpeakerSearch> SearchAsync(string? query, int page)
    {
        var q = query?.Trim() ?? "";
        var speakers = db.Speakers.AsNoTracking();
        if (q.Length > 0)
        {
            var like = $"%{q}%";
            speakers = speakers.Where(s => EF.Functions.Like(s.Name, like) || EF.Functions.Like(s.Company, like) || EF.Functions.Like(s.Title, like));
        }

        var total = await speakers.CountAsync();
        var pages = Math.Max(1, (int)Math.Ceiling(total / (double)PageSize));
        page = Math.Clamp(page, 1, pages);
        var items = await speakers
            .OrderByDescending(s => s.Featured).ThenBy(s => s.Name)
            .Skip((page - 1) * PageSize).Take(PageSize)
            .Select(s => new SpeakerListItem(s, s.Sessions.Select(x => x.Session).Where(x => x.Status == Data.Entities.SessionStatus.Published).OrderBy(x => x.StartsAt).Select(x => new SpeakerSession(x.Slug, x.Title)).ToList()))
            .ToListAsync();

        return new SpeakerSearch(q, page, pages, total, items);
    }
}

public sealed record SpeakerSession(string Slug, string Title);

public sealed record SpeakerListItem(Data.Entities.Speaker Speaker, IReadOnlyList<SpeakerSession> Sessions);

public sealed record SpeakerSearch(string Query, int Page, int Pages, int Total, IReadOnlyList<SpeakerListItem> Items)
{
    public string PageUrl(int page)
    {
        var parts = new List<string>();
        if (Query.Length > 0) parts.Add($"q={Uri.EscapeDataString(Query)}");
        if (page > 1) parts.Add($"page={page}");
        return parts.Count == 0 ? "/speakers" : "/speakers?" + string.Join("&", parts);
    }
}
