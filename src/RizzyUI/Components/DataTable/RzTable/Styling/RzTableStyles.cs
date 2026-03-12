using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines styling properties for an <see cref="RzTable"/> component.
/// </summary>
public interface IHasTableStylingProperties
{
    /// <summary>
    /// Gets a value indicating whether border chrome is enabled.
    /// </summary>
    public bool Border { get; }

    /// <summary>
    /// Gets a value indicating whether the table header should be fixed.
    /// </summary>
    public bool FixedHeader { get; }
}

/// <summary>
/// Defines the slots available for styling in the <see cref="RzTable"/> component.
/// </summary>
public sealed partial class RzTableSlots : ISlots
{
    /// <summary>
    /// The base slot for the table container.
    /// </summary>
    [Slot("table-container")]
    public string? Base { get; set; }

    /// <summary>
    /// The slot for the inner <c>table</c> element.
    /// </summary>
    [Slot("table")]
    public string? Table { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the <see cref="RzTable"/> component.
/// </summary>
public static class RzTableStyles
{
    /// <summary>
    /// The default <see cref="TvDescriptor{TComponent,TSlots}"/> for table styling.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<RzTableSlots>, RzTableSlots> DefaultDescriptor = new(
        @base: "relative w-full overflow-x-auto",
        slots: new()
        {
            [s => s.Table] = "w-full caption-bottom text-sm"
        },
        variants: new()
        {
            [c => ((IHasTableStylingProperties)c).Border] = new Variant<bool, RzTableSlots>
            {
                [true] = new() { [s => s.Base] = "rounded-lg border" }
            },
            [c => ((IHasTableStylingProperties)c).FixedHeader] = new Variant<bool, RzTableSlots>
            {
                [true] = new() { [s => s.Base] = "relative overflow-y-auto" }
            }
        }
    );
}
