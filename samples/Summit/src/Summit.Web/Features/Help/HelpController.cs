using Microsoft.AspNetCore.Mvc;
using Rizzy.Framework.Mvc;

namespace Summit.Web.Features.Help;

public sealed class HelpController : RzController
{
    [HttpGet("/help")]
    public IResult Index() => View<HelpPage>();
}
