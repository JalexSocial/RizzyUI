using Microsoft.AspNetCore.Diagnostics;

namespace Summit.Web.Infrastructure;

/// <summary>
/// Error pages for empty 4xx/5xx responses, without breaking htmx.
/// </summary>
/// <remarks>
/// UseStatusCodePagesWithReExecute re-executes every empty error response. An htmx partial request
/// (hx-get into a target) that gets a 404 would have a whole error page swapped into the target, so
/// status pages are only for full-page requests (normal and boosted navigation). Rizzy's
/// UseHtmxRedirects keeps its own 401/403 with HX-Redirect away from status pages (Rizzy 6.0.0-preview.4,
/// summit-findings.md SF-020). The status code is kept: a 400 stays a 400.
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
        });
    }
}
