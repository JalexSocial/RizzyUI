
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines the slots available for styling in the RzTabStrip component.
/// </summary>
public sealed partial class RzTabStripSlots : ISlots
{
    /// <summary>
    /// The base slot for the main tab strip container.
    /// </summary>
    public string? Base { get; set; }
    /// <summary>
    /// The slot for the selection marker element.
    /// </summary>
    public string? Marker { get; set; }
    /// <summary>
    /// The slot for the inner element of the selection marker.
    /// </summary>
    public string? MarkerInner { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the RzTabStrip component.
/// </summary>
public static class RzTabStripStyles
{
    /// <summary>
    /// The default TvDescriptor for the RzTabStrip component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<RzTabStripSlots>, RzTabStripSlots> DefaultDescriptor = new(
        @base: "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        slots: new()
        {
            [s => s.Marker] = "hidden",
            [s => s.MarkerInner] = ""
        },
        variants: new()
        {
            [c => ((IHasTabStripStylingProperties)c).SelectedTabUnderlineColor] = new Variant<SemanticColor, RzTabStripSlots>
            {
                [SemanticColor.Primary] = new() { [s => s.Marker] = "after:bg-primary" },
                [SemanticColor.Secondary] = new() { [s => s.Marker] = "after:bg-secondary" },
                [SemanticColor.Success] = new() { [s => s.Marker] = "after:bg-success" },
                [SemanticColor.Warning] = new() { [s => s.Marker] = "after:bg-warning" },
                [SemanticColor.Destructive] = new() { [s => s.Marker] = "after:bg-destructive" },
                [SemanticColor.Info] = new() { [s => s.Marker] = "after:bg-info" }
            }
        }
    );
}