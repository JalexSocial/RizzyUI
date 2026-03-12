using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines the slots available for styling in the TableCaption component.
/// </summary>
public sealed partial class TableCaptionSlots : ISlots
{
    /// <summary>
    /// The base slot for the caption element.
    /// </summary>
    [Slot("table-caption")]
    public string? Base { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the TableCaption component.
/// </summary>
public static class TableCaptionStyles
{
    /// <summary>
    /// The default descriptor for table caption styling.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<TableCaptionSlots>, TableCaptionSlots> DefaultDescriptor = new(
        @base: "text-muted-foreground mt-4 text-sm"
    );
}
