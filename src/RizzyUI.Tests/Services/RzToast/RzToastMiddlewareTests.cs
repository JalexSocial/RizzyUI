using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using RizzyUI.Services.RzToast;
using RizzyUI.Services.RzToast.Internal;
using RizzyUI.Services.RzToast.Middleware;
using Xunit;

namespace RizzyUI.Services.RzToast;

public sealed class RzToastMiddlewareTests
{
    [Fact]
    public async Task NonHtmxRequest_DoesNotReceiveToastTrigger()
    {
        var context = CreateContext();
        var middleware = CreateMiddleware(httpContext => httpContext.Response.WriteAsync("ok"));

        await middleware.InvokeAsync(context);

        Assert.False(context.Response.Headers.ContainsKey("HX-Trigger"));
    }

    [Fact]
    public async Task HtmxRequestWithNoCommands_DoesNotReceiveToastTrigger()
    {
        var context = CreateContext(htmx: true);
        var middleware = CreateMiddleware(httpContext => httpContext.Response.WriteAsync("ok"));

        await middleware.InvokeAsync(context);

        Assert.False(context.Response.Headers.ContainsKey("HX-Trigger"));
    }

    [Fact]
    public async Task HtmxRequestWithCommands_EmitsSingleToastBatchInOrder()
    {
        var context = CreateContext(htmx: true);
        var middleware = CreateMiddleware(httpContext =>
        {
            var service = httpContext.RequestServices.GetRequiredService<IRzToastService>();
            service.Success("First", "Saved", new RzToastOptions { Id = "first", Position = ToastPosition.BottomRight });
            service.Info("Second", options: new RzToastOptions { Id = "second" });
            service.Update("first", new RzToastUpdate { Status = ToastStatus.Success, Text = "Updated" });
            service.Dismiss("second");
            service.Clear();
            return httpContext.Response.WriteAsync("ok");
        });

        await middleware.InvokeAsync(context);

        using var header = ParseTriggerHeader(context);
        var batch = header.RootElement.GetProperty(Constants.Events.ToastBatch);
        var commands = batch.GetProperty("commands");

        Assert.Equal(5, commands.GetArrayLength());
        Assert.Equal(new[] { "show", "show", "update", "dismiss", "clear" }, commands.EnumerateArray().Select(command => command.GetProperty("type").GetString()));
        Assert.Equal("bottom-right", commands[0].GetProperty("options").GetProperty("position").GetString());
        Assert.Equal("success", commands[2].GetProperty("options").GetProperty("status").GetString());
        Assert.False(commands[2].GetProperty("options").TryGetProperty("title", out _));
        Assert.Equal("second", commands[3].GetProperty("id").GetString());
    }

    [Fact]
    public async Task HtmxRequest_DrainsQueueOnceAndDoesNotReemitOldCommands()
    {
        var context = CreateContext(htmx: true);
        var middleware = CreateMiddleware(httpContext =>
        {
            httpContext.RequestServices.GetRequiredService<IRzToastService>().Success("Saved", options: new RzToastOptions { Id = "saved" });
            return httpContext.Response.WriteAsync("ok");
        });

        await middleware.InvokeAsync(context);
        Assert.True(context.Response.Headers.ContainsKey("HX-Trigger"));
        Assert.Empty(context.RequestServices.GetRequiredService<RzToastCommandQueue>().Drain());

        var nextContext = CreateContext(htmx: true);
        var nextMiddleware = CreateMiddleware(httpContext => httpContext.Response.WriteAsync("ok"));
        await nextMiddleware.InvokeAsync(nextContext);
        Assert.False(nextContext.Response.Headers.ContainsKey("HX-Trigger"));
    }

    [Fact]
    public async Task SerializationFailure_IsLoggedWithoutSensitiveToastText()
    {
        var logger = new CapturingLogger<RzToastMiddleware>();
        var context = CreateContext(htmx: true);
        var sensitiveText = "do-not-log-secret";
        var cycle = new Dictionary<string, object>();
        cycle["self"] = cycle;
        var middleware = CreateMiddleware(httpContext =>
        {
            httpContext.RequestServices.GetRequiredService<IRzToastService>().Success(
                sensitiveText,
                options: new RzToastOptions { Data = cycle });
            httpContext.Response.StatusCode = StatusCodes.Status202Accepted;
            return httpContext.Response.WriteAsync("accepted");
        }, logger);

        await middleware.InvokeAsync(context);

        Assert.Equal(StatusCodes.Status202Accepted, context.Response.StatusCode);
        Assert.Contains(logger.Entries, entry => entry.Level == LogLevel.Error);
        Assert.DoesNotContain(logger.Entries, entry => entry.Message.Contains(sensitiveText, StringComparison.Ordinal));
    }

    private static DefaultHttpContext CreateContext(bool htmx = false)
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddRizzyUI();
        var provider = services.BuildServiceProvider();
        var scope = provider.CreateScope();
        var context = new DefaultHttpContext
        {
            RequestServices = scope.ServiceProvider,
        };
        context.Response.Body = new MemoryStream();
        if (htmx)
        {
            context.Request.Headers["HX-Request"] = "true";
        }

        return context;
    }

    private static RzToastMiddleware CreateMiddleware(RequestDelegate next, ILogger<RzToastMiddleware>? logger = null) =>
        new(next, logger ?? new CapturingLogger<RzToastMiddleware>());

    private static JsonDocument ParseTriggerHeader(HttpContext context)
    {
        Assert.True(context.Response.Headers.TryGetValue("HX-Trigger", out var header));
        return JsonDocument.Parse(header.ToString());
    }

    private sealed class CapturingLogger<T> : ILogger<T>
    {
        public List<(LogLevel Level, string Message)> Entries { get; } = new();

        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;

        public bool IsEnabled(LogLevel logLevel) => true;

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
        {
            Entries.Add((logLevel, formatter(state, exception)));
        }
    }
}
