
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A small badge component, typically used within a <see cref="SidebarMenuItem"/> to display a count or status.
/// </summary>
public partial class SidebarMenuBadge : RzComponent<SidebarMenuBadge.Slots>
{
    /// <summary>
    /// Defines the default styling for the SidebarMenuBadge component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "ml-auto text-xs"
    );

    /// <summary>
    /// Gets or sets the content to be displayed inside the badge.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "span";
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarMenuBadge;

    /// <summary>
    /// Defines the slots available for styling in the SidebarMenuBadge component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}