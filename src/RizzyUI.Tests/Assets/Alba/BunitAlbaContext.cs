using Bunit;
using Microsoft.Extensions.DependencyInjection;

namespace RizzyUI.Tests;

public abstract class BunitAlbaContext : BunitContext, IAsyncLifetime
{
    private readonly WebAppFixture _fixture;
    private IServiceScope? _scope;

    protected BunitAlbaContext(WebAppFixture fixture)
    {
        _fixture = fixture;
    }

    public Task InitializeAsync()
    {
        // Create a scope for the test to allow scoped services to be resolved per test.
        _scope = _fixture.Host.Services.CreateScope();

        // Let bUnit fall back to the scoped service container for DI.
        Services.AddFallbackServiceProvider(_scope.ServiceProvider);

        // Re-use the TestServer’s HttpClient so components talk to the in-proc API.
        Services.AddSingleton(_fixture.Host.Server.CreateClient());

        return Task.CompletedTask;
    }

    async Task IAsyncLifetime.DisposeAsync()
    {
        _scope?.Dispose();
        await base.DisposeAsync();
    }
}
