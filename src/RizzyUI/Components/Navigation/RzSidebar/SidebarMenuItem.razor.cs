
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents a single item in a <see cref="SidebarMenu"/>, acting as a wrapper for a
/// <see cref="SidebarMenuButton"/> and other optional elements like <see cref="SidebarMenuAction"/>.
/// </summary>
public partial class SidebarMenuItem : RzComponent<SidebarMenuItem.Slots>
{
    /// <summary>
    /// Defines the default styling for the SidebarMenuItem component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "relative group/menu-item"
    );

    /// <summary>
    /// Gets or sets the content of the menu item.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "li";
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarMenuItem;

    /// <summary>
    /// Defines the slots available for styling in the SidebarMenuItem component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}