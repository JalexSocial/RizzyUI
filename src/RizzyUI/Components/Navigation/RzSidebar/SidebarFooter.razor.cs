
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A footer container within the sidebar, typically containing user profile information or global settings links.
/// </summary>
public partial class SidebarFooter : RzComponent<SidebarFooter.Slots>
{
    /// <summary>
    /// Defines the default styling and variations for the SidebarFooter component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex flex-col gap-2 p-2 shrink-0"
    );

    /// <summary>
    /// The content of the footer.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override string DefaultElement => "div";

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarFooter;

    /// <summary>
    /// Defines the slots available for styling the SidebarFooter component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets the base CSS classes applied to the component's root element.
        /// </summary>
        [Slot("sidebar-footer")]
        public string? Base { get; set; }
    }
}