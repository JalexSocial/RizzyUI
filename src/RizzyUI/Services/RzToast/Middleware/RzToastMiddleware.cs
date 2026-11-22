using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Rizzy.Htmx;
using RizzyUI.Services.RzToast.Internal;

namespace RizzyUI.Services.RzToast.Middleware;

/// <summary>
/// Emits queued server-side toast commands as a single HTMX <c>rz:toast:batch</c> trigger before the response starts.
/// </summary>
public sealed class RzToastMiddleware
{
    private readonly ILogger<RzToastMiddleware> _logger;
    private readonly RequestDelegate _next;

    /// <summary>
    /// Initializes a new instance of the <see cref="RzToastMiddleware"/> class.
    /// </summary>
    /// <param name="next">The next middleware delegate.</param>
    /// <param name="logger">The middleware logger.</param>
    public RzToastMiddleware(RequestDelegate next, ILogger<RzToastMiddleware> logger)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Processes the request and registers an HTMX response-starting callback when appropriate.
    /// </summary>
    /// <param name="context">The current HTTP context.</param>
    /// <returns>A task representing middleware execution.</returns>
    public async Task InvokeAsync(HttpContext context)
    {
        ArgumentNullException.ThrowIfNull(context);

        if (!context.Request.IsHtmx())
        {
            await _next(context);

            // Toasts travel in an htmx response header; a normal request cannot carry them
            // (RZUI-052: they used to disappear without a trace).
            // SF-006: a Warning in Development, where a lost "Saved" toast is a bug to see; Debug elsewhere.
            if (context.RequestServices.GetService<RzToastCommandQueue>() is { IsEmpty: false })
            {
                var level = IsDevelopment(context) ? LogLevel.Warning : LogLevel.Debug;
                if (_logger.IsEnabled(level))
                    _logger.Log(level, "Discarded RizzyUI toast commands queued during a non-htmx request to {Path}. IRzToastService delivers toasts only in htmx responses; answer the htmx request in place (HX-Push-Url or HX-Location instead of a redirect).", context.Request.Path);
            }
            return;
        }

        _logger.LogTrace("Processing HTMX request for queued RizzyUI toast commands.");
        context.Response.OnStarting(AddToastTriggerCallback, context);
        await _next(context);

        if (!context.Response.HasStarted)
        {
            await EmitToastBatchAsync(context);
        }
    }

    private static bool IsDevelopment(HttpContext context) =>
        context.RequestServices.GetService<IHostEnvironment>()?.IsDevelopment() == true;

    private Task AddToastTriggerCallback(object state)
    {
        if (state is not HttpContext httpContext)
        {
            _logger.LogWarning("Invalid state object received in {CallbackName}. Expected HttpContext.", nameof(AddToastTriggerCallback));
            return Task.CompletedTask;
        }

        return EmitToastBatchAsync(httpContext);
    }

    private Task EmitToastBatchAsync(HttpContext httpContext)
    {
        try
        {
            if (httpContext.Response.HasStarted)
            {
                _logger.LogWarning("Response already started in {CallbackName}; toast batch header cannot be added.", nameof(AddToastTriggerCallback));
                return Task.CompletedTask;
            }

            var queue = httpContext.RequestServices.GetRequiredService<RzToastCommandQueue>();
            var commands = queue.Drain();
            if (commands.Count == 0)
            {
                _logger.LogTrace("No RizzyUI toast commands were queued for this HTMX response.");
                return Task.CompletedTask;
            }

            // SF-006: fetch follows a redirect and drops its headers, so toasts on a 3xx never arrive.
            if (httpContext.Response.StatusCode is >= 300 and < 400)
            {
                var level = IsDevelopment(httpContext) ? LogLevel.Warning : LogLevel.Debug;
                if (_logger.IsEnabled(level))
                    _logger.Log(level, "RizzyUI toast commands were queued on a redirect ({StatusCode}) from {Path}; the browser follows it and the toasts are lost. Use HX-Location or HX-Redirect, or answer in place.", httpContext.Response.StatusCode, httpContext.Request.Path);
            }

            var batch = new RzToastTransportBatch
            {
                Commands = commands,
            };

            new HtmxResponse(httpContext).Trigger(Constants.Events.ToastBatch, batch);
            _logger.LogDebug("Emitted RizzyUI toast batch containing {CommandCount} commands.", commands.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to emit RizzyUI toast batch for HTMX response.");
        }

        return Task.CompletedTask;
    }
}
