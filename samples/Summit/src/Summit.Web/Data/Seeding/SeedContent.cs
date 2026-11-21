namespace Summit.Web.Data.Seeding;

/// <summary>
/// Hand-written content for the seed: tracks, rooms, featured speakers, FAQs and the building blocks
/// of session titles. Everything here is fictional: the city, venue, companies and people.
/// </summary>
internal static class SeedContent
{
    public sealed record TrackSeed(string Slug, string Name, string Description, string Color, string[] Topics, string CodeLanguage, string CodeSample);

    public static readonly TrackSeed[] Tracks =
    [
        new("web", "Web & Frontend",
            "Server rendering, htmx, Alpine.js, modern CSS and everything the browser can do without a build step.",
            "#6d5efc",
            ["htmx 4", "server-rendered Blazor", "Alpine.js", "CSS container queries", "view transitions", "web components",
             "accessible forms", "Tailwind CSS v4", "progressive enhancement", "HTTP caching", "streaming rendering", "design tokens",
             "hypermedia APIs", "Content Security Policy", "the platform's dialog element", "browser performance budgets"],
            "csharp",
            """
            // A fragment endpoint: htmx swaps this markup into the page.
            app.MapGet("/fragments/sessions/{id:int}/card", async (int id, SummitDbContext db, IRizzyService rizzy) =>
            {
                var session = await db.Sessions.Include(s => s.Track).SingleOrDefaultAsync(s => s.Id == id);
                return session is null
                    ? Results.NotFound()
                    : rizzy.PartialView<SessionCard>(new { Session = session });
            });
            """),
        new("cloud", "Cloud & Platforms",
            "Distributed systems, serverless, data stores and running .NET at scale.",
            "#0ea5e9",
            ["event-driven architecture", "serverless .NET", "multi-region failover", "Postgres at scale", "message queues",
             "cost-aware architecture", "zero-downtime migrations", "OpenTelemetry", "rate limiting", "edge computing",
             "workload identity", "cloud-native caching", "background jobs", "API gateways", "durable workflows", "chaos engineering"],
            "csharp",
            """
            builder.Services.AddRateLimiter(options =>
            {
                options.AddTokenBucketLimiter("api", limiter =>
                {
                    limiter.TokenLimit = 100;
                    limiter.TokensPerPeriod = 20;
                    limiter.ReplenishmentPeriod = TimeSpan.FromSeconds(10);
                });
            });
            """),
        new("ai", "AI in Practice",
            "Shipping features built on language models: retrieval, evaluation, agents and guardrails.",
            "#a855f7",
            ["retrieval-augmented generation", "LLM evaluation", "agent workflows", "prompt caching", "structured outputs",
             "vector search", "AI guardrails", "tool calling", "fine-tuning small models", "AI-assisted code review",
             "semantic search", "streaming responses", "model routing", "on-device inference", "AI observability", "synthetic test data"],
            "csharp",
            """
            var response = await client.Messages.CreateAsync(new()
            {
                Model = "claude-sonnet-5-5",
                MaxTokens = 1024,
                Messages = [new() { Role = "user", Content = question }],
            });
            """),
        new("devops", "DevOps & Delivery",
            "Pipelines, infrastructure as code, observability and the culture that makes them work.",
            "#10b981",
            ["GitHub Actions", "infrastructure as code", "feature flags", "trunk-based development", "container security",
             "platform engineering", "incident response", "SLOs that matter", "release trains", "supply-chain security",
             "flaky test triage", "preview environments", "database DevOps", "on-call health", "progressive delivery", "build caching"],
            "yaml",
            """
            jobs:
              test:
                runs-on: ubuntu-24.04
                steps:
                  - uses: actions/checkout@v7
                  - uses: actions/setup-dotnet@v6
                    with:
                      global-json-file: global.json
                  - run: dotnet test -c Release
            """),
        new("design", "Design & Accessibility",
            "Inclusive design, accessible components, design systems and the craft of interfaces.",
            "#f97316",
            ["accessible data tables", "focus management", "screen reader testing", "design systems", "color contrast",
             "motion and reduced motion", "inclusive forms", "dark mode done right", "keyboard-first interfaces", "WCAG 2.2",
             "cognitive accessibility", "typography for interfaces", "empty states", "error messages", "touch targets", "UX writing"],
            "css",
            """
            @media (prefers-reduced-motion: reduce) {
              *, *::before, *::after {
                animation-duration: 0.01ms !important;
                transition-duration: 0.01ms !important;
              }
            }
            """),
    ];

    public static readonly string[] TitlePatterns =
    [
        "{0} in production: lessons from a year of shipping",
        "Beyond the basics: {0}",
        "{0} without the framework tax",
        "A field guide to {0}",
        "What we got wrong about {0}",
        "Scaling {0} past the first million users",
        "Testing {0} end to end",
        "{0}: the missing manual",
        "From zero to {0} in one sprint",
        "The hidden costs of {0}",
        "{0}, explained with real incidents",
        "Rethinking {0} for small teams",
    ];

    public sealed record RoomSeed(string Name, string Floor, int Capacity);

