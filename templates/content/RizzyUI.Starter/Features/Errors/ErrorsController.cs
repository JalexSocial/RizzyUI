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

    // UseStatusCodePagesWithReExecute("/not-found") re-executes 404s here.
    [Route("/not-found")]
    public IResult NotFoundPage()
    {
        Response.StatusCode = StatusCodes.Status404NotFound;
        return View<NotFoundPage>();
    }
}
