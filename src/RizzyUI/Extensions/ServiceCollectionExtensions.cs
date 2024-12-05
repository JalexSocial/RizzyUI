using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using TailwindMerge.Extensions;

namespace RizzyUI;

public static class ServiceCollectionExtensions
{
	/// <summary>
	/// Add RizzyUI services to <see cref="IServiceCollection"/>.
	/// </summary>
	/// <param name="services">The <see cref="IServiceCollection"/>.</param>
	public static void AddRizzyUI(this IServiceCollection services)
	{
		services.AddTailwindMerge();
	}
}
