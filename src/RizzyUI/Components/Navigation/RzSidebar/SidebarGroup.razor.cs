
using Microsoft.AspNetCore.Components;
using Rizzy.Utility;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A container for a logically grouped set of navigation items within the sidebar content area.
/// </summary>
public partial class SidebarGroup : RzComponent<SidebarGroup.Slots>
{
    /// <summary>
    /// Defines the default styling and variations for the SidebarGroup component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "relative flex w-full min-w-0 flex-col p-2"
    );

    /// <summary>
    /// Internal ID used to link the group to its label for accessibility.
    /// </summary>
    public string LabelId => $"{Id}-label";

    /// <summary>
    /// The content of the group, which typically includes a SidebarGroupLabel and SidebarGroupContent.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override string DefaultElement => "div";

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarGroup;

    /// <summary>
    /// Defines the slots available for styling the SidebarGroup component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets the base CSS classes applied to the component's root element.
        /// </summary>
        [Slot("sidebar-group")]
        public string? Base { get; set; }
    }
}