using Microsoft.AspNetCore.Mvc;
using Rizzy.Framework.Mvc;

namespace Summit.Web.Features.Errors;

[ApiExplorerSettings(IgnoreApi = true)]
public sealed class ErrorsController : RzController
{
    // UseExceptionHandler("/error") re-executes failed requests here outside Development.
    [Route("/error")]
    public IResult Error()
    {
        Response.StatusCode = StatusCodes.Status500InternalServerError;
        return View<ErrorPage>(new { RequestId = HttpContext.TraceIdentifier });
    }

    // UseSummitStatusPages re-executes empty error responses here. The status code is kept.
    [Route("/status/{code:int}")]
    public IResult Status(int code)
    {
        Response.StatusCode = code;
        return code == StatusCodes.Status404NotFound
            ? View<NotFoundPage>()
            : View<StatusPage>(new { Code = code });
    }
}
