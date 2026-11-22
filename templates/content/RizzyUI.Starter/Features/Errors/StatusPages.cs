using Microsoft.AspNetCore.Diagnostics;

namespace RizzyUI.Starter.Features.Errors;

/// <summary>
/// Error pages for empty error responses that do not get in htmx's way.
/// </summary>
/// <remarks>
/// <c>UseStatusCodePagesWithReExecute</c> on its own re-executes every empty 4xx/5xx response:
/// <list type="bullet">
/// <item>an htmx partial request (hx-get into a target) that gets a 404 would have a whole error page
/// swapped into its target;</item>
/// <item>an empty 401 that carries <c>HX-Redirect</c> (Rizzy's <c>UseHtmxRedirects</c> answers an
/// expired session that way) would become an error page instead of the redirect.</item>
/// </list>
/// So pages are rendered only for full-page requests (normal and boosted navigation), never for partial
/// requests or responses with an htmx redirect, and the status code is kept.
/// </remarks>
public static class StatusPages
{
    public static IApplicationBuilder UseStatusPages(this IApplicationBuilder app)
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