    public static readonly RoomSeed[] Rooms =
    [
        new("Main Hall", "Ground floor", 900),
        new("Harbor Room", "Level 1", 320),
        new("Lighthouse", "Level 1", 220),
        new("Atrium A", "Level 2", 140),
        new("Atrium B", "Level 2", 140),
        new("Workshop Lab", "Level 2", 40),
    ];

    public static readonly string[] DayThemes = ["Build", "Scale", "Ship"];

    public sealed record FeaturedSpeaker(string Name, string Title, string Company, string Country, string Track, string Portrait, string Bio);

    public static readonly FeaturedSpeaker[] FeaturedSpeakers =
    [
        new("Amara Okafor", "Staff Engineer", "Kite & Compass", "Nigeria", "web", "speaker-1",
            "Amara leads the web platform team at Kite & Compass, where she moved a 400-page product from a single-page app back to server rendering. She writes about hypermedia, performance budgets and keeping JavaScript small."),
        new("Henrik Lindqvist", "Principal Architect", "Bluefin Systems", "Sweden", "cloud", "speaker-2",
            "Henrik has designed payment systems that move money across 30 countries. He cares about failure modes, boring technology and runbooks people actually read."),
        new("Mei Tanaka", "Machine Learning Researcher", "Brightpath Labs", "Japan", "ai", "speaker-3",
            "Mei builds evaluation pipelines for language-model features and has strong opinions about test sets. Before Brightpath she worked on search ranking."),
        new("Diego Alvarez", "Platform Engineer", "Orbital Forge", "Mexico", "devops", "speaker-4",
            "Diego runs the internal developer platform at Orbital Forge: 900 services, one golden path. He talks about build caching, preview environments and on-call health."),
        new("Margaret Ellison", "Head of Accessibility", "Fernhill Software", "Ireland", "design", "speaker-5",
            "Margaret has spent 25 years making software usable for everyone. She leads accessibility at Fernhill and trains teams to test with real assistive technology."),
        new("Robin Castellanos", "Front-end Developer", "Driftwood Studio", "Spain", "web", "speaker-6",
            "Robin (they/them) builds design systems and component libraries, and maintains several open-source accessibility tools."),
    ];

    public static readonly string[] SpeakerTitles =
    [
        "Senior Software Engineer", "Staff Engineer", "Principal Engineer", "Engineering Manager", "Developer Advocate",
        "Solutions Architect", "Site Reliability Engineer", "Product Designer", "Data Scientist", "CTO", "Independent Consultant",
        "Security Engineer", "Tech Lead", "Open-source Maintainer",
    ];

    public static readonly string[] Companies =
    [
        "Kite & Compass", "Bluefin Systems", "Brightpath Labs", "Orbital Forge", "Fernhill Software", "Driftwood Studio",
        "Northgale Labs", "Quietwave", "Lattice Works", "Copperline", "Stackhaven", "Meridian Data", "Pinecrest Cloud",
        "Ironbark Security", "Tidepool Analytics", "Halcyon Health Tech", "Saltmarsh Games", "Juniper Logistics",
    ];

    public static readonly (string Name, int Weight)[] Countries =
    [
        ("Germany", 22), ("United Kingdom", 10), ("Netherlands", 8), ("France", 7), ("Spain", 5), ("Poland", 5),
        ("Sweden", 4), ("Austria", 4), ("Switzerland", 4), ("United States", 8), ("Canada", 3), ("Portugal", 3),
        ("Italy", 3), ("Ireland", 2), ("Denmark", 2), ("Norway", 2), ("Nigeria", 2), ("India", 3), ("Brazil", 2), ("Japan", 1),
    ];

    public sealed record TicketSeed(string Slug, string Name, string Description, decimal Price, int Capacity, bool IncludesWorkshop, string Perks, int Weight);

    public static readonly TicketSeed[] Tickets =
    [
        new("conference", "Conference Pass", "Three days of talks, keynotes and the evening party.", 649m, 900, false,
            "All talks and keynotes\nLunch and coffee all three days\nEvening party on day 2\nSession recordings", 62),
        new("conference-workshop", "Conference + Workshop", "Everything in the Conference Pass plus one hands-on workshop.", 899m, 120, true,
            "Everything in the Conference Pass\nOne 90-minute workshop of your choice\nWorkshop materials to keep", 18),
        new("student", "Student", "For full-time students, with valid student ID at check-in.", 199m, 60, false,
            "All talks and keynotes\nLunch all three days\nMentoring hour", 10),
        new("virtual", "Virtual", "Live stream of the Main Hall and every recording.", 99m, 2000, false,
            "Live stream of the Main Hall\nAll recordings within a week\nVirtual hallway chat", 10),
        new("supporter", "Supporter", "Fund a diversity scholarship and get the front row.", 1299m, 40, false,
            "Everything in the Conference Pass\nReserved front-row seating\nSpeaker dinner invitation\nFunds one scholarship ticket", 0),
    ];

