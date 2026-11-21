using Microsoft.AspNetCore.Mvc;
using Rizzy.Framework.Mvc;

namespace Summit.Web.Features.Home;

public sealed class HomeController : RzController
{
    [HttpGet("/")]
    public IResult Index() => View<HomePage>();
}
