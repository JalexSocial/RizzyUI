
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// The main scrollable content area of the sidebar, designed to hold <see cref="SidebarGroup"/> components.
/// </summary>
public partial class SidebarContent : RzComponent<SidebarContent.Slots>
{
    /// <summary>
    /// Defines the default styling for the SidebarContent component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto group-data-[collapsible=icon]:overflow-hidden"
    );

    /// <summary>
    /// Gets or sets the content to be rendered inside the scrollable area.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarContent;

    /// <summary>
    /// Defines the slots available for styling in the SidebarContent component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}