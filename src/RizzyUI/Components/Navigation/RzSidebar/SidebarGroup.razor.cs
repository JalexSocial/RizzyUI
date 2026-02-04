
using Microsoft.AspNetCore.Components;
using Rizzy.Utility;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A structural component for grouping related items within a <see cref="SidebarContent"/>.
/// It provides an accessible grouping by associating its content with a <see cref="SidebarGroupLabel"/>.
/// </summary>
public partial class SidebarGroup : RzComponent<SidebarGroup.Slots>
{
    /// <summary>
    /// Defines the default styling for the SidebarGroup component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "relative flex w-full min-w-0 flex-col p-2"
    );

    /// <summary>
    /// Gets the unique ID for the label associated with this group, used for `aria-labelledby`.
    /// </summary>
    public string LabelId { get; } = IdGenerator.UniqueId("rzsb-grouplabel-");

    /// <summary>
    /// Gets or sets the content of the group, which should include a <see cref="SidebarGroupLabel"/>
    /// and a <see cref="SidebarGroupContent"/>.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarGroup;

    /// <summary>
    /// Defines the slots available for styling in the SidebarGroup component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}