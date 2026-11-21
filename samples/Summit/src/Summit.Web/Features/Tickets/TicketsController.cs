using Microsoft.AspNetCore.Mvc;
using Rizzy.Framework.Mvc;

namespace Summit.Web.Features.Tickets;

public sealed class TicketsController : RzController
{
    [HttpGet("/tickets")]
    public IResult Index() => View<TicketsPage>();
}
