using Microsoft.Extensions.DependencyInjection;
using RizzyUI.Services.RzToast;
using RizzyUI.Services.RzToast.Internal;
using Xunit;

namespace RizzyUI.Services.RzToast;

public sealed class RzToastDependencyInjectionTests
{
    [Fact]
    public void AddRizzyUI_RegistersToastServiceAsScoped()
    {
        var services = new ServiceCollection();
        services.AddRizzyUI();
        using var provider = services.BuildServiceProvider();

        using var firstScope = provider.CreateScope();
        var first = firstScope.ServiceProvider.GetRequiredService<IRzToastService>();
        var second = firstScope.ServiceProvider.GetRequiredService<IRzToastService>();

        using var secondScope = provider.CreateScope();
        var third = secondScope.ServiceProvider.GetRequiredService<IRzToastService>();

        Assert.IsType<RzToastService>(first);
        Assert.Same(first, second);
        Assert.NotSame(first, third);
    }

    [Fact]
    public void AddRizzyUI_ServiceAndMiddlewareQueueShareRequestScope()
    {
        var services = new ServiceCollection();
        services.AddRizzyUI();
        using var provider = services.BuildServiceProvider();
        using var scope = provider.CreateScope();

        var service = scope.ServiceProvider.GetRequiredService<IRzToastService>();
        var queue = scope.ServiceProvider.GetRequiredService<RzToastCommandQueue>();

        service.Success("Saved", options: new RzToastOptions { Id = "saved" });
        var command = Assert.Single(queue.Drain());

        Assert.Equal("show", command.Type);
        Assert.Equal("saved", command.Options?.Id);
    }
}
