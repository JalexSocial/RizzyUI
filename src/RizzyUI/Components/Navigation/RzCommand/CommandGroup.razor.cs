
using Microsoft.AspNetCore.Components;
using Rizzy.Utility;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A component for grouping <see cref="CommandItem"/>s under a common heading within a command menu.
/// </summary>
public partial class CommandGroup : RzComponent<CommandGroup.Slots>
{
    /// <summary>
    /// Defines the default styling for the CommandGroup component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "overflow-hidden p-1 text-foreground",
        slots: new()
        {
            [s => s.Heading] = "px-2 py-1.5 text-xs font-medium text-muted-foreground"
        }
    );

    /// <summary>
    /// Gets or sets the heading text for the group.
    /// </summary>
    [Parameter]
    public string? Heading { get; set; }

    /// <summary>
    /// Gets or sets the child content, which should be a list of <see cref="CommandItem"/>s.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets the unique ID for the heading element.
    /// </summary>
    protected string HeadingId { get; } = IdGenerator.UniqueId("rz-cmd-group-heading-");

    /// <summary>
    /// Gets the unique ID for the heading's template element.
    /// </summary>
    protected string HeadingTemplateId => $"{Id}-heading-template";

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.CommandGroup;

    /// <summary>
    /// Defines the slots available for styling in the CommandGroup component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("command-group")]
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the heading element.
        /// </summary>
        [Slot("command-group-heading")]
        public string? Heading { get; set; }
    }
}