
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// The container for the actual items (like SidebarMenu) within a SidebarGroup.
/// </summary>
public partial class SidebarGroupContent : RzComponent<SidebarGroupContent.Slots>
{
    /// <summary>
    /// Defines the default styling and variations for the SidebarGroupContent component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "w-full text-sm"
    );

    /// <summary>
    /// The content to display inside the group.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "div";
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarGroupContent;

    /// <summary>
    /// Defines the slots available for styling the SidebarGroupContent component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets the base CSS classes applied to the component's root element.
        /// </summary>
        [Slot("sidebar-group-content")]
        public string? Base { get; set; }
    }
}