using Alba;
using Bunit;
using Microsoft.Extensions.DependencyInjection;
using RizzyUI.Tests;

namespace RizzyUI.Tests;

public abstract class BunitAlbaContext : TestContext, IAsyncLifetime
{
    private readonly WebAppFixture _fixture;

    protected BunitAlbaContext(WebAppFixture fixture)
    {
        _fixture = fixture;
    }

    public Task InitializeAsync()
    {
        // ❶  Let bUnit fall back to the real container
        Services.AddFallbackServiceProvider(_fixture.Host.Services);

        // ❷  Re-use the TestServer’s HttpClient so components talk to the in-proc API
        Services.AddSingleton(_fixture.Host.Server.CreateClient());

        return Task.CompletedTask;
    }

    public Task DisposeAsync() => Task.CompletedTask;
}