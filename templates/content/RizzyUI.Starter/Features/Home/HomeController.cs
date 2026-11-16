using Microsoft.AspNetCore.Mvc;
using Rizzy;
using Rizzy.Framework.Mvc;
using RizzyUI.Starter.Features.Customers;

namespace RizzyUI.Starter.Features.Home;

public sealed class HomeController(CustomerStore store) : RzController
{
    [HttpGet("/")]
    public IResult Index() => View<Dashboard>(new { Store = store });
}
