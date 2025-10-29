
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// The input field for the command menu, responsible for capturing user search queries.
/// </summary>
public partial class CommandInput : RzComponent<CommandInput.Slots>
{
    /// <summary>
    /// Defines the default styling for the CommandInput component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex h-9 items-center gap-2 border-b px-3",
        slots: new()
        {
            [s => s.Icon] = "size-4 shrink-0 opacity-50",
            [s => s.Input] = "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
        }
    );

    /// <summary>
    /// Gets the parent <see cref="RzCommand"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzCommand? ParentCommand { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentCommand == null)
            throw new InvalidOperationException($"{nameof(CommandInput)} must be used within an {nameof(RzCommand)}.");
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.CommandInput;

    /// <summary>
    /// Defines the slots available for styling in the CommandInput component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the input wrapper.
        /// </summary>
        [Slot("command-input-wrapper")]
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the search icon.
        /// </summary>
        [Slot("icon")]
        public string? Icon { get; set; }
        /// <summary>
        /// The slot for the native input element.
        /// </summary>
        [Slot("input")]
        public string? Input { get; set; }
    }
}