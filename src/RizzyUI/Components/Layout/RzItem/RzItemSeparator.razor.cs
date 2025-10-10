
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A visual separator for use within an <see cref="RzItemGroup"/>.
/// </summary>
public partial class RzItemSeparator : RzComponent<RzItemSeparator.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzItemSeparator component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "my-0"
    );

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzItemSeparator;

    /// <summary>
    /// Defines the slots available for styling in the RzItemSeparator component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}