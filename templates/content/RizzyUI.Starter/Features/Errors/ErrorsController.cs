using Microsoft.AspNetCore.Mvc;
using Rizzy;
using Rizzy.Framework.Mvc;

namespace RizzyUI.Starter.Features.Errors;

[ApiExplorerSettings(IgnoreApi = true)]
public sealed class ErrorsController : RzController
{
    // UseExceptionHandler("/error") re-executes the request here outside Development.
    [Route("/error")]
    public IResult Error()
    {
        Response.StatusCode = StatusCodes.Status500InternalServerError;
        return View<ErrorPage>(new { RequestId = HttpContext.TraceIdentifier });
    }

    // UseStatusPages (StatusPages.cs) re-executes empty error responses here. The status code is kept:
    // a 400 stays a 400 instead of becoming "page not found".
    [Route("/status/{code:int}")]
    public IResult Status(int code)
    {
        Response.StatusCode = code;
        return code == StatusCodes.Status404NotFound
            ? View<NotFoundPage>()
            : View<StatusPage>(new { StatusCode = code });
    }
}
