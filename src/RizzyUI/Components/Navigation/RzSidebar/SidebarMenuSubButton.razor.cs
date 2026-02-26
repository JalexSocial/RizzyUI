
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A button or link designed for nested submenus within the sidebar.
/// </summary>
public partial class SidebarMenuSubButton : RzAsChildComponent<SidebarMenuSubButton.Slots>
{
    /// <summary>
    /// Defines the default styling and variations for the SidebarMenuSubButton component.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50[&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden",
        variants: new()
        {[c => ((SidebarMenuSubButton)c).Size] = new Variant<Size, Slots>
            {
                [Size.Small] = new() { [s => s.Base] = "text-xs" },
                [Size.Medium] = new() { [s => s.Base] = "text-sm" }
            }
        }
    );

    /// <summary>
    /// The content of the submenu button.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Marks the button as the currently active submenu item.
    /// </summary>
    [Parameter]
    public bool IsActive { get; set; }

    /// <summary>
    /// The size of the button text. Only Small and Medium are supported. Defaults to Medium.
    /// </summary>
    [Parameter]
    public Size Size { get; set; } = Size.Medium;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "a";
    }

    /// <inheritdoc/>
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc/>
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(AdditionalAttributes?.ToDictionary(kvp => kvp.Key, kvp => (object?)kvp.Value) ?? new Dictionary<string, object?>(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = Id,
            ["class"] = SlotClasses.GetBase(),
            ["data-sidebar"] = "menu-sub-button",["data-size"] = Size == Size.Small ? "sm" : "md",
            ["data-active"] = IsActive ? "true" : "false",
            ["data-slot"] = "sidebar-menu-sub-button"
        };
        return attributes;
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarMenuSubButton;

    /// <summary>
    /// Defines the slots available for styling the SidebarMenuSubButton component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets the base CSS classes applied to the component's root element.
        /// </summary>
        [Slot("sidebar-menu-sub-button")]
        public string? Base { get; set; }
    }
}