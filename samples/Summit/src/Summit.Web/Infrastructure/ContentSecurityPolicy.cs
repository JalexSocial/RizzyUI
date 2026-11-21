using Microsoft.Extensions.Options;
using Rizzy.Htmx;

namespace Summit.Web.Infrastructure;

/// <summary>
/// The strict CSP mode (Summit:Csp:Enabled). Scripts: only nonced scripts and what they load
/// ('strict-dynamic'), the policy RizzyUI documents in client-runtime-and-htmx.md. Styles: reported,
/// not enforced, so inline style attributes show up in the browser tests without failing them.
/// </summary>
public static class ContentSecurityPolicy
{
    public static IApplicationBuilder UseSummitContentSecurityPolicy(this IApplicationBuilder app)
    {
        var options = app.ApplicationServices.GetRequiredService<IOptions<SummitOptions>>().Value;
        if (!options.Csp.Enabled)
            return app;

        return app.Use(async (context, next) =>
        {
            var nonce = context.RequestServices.GetRequiredService<IRizzyNonceProvider>().GetNonce();
            var headers = context.Response.Headers;

            headers.ContentSecurityPolicy =
                $"script-src 'nonce-{nonce}' 'strict-dynamic'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'";
            headers["Content-Security-Policy-Report-Only"] = $"style-src 'self' 'nonce-{nonce}'";

            await next();
        });
    }

    /// <summary>True when the layout must load rizzyui-csp.js instead of rizzyui.js.</summary>
    public static bool IsEnabled(this SummitOptions options) => options.Csp.Enabled;
}
