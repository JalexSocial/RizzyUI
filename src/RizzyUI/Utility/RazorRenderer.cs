using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;

namespace RizzyUI.Utility;

internal static class RazorRenderer
{
    public static async Task<string> RenderHtml(this RenderFragment? fragment)
    {
        if (fragment is null)
            return string.Empty;

        IServiceCollection services = new ServiceCollection();
        services.AddSingleton<ILoggerFactory>(new NullLoggerFactory());

        IServiceProvider serviceProvider = services.BuildServiceProvider();
        ILoggerFactory loggerFactory = serviceProvider.GetRequiredService<ILoggerFactory>();

        await using var htmlRenderer = new HtmlRenderer(serviceProvider, loggerFactory);

        var html = await htmlRenderer.Dispatcher.InvokeAsync(async () =>
        {
            var dictionary = new Dictionary<string, object?>
            {
                { "Fragment", fragment }
            };

            var parameters = ParameterView.FromDictionary(dictionary);
            var output = await htmlRenderer.RenderComponentAsync<FragmentComponent>(parameters);

            return output.ToHtmlString();
        });

        return html;
    }
}
