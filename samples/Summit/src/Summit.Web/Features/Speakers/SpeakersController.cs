using Microsoft.AspNetCore.Mvc;
using Rizzy.Framework.Mvc;

namespace Summit.Web.Features.Speakers;

public sealed class SpeakersController : RzController
{
    [HttpGet("/speakers")]
    public IResult Index() => View<SpeakersPage>();
}
