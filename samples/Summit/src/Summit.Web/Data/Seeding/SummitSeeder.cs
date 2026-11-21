using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Bogus;
using Microsoft.AspNetCore.Identity;
using Summit.Web.Data.Entities;
using Summit.Web.Infrastructure;
using static Summit.Web.Data.Seeding.SeedContent;

namespace Summit.Web.Data.Seeding;

/// <summary>
/// Fills an empty database with a deterministic conference: the same seed and the same "now" always
/// produce the same rows (Summit.Tests snapshots them).
/// </summary>
internal sealed class SummitSeeder(SummitDbContext db, TimeProvider clock, SummitOptions options)
{
    private const string BadgeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    private readonly Randomizer _random = new(SeedFixtures.RandomSeed);
    private readonly HashSet<string> _badgeCodes = [SeedFixtures.RegisteredBadgeCode, SeedFixtures.CheckedInBadgeCode];
    private Faker _faker = null!;
    private DateTimeOffset _now;

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        _faker = new Faker("en") { Random = _random };
        _now = clock.GetUtcNow();
        var startsOn = DateOnly.FromDateTime(_now.UtcDateTime).AddDays(SeedFixtures.DaysUntilConference);

        var conference = new Conference
        {
            Name = $"Summit {startsOn.Year}",
            Tagline = "Three days of building for the web, the cloud and everyone who uses them.",
            City = "Kestrel Harbor",
            Venue = "Harbor Hall",
            StartsOn = startsOn,
            EndsOn = startsOn.AddDays(2),
            TimeZoneId = "Europe/Berlin",
            Currency = "EUR",
        };
        db.Conferences.Add(conference);

        var days = DayThemes.Select((theme, i) => new ConferenceDay { Number = i + 1, Date = startsOn.AddDays(i), Theme = theme }).ToList();
        var tracks = Tracks.Select((t, i) => new Track
        {
            Slug = t.Slug, Name = t.Name, Description = t.Description, Color = t.Color,
            Image = $"/images/tracks/track-{t.Slug}.webp", SortOrder = i,
        }).ToList();
        var rooms = Rooms.Select(r => new Room { Name = r.Name, Floor = r.Floor, Capacity = r.Capacity }).ToList();
        db.Days.AddRange(days);
        db.Tracks.AddRange(tracks);
        db.Rooms.AddRange(rooms);

        var speakers = CreateSpeakers(tracks);
        db.Speakers.AddRange(speakers.Select(s => s.Speaker));

        var sessions = CreateSessions(days, tracks, rooms, speakers);
        db.Sessions.AddRange(sessions);

        db.Sponsors.AddRange(Sponsors.Select(s => new Sponsor { Name = s.Name, Tier = s.Tier, Logo = $"/images/sponsors/{Slugify(s.Name)}.svg" }));

        var ticketTypes = CreateTicketTypes(startsOn);
        db.TicketTypes.AddRange(ticketTypes);
        db.DiscountCodes.AddRange(CreateDiscountCodes(startsOn));

        var workshops = sessions.Where(s => s.Format == SessionFormat.Workshop).ToList();
        db.Orders.AddRange(CreateOrders(ticketTypes, workshops));

        db.Faqs.AddRange(Faqs.Select((f, i) => new FaqEntry { Category = f.Category, Question = f.Question, AnswerMarkdown = f.Answer, SortOrder = i }));
        db.Settings.Add(new EventSettings { SupportEmail = "help@summit.example" });
        db.ApiKeys.AddRange(CreateApiKeys());
        db.AuditEvents.AddRange(CreateAuditEvents());

        if (!string.IsNullOrWhiteSpace(options.DemoOrganizer.Email))
        {
            var account = new OrganizerAccount { Email = options.DemoOrganizer.Email, Name = options.DemoOrganizer.Name, PasswordHash = "" };
            account.PasswordHash = new PasswordHasher<OrganizerAccount>().HashPassword(account, options.DemoOrganizer.Password);
            db.OrganizerAccounts.Add(account);
        }

