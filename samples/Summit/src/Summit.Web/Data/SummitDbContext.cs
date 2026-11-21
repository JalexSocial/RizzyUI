using Microsoft.EntityFrameworkCore;
using Summit.Web.Data.Entities;

namespace Summit.Web.Data;

public sealed class SummitDbContext(DbContextOptions<SummitDbContext> options) : DbContext(options)
{
    public DbSet<Conference> Conferences => Set<Conference>();
    public DbSet<ConferenceDay> Days => Set<ConferenceDay>();
    public DbSet<Track> Tracks => Set<Track>();
    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<Session> Sessions => Set<Session>();
    public DbSet<Speaker> Speakers => Set<Speaker>();
    public DbSet<SessionSpeaker> SessionSpeakers => Set<SessionSpeaker>();
    public DbSet<Sponsor> Sponsors => Set<Sponsor>();
    public DbSet<TicketType> TicketTypes => Set<TicketType>();
    public DbSet<DiscountCode> DiscountCodes => Set<DiscountCode>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Attendee> Attendees => Set<Attendee>();
    public DbSet<CheckoutDraft> CheckoutDrafts => Set<CheckoutDraft>();
    public DbSet<AgendaItem> AgendaItems => Set<AgendaItem>();
    public DbSet<FaqEntry> Faqs => Set<FaqEntry>();
    public DbSet<SupportRequest> SupportRequests => Set<SupportRequest>();
    public DbSet<OrganizerAccount> OrganizerAccounts => Set<OrganizerAccount>();
    public DbSet<EventSettings> Settings => Set<EventSettings>();
    public DbSet<ApiKey> ApiKeys => Set<ApiKey>();
    public DbSet<AuditEvent> AuditEvents => Set<AuditEvent>();

    protected override void OnModelCreating(ModelBuilder model)
    {
        model.Entity<Session>().HasIndex(s => s.Slug).IsUnique();
        model.Entity<Session>().Ignore(s => s.EndsAt);
        model.Entity<Speaker>().HasIndex(s => s.Slug).IsUnique();
        model.Entity<Speaker>().Ignore(s => s.Initials);
        model.Entity<Track>().HasIndex(t => t.Slug).IsUnique();
        model.Entity<TicketType>().HasIndex(t => t.Slug).IsUnique();
        model.Entity<TicketType>().Ignore(t => t.PerkList);
        model.Entity<DiscountCode>().HasIndex(d => d.Code).IsUnique();
        model.Entity<Order>().HasIndex(o => o.Number).IsUnique();
        model.Entity<Attendee>().HasIndex(a => a.BadgeCode).IsUnique();
        model.Entity<AgendaItem>().HasIndex(a => new { a.VisitorId, a.SessionId }).IsUnique();
        model.Entity<CheckoutDraft>().HasIndex(d => d.VisitorId).IsUnique();
        model.Entity<OrganizerAccount>().HasIndex(a => a.Email).IsUnique();
        model.Entity<AuditEvent>().HasIndex(a => a.At);

        model.Entity<SessionSpeaker>().HasKey(s => new { s.SessionId, s.SpeakerId });

        model.Entity<Attendee>()
            .HasOne(a => a.WorkshopSession).WithMany().HasForeignKey(a => a.WorkshopSessionId).OnDelete(DeleteBehavior.SetNull);

        // SQLite has no decimal type; EF stores decimals as TEXT and cannot ORDER BY or SUM them on the
        // server. Money is stored as integer cents instead.
        foreach (var property in model.Model.GetEntityTypes().SelectMany(t => t.GetProperties()).Where(p => p.ClrType == typeof(decimal)))
            property.SetValueConverter(new Microsoft.EntityFrameworkCore.Storage.ValueConversion.ValueConverter<decimal, long>(
                value => (long)Math.Round(value * 100m), cents => cents / 100m));

        // SQLite cannot ORDER BY or compare DateTimeOffset values; store them as UTC ticks.
        foreach (var property in model.Model.GetEntityTypes().SelectMany(t => t.GetProperties()))
        {
            if (property.ClrType == typeof(DateTimeOffset))
                property.SetValueConverter(new Microsoft.EntityFrameworkCore.Storage.ValueConversion.ValueConverter<DateTimeOffset, long>(
                    value => value.UtcTicks, ticks => new DateTimeOffset(ticks, TimeSpan.Zero)));
            else if (property.ClrType == typeof(DateTimeOffset?))
                property.SetValueConverter(new Microsoft.EntityFrameworkCore.Storage.ValueConversion.ValueConverter<DateTimeOffset?, long?>(
                    value => value.HasValue ? value.Value.UtcTicks : null, ticks => ticks.HasValue ? new DateTimeOffset(ticks.Value, TimeSpan.Zero) : null));
        }
    }
}
