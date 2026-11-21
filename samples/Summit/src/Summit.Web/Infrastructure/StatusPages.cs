using Microsoft.AspNetCore.Diagnostics;

namespace Summit.Web.Infrastructure;

/// <summary>
/// Error pages for empty 4xx/5xx responses, without breaking htmx.
/// </summary>
/// <remarks>
/// UseStatusCodePagesWithReExecute alone (the starter template's setup) re-executes every empty error
/// response, which breaks two things (summit-findings.md SF-020):
/// <list type="bullet">
/// <item>Rizzy's UseHtmxRedirects answers an expired session with 401, an empty body and HX-Redirect.
/// The status page replaced it, so htmx swapped a "page not found" page instead of redirecting.</item>
/// <item>An htmx partial request (hx-get into a target) that gets a 404 would have a whole error page
/// swapped into the target.</item>
/// </list>
/// So status pages are only for full-page requests (normal and boosted navigation), never for partial
/// requests or responses that carry an htmx redirect. The status code is kept: a 400 stays a 400.
/// </remarks>
public static class StatusPages
{
    public static IApplicationBuilder UseSummitStatusPages(this IApplicationBuilder app)
    {
        app.UseStatusCodePagesWithReExecute("/status/{0}");

        return app.Use(async (context, next) =>
        {
            var feature = context.Features.Get<IStatusCodePagesFeature>();
            if (feature is not null && string.Equals(context.Request.Headers["HX-Request-Type"], "partial", StringComparison.OrdinalIgnoreCase))
                feature.Enabled = false;

            await next();

            if (feature is not null && context.Response.Headers.ContainsKey("HX-Redirect"))
                feature.Enabled = false;
        });
    }
}
