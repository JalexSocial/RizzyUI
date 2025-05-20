
using Bunit;
using Microsoft.Extensions.DependencyInjection;
using Rizzy;
using Rizzy.Htmx;
using RizzyUI;

namespace RizzyUI.Tests;

/// <summary>
/// Provides extension methods for configuring and enhancing a <see cref="TestServiceProvider"/> instance
/// with predefined services and configurations commonly used in Rizzy-based applications.
/// </summary>
public static class ServiceProviderExtensions
{
	public static TestServiceProvider AddRizzyBaseConfiguration(this TestServiceProvider services)
	{
		services.AddLocalization(options => options.ResourcesPath = "Resources");

		services.AddRizzy();
		services.AddHtmx(config =>
		{
			config.GenerateStyleNonce = true;
		});
		services.AddRizzyUI(config =>
		{
			config.DefaultTheme = RzTheme.ArcticTheme;
		});
        
		services.AddRazorComponents();
		services.AddControllers();
		
		return services;
	}
}