using Microsoft.EntityFrameworkCore;
using Summit.Web.Data;
using Summit.Web.Data.Entities;

namespace Summit.Web.Features.Agenda;

/// <summary>"My agenda": sessions an anonymous visitor saved, keyed by the visitor cookie.</summary>
public sealed class AgendaService(SummitDbContext db, TimeProvider clock)
{
    public async Task<int> CountAsync(string? visitorId) =>
        visitorId is null ? 0 : await db.AgendaItems.CountAsync(a => a.VisitorId == visitorId);

    public async Task<HashSet<int>> SessionIdsAsync(string? visitorId) =>
        visitorId is null
            ? []
            : (await db.AgendaItems.Where(a => a.VisitorId == visitorId).Select(a => a.SessionId).ToListAsync()).ToHashSet();

    /// <summary>Adds or removes a session. Returns whether it is now saved.</summary>
    public async Task<bool> SetAsync(string visitorId, int sessionId, bool saved)
    {
        var existing = await db.AgendaItems.SingleOrDefaultAsync(a => a.VisitorId == visitorId && a.SessionId == sessionId);
        if (saved && existing is null)
            db.AgendaItems.Add(new AgendaItem { VisitorId = visitorId, SessionId = sessionId, AddedAt = clock.GetUtcNow() });
        else if (!saved && existing is not null)
            db.AgendaItems.Remove(existing);

        await db.SaveChangesAsync();
        return saved;
    }
}
