using Microsoft.Extensions.Options;
using Summit.Web.Data;

namespace Summit.Web.Infrastructure;

/// <summary>
/// /_test/* endpoints for the browser tests, mapped only with Summit:EnableTestHooks. They are not
/// protected by antiforgery or auth on purpose; never enable them in a real deployment.
/// </summary>
public static class TestHooks
{
    private static int _failNext;

    public static WebApplication MapSummitTestHooks(this WebApplication app)
    {
        if (!app.Services.GetRequiredService<IOptions<SummitOptions>>().Value.EnableTestHooks)
            return app;

        var group = app.MapGroup("/_test").DisableAntiforgery();

        // Restores the seeded database (the template copy).
        group.MapPost("/reset", async (SummitDatabase database, CancellationToken cancellationToken) =>
        {
            await database.ResetAsync(cancellationToken);
            return Results.NoContent();
        });

        // The next htmx request throws, to exercise UseHtmxErrorHandling and the rz:server-error path.
        group.MapPost("/fail-next", () =>
        {
            Interlocked.Exchange(ref _failNext, 1);
            return Results.NoContent();
        });

        return app;
    }

    /// <summary>Middleware half of /_test/fail-next. Registered only with test hooks on.</summary>
    public static IApplicationBuilder UseSummitFailureInjection(this IApplicationBuilder app)
    {
        if (!app.ApplicationServices.GetRequiredService<IOptions<SummitOptions>>().Value.EnableTestHooks)
            return app;

        return app.Use(async (context, next) =>
        {
            if (context.Request.Headers.ContainsKey("HX-Request") && Interlocked.Exchange(ref _failNext, 0) == 1)
                throw new InvalidOperationException("Failure injected by /_test/fail-next.");

            await next();
        });
    }
}
