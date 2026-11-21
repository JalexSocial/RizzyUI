using System.Globalization;
using Microsoft.AspNetCore.Localization;

namespace Summit.Web.Infrastructure;

/// <summary>English (default) and German. The culture comes from ?culture= or the culture cookie.</summary>
public static class SummitCultures
{
    public static readonly CultureInfo[] Supported = [new("en-US"), new("de-DE")];

    public static RequestLocalizationOptions CreateOptions()
    {
        var options = new RequestLocalizationOptions
        {
            DefaultRequestCulture = new RequestCulture("en-US"),
            SupportedCultures = Supported,
            SupportedUICultures = Supported,
        };
        options.RequestCultureProviders =
        [
            new QueryStringRequestCultureProvider(),
            new CookieRequestCultureProvider(),
        ];
        return options;
    }

    /// <summary>A link with ?culture=de-DE switches the language and remembers it for later visits.</summary>
    public static IApplicationBuilder UseSummitCultureCookie(this IApplicationBuilder app) =>
        app.Use(async (context, next) =>
        {
            var requested = context.Request.Query["culture"].ToString();
            if (IsSupported(requested))
                Remember(context.Response, requested);
            await next();
        });

    public static void Remember(HttpResponse response, string culture) =>
        response.Cookies.Append(
            CookieRequestCultureProvider.DefaultCookieName,
            CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
            new CookieOptions { IsEssential = true, SameSite = SameSiteMode.Lax, MaxAge = TimeSpan.FromDays(365) });

    public static bool IsSupported(string? culture) =>
        culture is not null && Supported.Any(c => string.Equals(c.Name, culture, StringComparison.OrdinalIgnoreCase));
}
