
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A thin, interactive rail displayed when the sidebar is collapsed, allowing it to be expanded by hovering or clicking.
/// </summary>
public partial class SidebarRail : RzComponent<SidebarRail.Slots>
{
    /// <summary>
    /// Defines the default styling and variations for the SidebarRail component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize [[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full [[data-side=left][data-collapsible=offcanvas]_&]:-right-2 [[data-side=right][data-collapsible=offcanvas]_&]:-left-2"
    );

    /// <summary>
    /// Gets the parent provider context.
    /// </summary>
    [CascadingParameter]
    protected RzSidebarProvider? ParentProvider { get; set; }

    /// <summary>
    /// Accessible label for the rail.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentProvider == null)
        {
            throw new InvalidOperationException($"{nameof(SidebarRail)} must be used within an {nameof(RzSidebarProvider)}.");
        }

        if (string.IsNullOrEmpty(Element))
            Element = "button";

        AriaLabel ??= Localizer["RzSidebarRail.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzSidebarRail.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarRail;

    /// <summary>
    /// Defines the slots available for styling the SidebarRail component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets the base CSS classes applied to the component's root element.
        /// </summary>
        [Slot("sidebar-rail")]
        public string? Base { get; set; }
    }
}