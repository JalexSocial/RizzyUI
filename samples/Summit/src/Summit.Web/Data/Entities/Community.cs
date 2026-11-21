namespace Summit.Web.Data.Entities;

/// <summary>A session an anonymous visitor added to "my agenda".</summary>
public sealed class AgendaItem
{
    public int Id { get; set; }
    public required string VisitorId { get; set; }
    public int SessionId { get; set; }
    public Session Session { get; set; } = null!;
    public DateTimeOffset AddedAt { get; set; }
}

public sealed class FaqEntry
{
    public int Id { get; set; }
    public required string Category { get; set; }
    public required string Question { get; set; }
    public required string AnswerMarkdown { get; set; }
    public int SortOrder { get; set; }
}

public sealed class SupportRequest
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string Topic { get; set; }
    public required string Message { get; set; }
    public string? AttachmentName { get; set; }
    public long? AttachmentSize { get; set; }
    public DateTimeOffset ReceivedAt { get; set; }
}
