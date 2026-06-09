using Microsoft.AspNetCore.Builder;
using RizzyUI.Services.RzToast.Middleware;

namespace RizzyUI;

/// <summary>
/// Provides ASP.NET Core application-builder extensions for RizzyUI middleware.
/// </summary>
public static class ApplicationBuilderExtensions
{
    /// <summary>
    /// Adds the RizzyUI toast middleware that emits queued <see cref="Services.RzToast.IRzToastService"/> commands through HTMX response triggers.
    /// </summary>
    /// <param name="app">The application builder.</param>
    /// <returns>The application builder.</returns>
    /// <remarks>
    /// Register this middleware after <c>UseRizzy()</c> and before endpoint mappings so commands queued during HTMX requests can be emitted in the same response.
    /// </remarks>
    public static IApplicationBuilder UseRzToast(this IApplicationBuilder app)
    {
        ArgumentNullException.ThrowIfNull(app);
        return app.UseMiddleware<RzToastMiddleware>();
    }
}
