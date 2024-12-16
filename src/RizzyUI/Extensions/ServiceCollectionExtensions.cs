﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;
using RizzyUI.Services;
using TailwindMerge.Extensions;

namespace RizzyUI;

public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Adds RizzyUI services to the specified <see cref="IServiceCollection"/>.
    /// </summary>
    /// <param name="services">The service collection to add RizzyUI services to.</param>
    /// <returns>The updated service collection.</returns>
    public static IServiceCollection AddRizzyUI(this IServiceCollection services)
    {
        services.AddTailwindMerge();

        // Ensure IHttpContextAccessor is registered
        services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();

        // Register the default RizzyNonceProvider only if IRizzyNonceProvider hasn't been registered
        services.TryAddScoped<IRizzyNonceProvider, RizzyNonceProvider>();

        return services;
    }
}