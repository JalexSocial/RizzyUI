using Microsoft.Extensions.Options;
using RizzyUI;

namespace Summit.Web.Infrastructure;

/// <summary>
/// The theme for this request. RizzyUI themes are chosen on the server (the client only switches
/// light and dark), so the choice is a cookie read here and passed to RzThemeProvider.
/// </summary>
public sealed class ThemeSelection(IHttpContextAccessor accessor, IOptions<RizzyUIConfig> config)
{
    public const string CookieName = "summit_theme";

    public IReadOnlyList<RzTheme> Available => config.Value.AvailableThemes;

    public RzTheme Current
    {
        get
        {
            var code = accessor.HttpContext?.Request.Cookies[CookieName];
            return Available.FirstOrDefault(t => string.Equals(t.ThemeCode, code, StringComparison.OrdinalIgnoreCase))
                   ?? config.Value.DefaultTheme;
        }
    }

    public static void Remember(HttpResponse response, string themeCode) =>
        response.Cookies.Append(CookieName, themeCode, new CookieOptions
        {
            IsEssential = true, SameSite = SameSiteMode.Lax, MaxAge = TimeSpan.FromDays(365), HttpOnly = true,
        });
}