        await db.SaveChangesAsync(cancellationToken);
    }

    private sealed record SpeakerSeed(Speaker Speaker, string TrackSlug)
    {
        public int SessionCount { get; set; }
    }

    private List<SpeakerSeed> CreateSpeakers(List<Track> tracks)
    {
        var result = FeaturedSpeakers.Select(f => new SpeakerSeed(new Speaker
        {
            Slug = Slugify(f.Name), Name = f.Name, Title = f.Title, Company = f.Company, Country = f.Country,
            BioMarkdown = f.Bio, Portrait = $"/images/speakers/{f.Portrait}.webp", Featured = true,
        }, f.Track)).ToList();

        var slugs = result.Select(s => s.Speaker.Slug).ToHashSet();
        var i = 0;
        while (result.Count < 64)
        {
            var name = _faker.Name.FullName();
            var slug = Slugify(name);
            if (!slugs.Add(slug))
                continue;

            var track = Tracks[i++ % Tracks.Length];
            var title = _random.ArrayElement(SpeakerTitles);
            var company = _random.ArrayElement(Companies);
            var first = name.Split(' ')[0];
            var topic = _random.ArrayElement(track.Topics);
            var bio = $"{first} is a {title.ToLowerInvariant()} at {company}, working on {topic}. "
                      + _random.ArrayElement(new[]
                      {
                          $"Before that, {first} spent years on {_random.ArrayElement(track.Topics)} and still has the scars to prove it.",
                          $"{first} speaks regularly at meetups and maintains a small open-source library for {_random.ArrayElement(track.Topics)}.",
                          $"Outside work, {first} mentors new developers and writes a newsletter about {track.Name.ToLowerInvariant()}.",
                          $"{first} has given talks on three continents and believes every system should be explainable on a whiteboard.",
                      });

            result.Add(new SpeakerSeed(new Speaker
            {
                Slug = slug, Name = name, Title = title, Company = company, Country = WeightedCountry(),
                BioMarkdown = bio, Featured = false,
            }, track.Slug));
        }

        return result;
    }

    private List<Session> CreateSessions(List<ConferenceDay> days, List<Track> tracks, List<Room> rooms, List<SpeakerSeed> speakers)
    {
        var sessions = new List<Session>();
        var titles = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var topicQueues = Tracks.ToDictionary(t => t.Slug, t => new Queue<string>(_random.Shuffle(t.Topics)));
        var talkRooms = rooms.Take(5).ToList();
        var mainHall = rooms[0];
        var lab = rooms[5];

        string[] keynoteTitles =
        [
            "Opening keynote: the web is a hypermedia platform again",
            "Keynote: boring systems that never sleep",
            "Keynote: accessible by default",
        ];
        string[] keynoteSpeakers = ["amara-okafor", "henrik-lindqvist", "margaret-ellison"];
        string[] keynoteTracks = ["web", "cloud", "design"];

        TimeOnly[] talkSlots = [new(10, 30), new(11, 30), new(13, 30), new(14, 30), new(15, 30), new(16, 30)];
        TimeOnly[] workshopSlots = [new(10, 30), new(13, 30), new(15, 30)];
        int[] workshopsPerDay = [3, 2, 1];

        for (var d = 0; d < days.Count; d++)
        {
            var day = days[d];
            var date = day.Date;

            sessions.Add(CreateSession(keynoteTitles[d], tracks.Single(t => t.Slug == keynoteTracks[d]), mainHall, day,
                date.ToDateTime(new TimeOnly(9, 0)), 60, SessionFormat.Keynote, SessionLevel.Beginner,
                [speakers.Single(s => s.Speaker.Slug == keynoteSpeakers[d])]));

            for (var slot = 0; slot < talkSlots.Length; slot++)
            {
                if (d == 2 && slot == talkSlots.Length - 1)
                {
                    sessions.Add(CreateSession("Closing keynote: evaluating what we ship", tracks.Single(t => t.Slug == "ai"), mainHall, day,
                        date.ToDateTime(talkSlots[slot]), 60, SessionFormat.Keynote, SessionLevel.Beginner,
                        [speakers.Single(s => s.Speaker.Slug == "mei-tanaka")]));
                    continue;
                }

                for (var t = 0; t < tracks.Count; t++)
                {
                    var track = tracks[t];
                    var room = talkRooms[(t + slot + d) % talkRooms.Count];
                    var format = SessionFormat.Talk;
                    string title;

                    if (room == mainHall && d == 1 && slot == 4)
                    {
                        format = SessionFormat.Panel;
                        title = $"Panel: the future of {track.Name.ToLowerInvariant()}";
                    }
                    else if (room == mainHall && d == 2 && slot == 2)
                    {
                        format = SessionFormat.Lightning;
                        title = $"Lightning talks: {track.Name.ToLowerInvariant()} in five minutes each";
                    }
                    else
                    {
                        title = NextTitle(track.Slug, topicQueues, titles);
                    }

                    var speakerCount = format == SessionFormat.Panel ? 3 : format == SessionFormat.Lightning ? 4 : _random.Bool(0.12f) ? 2 : 1;
                    sessions.Add(CreateSession(title, track, room, day, date.ToDateTime(talkSlots[slot]), 45, format,
                        WeightedLevel(), PickSpeakers(speakers, track.Slug, speakerCount)));
                }
            }

            for (var w = 0; w < workshopsPerDay[d]; w++)
            {
                var track = tracks[(d * 3 + w) % tracks.Count];
                var topic = _random.ArrayElement(Tracks.Single(t => t.Slug == track.Slug).Topics);
                var title = UniqueTitle($"Workshop: hands-on {topic}", titles);
                sessions.Add(CreateSession(title, track, lab, day, date.ToDateTime(workshopSlots[w]), 90, SessionFormat.Workshop,
                    _random.Bool() ? SessionLevel.Intermediate : SessionLevel.Advanced, PickSpeakers(speakers, track.Slug, 1)));
            }
        }

        // One web talk carries unsafe HTML in its abstract, to show that RzMarkdown renders it as text.
        var unsafeSession = sessions.First(s => s.Track.Slug == "web" && s.Format == SessionFormat.Talk && s.Day.Number == 2);
        unsafeSession.Title = "Rendering untrusted Markdown safely";
        unsafeSession.Slug = SeedFixtures.UnsafeMarkdownSessionSlug;
        unsafeSession.Summary = "User-generated Markdown is an attack surface. Here is how to render it without handing over your page.";
        unsafeSession.AbstractMarkdown = UnsafeAbstract;

        // Two drafts that only the schedule builder shows.
        foreach (var draft in sessions.Where(s => s.Format == SessionFormat.Talk).Reverse().Take(2))
            draft.Status = SessionStatus.Draft;

        return sessions;
    }

    private const string UnsafeAbstract =
        """
        Comment boxes, issue trackers and CMS fields all accept Markdown, and Markdown accepts HTML. This talk
        walks through what a safe renderer must do, with live examples like these:

        <script>alert('If you can see this dialog, the renderer is unsafe.')</script>

        A link that tries to run code: [open the demo](javascript:alert('unsafe link'))

        An image with an event handler: <img src="missing.png" onerror="alert('unsafe image')">

        ## What you'll learn

        - Why HTML in Markdown is off by default in good renderers
        - How URL schemes are filtered, and why `javascript:` is only one of them
        - Where a Content Security Policy fits as the second line of defense
        """;

    private Session CreateSession(string title, Track track, Room room, ConferenceDay day, DateTime startsAt, int length,
        SessionFormat format, SessionLevel level, List<SpeakerSeed> sessionSpeakers)
    {
        var trackSeed = Tracks.Single(t => t.Slug == track.Slug);
        var topic = _random.ArrayElement(trackSeed.Topics);
        var session = new Session
        {
            Slug = Slugify(title),
            Title = title,
            Summary = Summary(format, track, topic),
            AbstractMarkdown = Abstract(format, trackSeed, topic),
            CodeSample = format is SessionFormat.Talk or SessionFormat.Workshop && _random.Bool(0.65f) ? trackSeed.CodeSample : null,
            Level = level,
            Format = format,
            Track = track,
            Room = room,
            Day = day,
            StartsAt = startsAt,
            LengthMinutes = length,
            Capacity = room.Capacity,
        };
        session.CodeLanguage = session.CodeSample is null ? null : trackSeed.CodeLanguage;
        session.Speakers = sessionSpeakers.Select((s, i) => new SessionSpeaker { Speaker = s.Speaker, Order = i }).ToList();
        return session;
    }

    private string Summary(SessionFormat format, Track track, string topic) => format switch
    {
        SessionFormat.Keynote => "The talk that sets the tone for the day, with time for questions afterwards.",
        SessionFormat.Panel => $"Practitioners from very different teams argue about where {track.Name.ToLowerInvariant()} is heading.",
        SessionFormat.Lightning => "Four short talks, one idea each, no slides longer than they need to be.",
        SessionFormat.Workshop => $"Bring a laptop: ninety minutes of guided, hands-on work with {topic}.",
        _ => _random.ArrayElement(new[]
        {
            $"A practical look at {topic}, with the trade-offs nobody puts in the README.",
            $"How one team adopted {topic}, what broke, and what they would do differently.",
            $"Patterns, pitfalls and a short checklist for {topic} in real products.",
            $"Everything you need to decide whether {topic} belongs in your stack.",
        }),
    };

    private string Abstract(SessionFormat format, TrackSeed track, string topic)
    {
        var learn = _random.Shuffle(track.Topics).Take(3).Select(t => $"- How {t} fits together with {topic}");
        var opening = format == SessionFormat.Workshop
            ? $"In this workshop you will build a small but complete feature using {topic}. We start from an empty project and finish with something you can deploy."
            : $"Teams adopt {topic} for good reasons, then discover the parts the tutorials skipped. This session follows a real codebase through that journey.";

        return $"""
            {opening}

            We will look at the decisions that matter in production: what to measure, what to automate, and where the sharp edges are. Expect concrete examples, not slogans.

            ## What you'll learn

            {string.Join("\n", learn)}

            **Level:** suitable for anyone who has shipped a web application. Slides and code are published after the conference.
            """;
    }

    private string NextTitle(string trackSlug, Dictionary<string, Queue<string>> topics, HashSet<string> titles)
    {
        var queue = topics[trackSlug];
        if (queue.Count == 0)
            foreach (var topic in _random.Shuffle(Tracks.Single(t => t.Slug == trackSlug).Topics))
                queue.Enqueue(topic);

        var next = queue.Dequeue();
        var title = string.Format(CultureInfo.InvariantCulture, _random.ArrayElement(TitlePatterns), next);
        return UniqueTitle(char.ToUpperInvariant(title[0]) + title[1..], titles);
    }

    private string UniqueTitle(string title, HashSet<string> titles)
    {
        var candidate = title;
        for (var n = 2; !titles.Add(candidate); n++)
            candidate = $"{title}, part {n}";
        return candidate;
    }

    private List<SpeakerSeed> PickSpeakers(List<SpeakerSeed> speakers, string trackSlug, int count)
    {
        var picked = speakers
            .Where(s => s.TrackSlug == trackSlug)
            .OrderBy(s => s.SessionCount)
            .ThenBy(_ => _random.Int())
            .Take(count)
            .ToList();
        foreach (var speaker in picked)
            speaker.SessionCount++;
        return picked;
    }

    private SessionLevel WeightedLevel() =>
        _random.WeightedRandom([SessionLevel.Beginner, SessionLevel.Intermediate, SessionLevel.Advanced], [0.3f, 0.45f, 0.25f]);

    private string WeightedCountry() =>
        Weighted(Countries.Select(c => c.Name).ToArray(), Countries.Select(c => (float)c.Weight).ToArray());

    /// <summary>Bogus' WeightedRandom needs weights that sum to 1; this takes any relative weights.</summary>
    private T Weighted<T>(T[] items, float[] weights)
    {
        var total = weights.Sum();
        return _random.WeightedRandom(items, weights.Select(w => w / total).ToArray());
    }

    private List<TicketType> CreateTicketTypes(DateOnly startsOn)
    {
        var salesEnd = new DateTimeOffset(startsOn.ToDateTime(new TimeOnly(9, 0)), TimeSpan.Zero);
        return Tickets.Select((t, i) => new TicketType
        {
            Slug = t.Slug, Name = t.Name, Description = t.Description, Price = t.Price, Capacity = t.Capacity,
            Perks = t.Perks, IncludesWorkshop = t.IncludesWorkshop, SortOrder = i,
            SalesStart = t.Slug == SeedFixtures.NotOnSaleTicketSlug ? _now.AddDays(3) : _now.AddDays(-120),
            SalesEnd = salesEnd,
        }).ToList();
    }

    private List<DiscountCode> CreateDiscountCodes(DateOnly startsOn)
    {
        var conferenceStart = new DateTimeOffset(startsOn.ToDateTime(TimeOnly.MinValue), TimeSpan.Zero);
        return
        [
            new() { Code = SeedFixtures.ValidDiscountCode, Percent = SeedFixtures.ValidDiscountPercent, MaxUses = 500, Uses = 37, ExpiresAt = conferenceStart },
            new() { Code = SeedFixtures.ExpiredDiscountCode, Percent = 15, MaxUses = 200, Uses = 88, ExpiresAt = _now.AddDays(-1) },
            new() { Code = SeedFixtures.UsedUpDiscountCode, Percent = 25, MaxUses = 10, Uses = 10, ExpiresAt = conferenceStart },
            new() { Code = "TEAMS5", Percent = 15, MaxUses = 100, Uses = 12, ExpiresAt = conferenceStart },
        ];
    }

    private List<Order> CreateOrders(List<TicketType> ticketTypes, List<Session> workshops)
    {
        var sellable = ticketTypes.Where(t => t.Slug != SeedFixtures.NotOnSaleTicketSlug).ToList();
        var weights = sellable.Select(t => (float)Tickets.Single(s => s.Slug == t.Slug).Weight).ToArray();
        var sold = ticketTypes.ToDictionary(t => t.Slug, _ => 0);
        var workshopSeats = workshops.ToDictionary(w => w, _ => 0);
        var orders = new List<Order>();
        var salesStart = _now.AddDays(-120);
        const int targetAttendees = 598;
        var attendeeCount = 0;

        // Order dates: denser towards "now", sorted so order numbers increase with time.
        var dates = new List<DateTimeOffset>();
        while (dates.Count < 420)
            dates.Add(salesStart.AddMinutes(Math.Sqrt(_random.Double()) * (_now - salesStart).TotalMinutes));
        dates.Sort();

        foreach (var createdAt in dates)
        {
            if (attendeeCount >= targetAttendees)
                break;

            var size = _random.WeightedRandom([1, 2, 3, 4, 5], [0.7f, 0.15f, 0.07f, 0.05f, 0.03f]);
            var ticket = Weighted(sellable.ToArray(), weights);
            if (sold[ticket.Slug] + size > ticket.Capacity)
                ticket = sellable.Single(t => t.Slug == SeedFixtures.ConferencePassSlug);

            var order = NewOrder(orders.Count, createdAt, ticket, size, workshops, workshopSeats);
            sold[ticket.Slug] += size;
            attendeeCount += size;
            orders.Add(order);
        }

        // The student allocation is exactly sold out.
        var student = sellable.Single(t => t.Slug == SeedFixtures.SoldOutTicketSlug);
        while (sold[student.Slug] < student.Capacity)
        {
            orders.Add(NewOrder(orders.Count, _now.AddHours(-_random.Int(2, 300)), student, 1, workshops, workshopSeats));
            sold[student.Slug]++;
        }

        // Fixture attendees for the check-in tests and demo.
        var pass = sellable.Single(t => t.Slug == SeedFixtures.ConferencePassSlug);
        var avery = NewOrder(orders.Count, _now.AddDays(-9), pass, 1, workshops, workshopSeats);
        var averyAttendee = avery.Attendees[0];
        avery.BuyerName = averyAttendee.Name = SeedFixtures.RegisteredAttendeeName;
        avery.BuyerEmail = averyAttendee.Email = "avery.quinn@example.com";
        averyAttendee.BadgeCode = SeedFixtures.RegisteredBadgeCode;
        averyAttendee.Status = AttendeeStatus.Registered;
        averyAttendee.CheckedInAt = null;
        orders.Add(avery);

        var jules = NewOrder(orders.Count, _now.AddDays(-30), pass, 1, workshops, workshopSeats);
        var julesAttendee = jules.Attendees[0];
        jules.BuyerName = julesAttendee.Name = SeedFixtures.CheckedInAttendeeName;
        jules.BuyerEmail = julesAttendee.Email = "jules.moreau@example.org";
        julesAttendee.BadgeCode = SeedFixtures.CheckedInBadgeCode;
        julesAttendee.Status = AttendeeStatus.CheckedIn;
        julesAttendee.CheckedInAt = _now.AddHours(-2);
        orders.Add(jules);

        return orders;
    }

    private Order NewOrder(int index, DateTimeOffset createdAt, TicketType ticket, int size, List<Session> workshops, Dictionary<Session, int> workshopSeats)
    {
        var buyerFirst = _faker.Name.FirstName();
        var buyerLast = _faker.Name.LastName();
        var company = _random.Bool(0.6f) ? _faker.Company.CompanyName() : null;
        var country = WeightedCountry();
        var refunded = _random.Bool(0.02f);
        var useDiscount = createdAt > _now.AddDays(-60) && _random.Bool(0.15f);

        var order = new Order
        {
            Number = $"SMT-{1001 + index}",
            BuyerName = $"{buyerFirst} {buyerLast}",
            BuyerEmail = Email(buyerFirst, buyerLast),
            Company = company,
            Country = country,
            CreatedAt = createdAt,
            Status = refunded ? OrderStatus.Refunded : _random.Bool(0.15f) ? OrderStatus.Invoiced : OrderStatus.Paid,
            DiscountCode = useDiscount ? SeedFixtures.ValidDiscountCode : null,
        };

        for (var i = 0; i < size; i++)
        {
            var first = i == 0 ? buyerFirst : _faker.Name.FirstName();
            var last = i == 0 ? buyerLast : _faker.Name.LastName();
            var checkedIn = !refunded && _random.Bool(0.12f);
            Session? workshop = null;
            if (ticket.IncludesWorkshop)
            {
                workshop = workshops.OrderBy(w => workshopSeats[w]).First();
                workshopSeats[workshop]++;
            }

            order.Attendees.Add(new Attendee
            {
                Name = $"{first} {last}",
                Email = Email(first, last),
                Company = company,
                Country = country,
                TicketType = ticket,
                WorkshopSession = workshop,
                TShirt = _random.WeightedRandom([TShirtSize.XS, TShirtSize.S, TShirtSize.M, TShirtSize.L, TShirtSize.XL, TShirtSize.XXL], [0.05f, 0.18f, 0.3f, 0.27f, 0.14f, 0.06f]),
                AccessibilityNeeds = _random.Bool(0.05f) ? _random.ArrayElement(new[] { "Wheelchair user", "Needs live captions", "Quiet room access", "Guide dog", "Seat near the front" }) : null,
                BadgeCode = NewBadgeCode(),
                Status = refunded ? AttendeeStatus.Cancelled : checkedIn ? AttendeeStatus.CheckedIn : AttendeeStatus.Registered,
                CheckedInAt = checkedIn ? _now.AddMinutes(-_random.Int(5, 600)) : null,
                Tags = _random.Bool(0.06f) ? _random.ArrayElement(AttendeeTags) : null,
                RegisteredAt = createdAt,
            });
        }

        order.Subtotal = ticket.Price * size;
        order.Discount = useDiscount ? Math.Round(order.Subtotal * SeedFixtures.ValidDiscountPercent / 100m, 2) : 0m;
        order.Total = order.Subtotal - order.Discount;
        return order;
    }

    private string Email(string first, string last) =>
        $"{Slugify(first).Replace("-", "")}.{Slugify(last).Replace("-", "")}@{_random.ArrayElement(new[] { "example.com", "example.org", "example.net" })}";

    private string NewBadgeCode()
    {
        while (true)
        {
            var code = new string(Enumerable.Range(0, 6).Select(_ => BadgeAlphabet[_random.Int(0, BadgeAlphabet.Length - 1)]).ToArray());
            if (_badgeCodes.Add(code))
                return code;
        }
    }

    private IEnumerable<ApiKey> CreateApiKeys()
    {
        (string Name, string Scopes, int AgeDays, bool Revoked)[] keys =
        [
            ("Badge printer", "attendees:read", 40, false),
            ("Website schedule feed", "sessions:read,speakers:read", 75, false),
            ("Old CRM sync", "attendees:read,orders:read", 160, true),
        ];

        foreach (var key in keys)
        {
            var secret = "smt_live_" + Convert.ToHexStringLower(_random.Bytes(16));
            yield return new ApiKey
            {
                Name = key.Name,
                Prefix = secret[..13],
                Hash = Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(secret))),
                Scopes = key.Scopes,
                CreatedAt = _now.AddDays(-key.AgeDays),
                LastUsedAt = key.Revoked ? _now.AddDays(-key.AgeDays + 30) : _now.AddHours(-_random.Int(1, 48)),
                RevokedAt = key.Revoked ? _now.AddDays(-20) : null,
            };
        }
    }

    private IEnumerable<AuditEvent> CreateAuditEvents()
    {
        (string Action, string Entity, Func<string> Summary)[] templates =
        [
            ("attendee.updated", "Attendee", () => $"Updated attendee {_faker.Name.FullName()}"),
            ("attendee.checked_in", "Attendee", () => $"Checked in {_faker.Name.FullName()} at the desk"),
            ("session.published", "Session", () => "Published a session"),
            ("session.rescheduled", "Session", () => $"Moved a session to {_random.ArrayElement(Rooms).Name}"),
            ("order.refunded", "Order", () => $"Refunded order SMT-{_random.Int(1001, 1400)}"),
            ("ticket.capacity_changed", "TicketType", () => "Changed ticket capacity"),
            ("settings.changed", "EventSettings", () => "Changed event settings"),
            ("apikey.created", "ApiKey", () => "Created an API key"),
        ];

        for (var i = 0; i < 250; i++)
        {
            var template = _random.ArrayElement(templates);
            var at = _now.AddMinutes(-_random.Int(10, 30 * 24 * 60));
            yield return new AuditEvent
            {
                At = at,
                Actor = _random.ArrayElement(OrganizerNames),
                Action = template.Action,
                EntityType = template.Entity,
                EntityId = _random.Int(1, 600).ToString(CultureInfo.InvariantCulture),
                Summary = template.Summary(),
                DataJson = JsonSerializer.Serialize(new { source = _random.ArrayElement(new[] { "dashboard", "api", "check-in desk" }), ip = "203.0.113." + _random.Int(1, 254) }),
            };
        }
    }

    internal static string Slugify(string value)
    {
        var builder = new StringBuilder(value.Length);
        foreach (var c in value.Normalize(NormalizationForm.FormD).ToLowerInvariant())
        {
            if (CharUnicodeInfo.GetUnicodeCategory(c) == UnicodeCategory.NonSpacingMark)
                continue;
            builder.Append(char.IsLetterOrDigit(c) ? c : '-');
        }

        var slug = builder.ToString();
        while (slug.Contains("--"))
            slug = slug.Replace("--", "-");
        return slug.Trim('-');
    }
}
