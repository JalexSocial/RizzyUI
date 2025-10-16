
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A visual separator line used to divide sections within the sidebar.
/// </summary>
public partial class SidebarSeparator : RzComponent<SidebarSeparator.Slots>
{
    /// <summary>
    /// Defines the default styling for the SidebarSeparator component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "border-sidebar-border mx-2 w-auto border-t"
    );

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "hr";
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarSeparator;

    /// <summary>
    /// Defines the slots available for styling in the SidebarSeparator component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}