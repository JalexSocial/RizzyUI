using Microsoft.AspNetCore.Mvc;
using Rizzy;

namespace RizzyUI.Starter.Features.Activity;

public sealed record ActivityItem(string Who, string What, DateTimeOffset When);

/// <summary>
/// Minimal API endpoints that return htmx fragments. IRizzyService renders a component the same
/// way RzController does, so endpoints and controllers can share components.
/// </summary>
public static class ActivityEndpoints
{
    private static readonly string[] People = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Margaret Hamilton", "Radia Perlman"];
    private static readonly string[] Actions = ["upgraded to Pro", "started a trial", "invited a teammate", "updated billing details", "exported a report"];

    public static IEndpointRouteBuilder MapActivityEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var fragments = endpoints.MapGroup("/fragments");

        fragments.MapGet("/activity", ([FromServices] IRizzyService rizzy) =>
        {
            var now = DateTimeOffset.UtcNow;
            var items = Enumerable.Range(0, 5)
                .Select(i => new ActivityItem(
                    People[Random.Shared.Next(People.Length)],
                    Actions[Random.Shared.Next(Actions.Length)],
                    now.AddMinutes(-(i * 17 + Random.Shared.Next(1, 15)))))
                .ToList();

            return rizzy.PartialView<ActivityFeed>(new { Items = items });
        });

        return endpoints;
    }
}
