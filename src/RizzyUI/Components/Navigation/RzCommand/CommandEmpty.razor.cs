
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A component that displays content when the command menu has no matching results for the current search query.
/// </summary>
public partial class CommandEmpty : RzComponent<CommandEmpty.Slots>
{
    /// <summary>
    /// Defines the default styling for the CommandEmpty component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "py-6 text-center text-sm"
    );

    /// <summary>
    /// Gets or sets the content to be displayed when no results are found.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.CommandEmpty;

    /// <summary>
    /// Defines the slots available for styling in the CommandEmpty component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("command-empty")]
        public string? Base { get; set; }
    }
}