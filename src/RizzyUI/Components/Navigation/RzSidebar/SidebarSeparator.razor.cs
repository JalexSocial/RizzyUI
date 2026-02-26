
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A visual divider within the sidebar.
/// </summary>
public partial class SidebarSeparator : RzComponent<SidebarSeparator.Slots>
{
    /// <summary>
    /// Defines the default styling and variations for the SidebarSeparator component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "bg-sidebar-border mx-2 w-auto"
    );

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarSeparator;

    /// <summary>
    /// Defines the slots available for styling the SidebarSeparator component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets the base CSS classes applied to the component's root element.
        /// </summary>
        [Slot("sidebar-separator")]
        public string? Base { get; set; }
    }
}