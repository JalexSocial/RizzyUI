
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A visual separator for use within a <see cref="CommandList"/> or <see cref="CommandGroup"/>.
/// </summary>
public partial class CommandSeparator : RzComponent<CommandSeparator.Slots>
{
    /// <summary>
    /// Defines the default styling for the CommandSeparator component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "-mx-1 my-1 h-px bg-border"
    );

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.CommandSeparator;

    /// <summary>
    /// Defines the slots available for styling in the CommandSeparator component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("command-separator")]
        public string? Base { get; set; }
    }
}