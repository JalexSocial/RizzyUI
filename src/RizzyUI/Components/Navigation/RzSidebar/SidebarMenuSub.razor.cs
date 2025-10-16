
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A container for creating a nested, collapsible sub-menu within a <see cref="SidebarMenu"/>.
/// This component is intended to wrap a trigger and content for the sub-menu.
/// </summary>
public partial class SidebarMenuSub : RzComponent<SidebarMenuSub.Slots>
{
    /// <summary>
    /// Defines the default styling for the SidebarMenuSub component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "border-sidebar-border flex min-w-0 flex-col gap-1 border-l ml-3.5 pl-2.5 py-0.5 w-auto"
    );

    /// <summary>
    /// Gets or sets the content of the sub-menu, which should include a trigger and content sections.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "ul";
    }
    
    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarMenuSub;

    /// <summary>
    /// Defines the slots available for styling in the SidebarMenuSub component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}