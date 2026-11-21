using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Summit.Web.Data;
using Summit.Web.Data.Entities;
using Summit.Web.Data.Seeding;

namespace Summit.Tests;

/// <summary>
/// The seed is deterministic: the browser tests and the demo rely on its exact contents. A change here
/// is fine when intended; update the expected values and tests/e2e/support/fixtures.ts together.
/// </summary>
public sealed class SeedingTests(SummitFactory factory) : IClassFixture<SummitFactory>
{
    [Fact]
    public async Task Seeds_the_expected_conference()
    {
        await using var scope = factory.Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<SummitDbContext>();

        var conference = await db.Conferences.SingleAsync();
        Assert.Equal("Summit 2027", conference.Name);
        Assert.Equal(new DateOnly(2027, 6, 15), conference.StartsOn);

        Assert.Equal(3, await db.Days.CountAsync());
        Assert.Equal(5, await db.Tracks.CountAsync());
        Assert.Equal(6, await db.Rooms.CountAsync());
        Assert.Equal(64, await db.Speakers.CountAsync());
        Assert.Equal(6, await db.Speakers.CountAsync(s => s.Featured));
        Assert.Equal(95, await db.Sessions.CountAsync());
        Assert.Equal(6, await db.Sessions.CountAsync(s => s.Format == SessionFormat.Workshop));
        Assert.Equal(2, await db.Sessions.CountAsync(s => s.Status == SessionStatus.Draft));
        Assert.Equal(5, await db.TicketTypes.CountAsync());
        Assert.Equal(24, await db.Faqs.CountAsync());
        Assert.Equal(250, await db.AuditEvents.CountAsync());
    }

    [Fact]
    public async Task Seeds_the_fixtures_the_tests_use()
    {
        await using var scope = factory.Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<SummitDbContext>();

        var avery = await db.Attendees.SingleAsync(a => a.BadgeCode == SeedFixtures.RegisteredBadgeCode);
        Assert.Equal(SeedFixtures.RegisteredAttendeeName, avery.Name);
        Assert.Equal(AttendeeStatus.Registered, avery.Status);

        var jules = await db.Attendees.SingleAsync(a => a.BadgeCode == SeedFixtures.CheckedInBadgeCode);
        Assert.Equal(AttendeeStatus.CheckedIn, jules.Status);

        var student = await db.TicketTypes.SingleAsync(t => t.Slug == SeedFixtures.SoldOutTicketSlug);
        Assert.Equal(student.Capacity, await db.Attendees.CountAsync(a => a.TicketTypeId == student.Id));

        Assert.True(await db.Sessions.AnyAsync(s => s.Slug == SeedFixtures.UnsafeMarkdownSessionSlug));
        Assert.True(await db.Speakers.AnyAsync(s => s.Slug == SeedFixtures.FeaturedSpeakerSlug));
        Assert.True(await db.DiscountCodes.AnyAsync(d => d.Code == SeedFixtures.ValidDiscountCode));
        Assert.True(await db.OrganizerAccounts.AnyAsync(a => a.Email == "organizer@summit.test"));
    }

    [Fact]
    public async Task Seeding_is_deterministic()
    {
        await using var scope = factory.Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<SummitDbContext>();

        var attendees = await db.Attendees.CountAsync();
        var orders = await db.Orders.CountAsync();
        var firstSpeakers = await db.Speakers.OrderBy(s => s.Id).Select(s => s.Name).Skip(6).Take(3).ToListAsync();
        var revenue = (await db.Orders.Where(o => o.Status != OrderStatus.Refunded).Select(o => o.Total).ToListAsync()).Sum();

        Assert.Equal(Snapshot.Attendees, attendees);
        Assert.Equal(Snapshot.Orders, orders);
        Assert.Equal(Snapshot.GeneratedSpeakers, firstSpeakers);
        Assert.Equal(Snapshot.Revenue, revenue);
    }

    /// <summary>Recorded from a known-good run.</summary>
    private static class Snapshot
    {
        public const int Attendees = 660;
        public const int Orders = 435;
        public static readonly string[] GeneratedSpeakers = ["Marisol Mayer", "Moses Nolan", "Katelynn Daugherty"];
        public const decimal Revenue = 384706.60m;
    }
}
