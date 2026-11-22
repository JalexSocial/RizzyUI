using Microsoft.AspNetCore.Diagnostics;

namespace RizzyUI.Starter.Features.Errors;

/// <summary>
/// Error pages for empty error responses that do not get in htmx's way.
/// </summary>
/// <remarks>
/// <c>UseStatusCodePagesWithReExecute</c> on its own re-executes every empty 4xx/5xx response, so an
/// htmx partial request (hx-get into a target) that gets a 404 would have a whole error page swapped
/// into its target. Pages are rendered only for full-page requests (normal and boosted navigation), and
/// the status code is kept. (Rizzy's <c>UseHtmxRedirects</c> keeps its own 401/403 with
/// <c>HX-Redirect</c> away from status pages.)
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
        });
    }
}
