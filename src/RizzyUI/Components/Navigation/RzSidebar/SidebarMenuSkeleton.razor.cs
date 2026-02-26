
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;
using System;

namespace RizzyUI;

/// <summary>
/// A loading skeleton placeholder for a sidebar menu item.
/// </summary>
public partial class SidebarMenuSkeleton : RzComponent<SidebarMenuSkeleton.Slots>
{
    private static readonly Random _random = new();
    private string _width = "100%";

    /// <summary>
    /// Defines the default styling and variations for the SidebarMenuSkeleton component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex h-8 items-center gap-2 rounded-md px-2",
        slots: new()
        {
            [s => s.Icon] = "size-4 rounded-md",
            [s => s.Text] = "h-4 flex-1 rounded-md"
        }
    );

    /// <summary>
    /// If true, renders a placeholder block for an icon.
    /// </summary>
    [Parameter]
    public bool ShowIcon { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "div";
        _width = $"{_random.Next(50, 90)}%";
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarMenuSkeleton;

    /// <summary>
    /// Defines the slots available for styling the SidebarMenuSkeleton component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets the base CSS classes applied to the component's root element.
        /// </summary>
        [Slot("sidebar-menu-skeleton")]
        public string? Base { get; set; }

        /// <summary>
        /// Gets or sets the classes for the icon placeholder.
        /// </summary>
        [Slot("sidebar-menu-skeleton-icon")]
        public string? Icon { get; set; }

        /// <summary>
        /// Gets or sets the classes for the text placeholder.
        /// </summary>
        [Slot("sidebar-menu-skeleton-text")]
        public string? Text { get; set; }
    }
}