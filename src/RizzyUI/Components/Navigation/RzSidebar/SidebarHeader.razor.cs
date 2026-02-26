
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A header container within the sidebar, typically containing a brand logo, search input, or context switcher.
/// </summary>
public partial class SidebarHeader : RzComponent<SidebarHeader.Slots>
{
    /// <summary>
    /// Defines the default styling and variations for the SidebarHeader component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex flex-col gap-2 p-2 shrink-0"
    );

    /// <summary>
    /// The content of the header.
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
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarHeader;

    /// <summary>
    /// Defines the slots available for styling the SidebarHeader component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets the base CSS classes applied to the component's root element.
        /// </summary>
        [Slot("sidebar-header")]
        public string? Base { get; set; }
    }
}