using Rizzy.Htmx;

namespace Summit.Web.Infrastructure;

/// <summary>
/// Rizzy's HtmxResponse throws when the request is not an htmx request (summit-findings.md SF-043). An
/// action that serves both a direct page load and htmx (boosted navigation, a form that also works
/// without JavaScript) would need an if around every header. These helpers set htmx headers only when
/// htmx made the request, and set the status code either way.
/// </summary>
public static class HtmxResponses
{
    /// <summary>Applies htmx response headers if, and only if, htmx made the request.</summary>
    public static void HtmxIfRequested(this HttpResponse response, Action<HtmxResponse> configure)
    {
        if (response.HttpContext.Request.IsHtmx())
            response.Htmx(configure);
    }

    /// <summary>422 for every request; htmx swaps it, and a plain form post shows the same page with errors.</summary>
    public static void ValidationFailedForAnyRequest(this HttpResponse response)
    {
        if (response.HttpContext.Request.IsHtmx())
            response.Htmx().ValidationFailed();
        else
            response.StatusCode = StatusCodes.Status422UnprocessableEntity;
    }
}
