
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A component for displaying keyboard shortcuts within a <see cref="CommandItem"/>.
/// </summary>
public partial class CommandShortcut : RzComponent<CommandShortcut.Slots>
{
    /// <summary>
    /// Defines the default styling for the CommandShortcut component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "ml-auto text-xs tracking-widest text-muted-foreground"
    );

    /// <summary>
    /// Gets or sets the content of the shortcut, typically text representing key combinations.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.CommandShortcut;

    /// <summary>
    /// Defines the slots available for styling in the CommandShortcut component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("command-shortcut")]
        public string? Base { get; set; }
    }
}