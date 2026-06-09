using System.Text.Json.Serialization;

namespace RizzyUI.Services.RzToast.Internal;

internal sealed record class RzToastTransportOptions
{
    [JsonPropertyName("id")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Id { get; init; }

    [JsonPropertyName("status")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Status { get; init; }

    [JsonPropertyName("title")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Title { get; init; }

    [JsonPropertyName("text")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Text { get; init; }

    [JsonPropertyName("position")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Position { get; init; }

    [JsonPropertyName("tone")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Tone { get; init; }

    [JsonPropertyName("animation")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Animation { get; init; }

    [JsonPropertyName("duration")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? Duration { get; init; }

    [JsonPropertyName("speed")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? Speed { get; init; }

    [JsonPropertyName("autoclose")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? AutoClose { get; init; }

    [JsonPropertyName("dismissible")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Dismissible { get; init; }

    [JsonPropertyName("showIcon")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? ShowIcon { get; init; }

    [JsonPropertyName("progress")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Progress { get; init; }

    [JsonPropertyName("pauseOnHover")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? PauseOnHover { get; init; }

    [JsonPropertyName("pauseOnFocus")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? PauseOnFocus { get; init; }

    [JsonPropertyName("pauseOnWindowBlur")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? PauseOnWindowBlur { get; init; }

    [JsonPropertyName("closeOnEscape")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? CloseOnEscape { get; init; }

    [JsonPropertyName("preventDuplicates")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? PreventDuplicates { get; init; }

    [JsonPropertyName("dedupeKey")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? DedupeKey { get; init; }

    [JsonPropertyName("incrementCount")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? IncrementCount { get; init; }

    [JsonPropertyName("maxVisible")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? MaxVisible { get; init; }

    [JsonPropertyName("newestOnTop")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? NewestOnTop { get; init; }

    [JsonPropertyName("overflowStrategy")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? OverflowStrategy { get; init; }

    [JsonPropertyName("customClass")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? CustomClass { get; init; }

    [JsonPropertyName("classNames")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyDictionary<string, string>? ClassNames { get; init; }

    [JsonPropertyName("role")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Role { get; init; }

    [JsonPropertyName("ariaLive")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? AriaLive { get; init; }

    [JsonPropertyName("data")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? Data { get; init; }

    [JsonPropertyName("action")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public RzToastTransportAction? Action { get; init; }
}
