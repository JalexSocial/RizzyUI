
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A wrapper for the main content area that correctly adjusts its margin
/// based on the sidebar's state and variant.
/// </summary>
public partial class SidebarInset : RzComponent<SidebarInset.Slots>
{
    /// <summary>
    /// Defines the default styling for the SidebarInset component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "bg-background w-full relative flex flex-1 flex-col transition-[margin-left] duration-200 ease-linear peer-data-[collapsible=icon][data-state=collapsed]:ml-[var(--sidebar-width-icon)] md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2"
    );

    /// <summary>
    /// Gets or sets the main content to be rendered within the inset container.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "main";
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarInset;

    /// <summary>
    /// Defines the slots available for styling in the SidebarInset component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}