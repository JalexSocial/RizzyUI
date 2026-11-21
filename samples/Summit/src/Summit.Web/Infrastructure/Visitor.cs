namespace Summit.Web.Infrastructure;

/// <summary>
/// An anonymous visitor id (cookie), used for "my agenda" and the checkout draft. No account is needed
/// to build an agenda or buy a ticket.
/// </summary>
public static class Visitor
{
    public const string CookieName = "summit_visitor";

    public static string GetOrCreateVisitorId(this HttpContext context)
    {
        if (context.Items[CookieName] is string current)
            return current;

        if (context.Request.Cookies.TryGetValue(CookieName, out var existing) && Guid.TryParse(existing, out _))
        {
            context.Items[CookieName] = existing;
            return existing;
        }

        var id = Guid.NewGuid().ToString("N");
        context.Response.Cookies.Append(CookieName, id, new CookieOptions
        {
            HttpOnly = true,
            IsEssential = true,
            SameSite = SameSiteMode.Lax,
            Secure = context.Request.IsHttps,
            MaxAge = TimeSpan.FromDays(90),
        });
        context.Items[CookieName] = id;
        return id;
    }

    /// <summary>
    /// Issues the visitor cookie on page requests, before any component renders (a component cannot
    /// set a cookie once the response has started).
    /// </summary>
    public static IApplicationBuilder UseSummitVisitorCookie(this IApplicationBuilder app) =>
        app.Use(async (context, next) =>
        {
            if (!Path.HasExtension(context.Request.Path.Value) && !context.Request.Path.StartsWithSegments("/_content"))
                context.GetOrCreateVisitorId();
            await next();
        });

    public static string? GetVisitorId(this HttpContext context) =>
        context.Items[CookieName] as string
        ?? (context.Request.Cookies.TryGetValue(CookieName, out var id) && Guid.TryParse(id, out _) ? id : null);
}
