
using Bunit;
using Bunit.Extensions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
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
	private class FakeWebHostEnvironment : IWebHostEnvironment
	{
		public string ApplicationName { get; set; }
		public IFileProvider ContentRootFileProvider { get; set; }
		public string ContentRootPath { get; set; }
		public string EnvironmentName { get; set; }
		public string WebRootPath { get; set; }
		public IFileProvider WebRootFileProvider { get; set; }
	}
	
	public static TestServiceProvider AddRizzyBaseConfiguration(this TestServiceProvider services)
	{
		var env = new FakeWebHostEnvironment
		{
			EnvironmentName  = Environments.Development,
			ApplicationName  = "UnitTestHost",
			ContentRootPath  = Directory.GetCurrentDirectory(),
			WebRootPath      = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")
		};

		//services.AddSingleton<IWebHostEnvironment>(env);
		
		//services.AddSingleton<IConfiguration>(new ConfigurationBuilder().Build());
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