    public static readonly (string Name, Entities.SponsorTier Tier)[] Sponsors =
    [
        ("Pinecrest Cloud", Entities.SponsorTier.Platinum), ("Stackhaven", Entities.SponsorTier.Platinum),
        ("Meridian Data", Entities.SponsorTier.Gold), ("Ironbark Security", Entities.SponsorTier.Gold), ("Quietwave", Entities.SponsorTier.Gold),
        ("Lattice Works", Entities.SponsorTier.Silver), ("Copperline", Entities.SponsorTier.Silver), ("Tidepool Analytics", Entities.SponsorTier.Silver),
        ("Northgale Labs", Entities.SponsorTier.Silver), ("Saltmarsh Games", Entities.SponsorTier.Community), ("Juniper Logistics", Entities.SponsorTier.Community),
        ("Halcyon Health Tech", Entities.SponsorTier.Community), ("Driftwood Studio", Entities.SponsorTier.Community), ("Brightpath Labs", Entities.SponsorTier.Community),
    ];

    public sealed record FaqSeed(string Category, string Question, string Answer);

    public static readonly FaqSeed[] Faqs =
    [
        new("Tickets", "Can I transfer my ticket to a colleague?",
            "Yes. Ask us at **help@summit.example** with the order number and the new attendee's name and email, up to the day before the event. There is no fee."),
        new("Tickets", "Do you offer refunds?",
            "Tickets are refundable until 30 days before the conference, minus a 10% processing fee. After that you can transfer the ticket instead."),
        new("Tickets", "Is there a group discount?",
            "Teams of five or more get 15% off every ticket. Write to us for a code before you check out."),
        new("Tickets", "What does the Student ticket require?",
            "A valid student ID for the current academic year, shown at check-in. Student tickets are limited and usually sell out early."),
        new("Tickets", "Can I pay by invoice?",
            "Yes. Choose **Invoice** at the payment step. Invoices are due within 30 days and must be paid before the event."),
        new("Tickets", "Where do I find my badge code?",
            "In your confirmation email and on the confirmation page, as six letters and digits. You can type it at the check-in desk if you forgot your phone."),
        new("Venue & travel", "Where is Summit held?",
            "At Harbor Hall on the Kestrel Harbor waterfront, a five-minute walk from Central Station. The Main Hall is on the ground floor; all rooms are step-free."),
        new("Venue & travel", "Is there a conference hotel?",
            "Two partner hotels hold rooms at a reduced rate until four weeks before the event. The links are in your confirmation email."),
        new("Venue & travel", "Is there parking?",
            "Harbor Hall has no parking of its own. The Waterfront garage is 300 m away; accessible parking spaces can be reserved through us."),
        new("Venue & travel", "Is there a cloakroom?",
            "Yes, free of charge, next to the registration desk. Large luggage is welcome on the last day."),
        new("Venue & travel", "What is the Wi-Fi?",
            "Network and password are printed on the back of your badge. Talks are streamed on the venue network too."),
        new("Venue & travel", "Is the venue accessible?",
            "Every room is step-free, with induction loops in the Main Hall and the Harbor Room. Tell us about any needs when you register and we will contact you."),
        new("Program", "Will talks be recorded?",
            "Every talk and keynote is recorded and published within a week. Workshops are not recorded."),
        new("Program", "How do I choose a workshop?",
            "With a Conference + Workshop ticket you pick one workshop during checkout. Seats are limited to 40 per workshop and are assigned in order of purchase."),
        new("Program", "Can I switch rooms between talks?",
            "Of course. Talks are 45 minutes with 15-minute breaks, so there is time to move. Popular talks can fill up; the schedule shows each room's capacity."),
        new("Program", "Do I need to register for talks?",
            "No. Add talks to **My agenda** to plan your days, but seating is first come, first served."),
        new("Program", "Is there a code of conduct?",
            "Yes, and it applies to everyone: attendees, speakers, sponsors and staff. You accept it when you buy a ticket. Report anything to a staff member in an indigo T-shirt."),
        new("Program", "Can I submit a talk for next year?",
            "The call for papers opens three months after the event. Subscribe to the newsletter to hear when."),
        new("Accessibility", "Do talks have captions?",
            "Live captions are shown on a second screen in the Main Hall and the Harbor Room, and every recording has edited captions."),
        new("Accessibility", "Is there a quiet room?",
            "Yes, on Level 2 next to Atrium B, open all day. Phones on silent, lights dimmed."),
        new("Accessibility", "Can I bring a personal assistant?",
            "Yes. Personal assistants attend free of charge; add their name in the accessibility field when you register."),
        new("Accessibility", "Are there dietary options?",
            "All lunches have vegetarian, vegan, halal and gluten-free options. Tell us about allergies when you register."),
        new("Accessibility", "Are there gender-neutral restrooms?",
            "Yes, on every floor, marked on the venue map."),
        new("Accessibility", "Can I request a seat near the front?",
            "Yes. Reserved seats near the stage and screens are kept free for attendees who need them; ask any staff member."),
    ];

    public static readonly string[] OrganizerNames = ["Jordan Blake", "Priya Raman", "Sam Okoye", "Lena Fischer"];

    public static readonly string[] AttendeeTags = ["VIP", "Press", "Volunteer", "Speaker", "Sponsor", "Scholarship"];
}
