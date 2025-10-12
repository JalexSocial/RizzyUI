
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using RizzyUI.TailwindVariants;

namespace RizzyUI;

/// <summary>
/// An interactive rail component used within a <see cref="RzSidebarProvider"/> to toggle the sidebar's visibility.
/// It renders as a button and is typically positioned at the edge of the sidebar.
/// </summary>
public partial class SidebarRail : RzComponent<SidebarRail.Slots>
{
    /// <summary>
    /// Defines the default styling for the SidebarRail component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]/sidebar-wrapper:-right-4 group-data-[side=right]/sidebar-wrapper:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex group-data-[side=left]/sidebar-wrapper:cursor-w-resize group-data-[side=right]/sidebar-wrapper:cursor-e-resize [[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize hover:group-data-[collapsible=offcanvas]/sidebar-wrapper:bg-sidebar group-data-[collapsible=offcanvas]/sidebar-wrapper:translate-x-0 group-data-[collapsible=offcanvas]/sidebar-wrapper:after:left-full [[data-side=left][data-collapsible=offcanvas]_&]:-right-2 [[data-side=right][data-collapsible=offcanvas]_&]:-left-2"
    );

    /// <summary>
    /// Gets the parent <see cref="RzSidebarProvider"/> to access shared state and functions.
    /// </summary>
    [CascadingParameter]
    protected RzSidebarProvider? ParentProvider { get; set; }

    /// <summary>
    /// Gets or sets the ARIA label for the rail, providing an accessible name for the toggle action.
    /// If not set, it defaults to a localized "Toggle Sidebar".
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
    /// Defines the slots available for styling in the SidebarRail component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}