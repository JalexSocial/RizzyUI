using TailwindMerge.Extensions;
using RizzyUI.TailwindVariants;

namespace Microsoft.Extensions.DependencyInjection;

/// <summary>
/// Provides extension methods for registering TailwindVariants services in the dependency injection container.
/// </summary>
public static class TvExtensions
{
    /// <summary>
    /// Adds TailwindVariants and its dependencies to the specified <see cref="IServiceCollection"/>.
    /// </summary>
    /// <param name="services">The <see cref="IServiceCollection"/> to add the services to.</param>
    /// <returns>The updated <see cref="IServiceCollection"/> instance.</returns>
    public static IServiceCollection AddTailwindVariants(this IServiceCollection services)
    {
        services.AddTailwindMerge();
        services.AddSingleton<TwVariants>();
        return services;
    }
}