using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Rizzy.Framework.Mvc;
using Summit.Web.Infrastructure;

namespace Summit.Web.Areas.Organizer;

/// <summary>Base class for the organizer area: signed-in organizers only.</summary>
[Area("Organizer")]
[Authorize(Policy = OrganizerAuthentication.Policy)]
public abstract class OrganizerController : RzController;
