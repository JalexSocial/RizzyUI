
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// The primary interactive button inside a SidebarMenuItem.
/// </summary>
public partial class SidebarMenuButton : RzAsChildComponent<SidebarMenuButton.Slots>
{
    /// <summary>
    /// Defines the default styling and variations for the SidebarMenuButton component.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate[&>svg]:size-4 [&>svg]:shrink-0",
        variants: new()
        {[b => ((SidebarMenuButton)b).Variant] = new Variant<SidebarMenuButtonVariant, Slots>
            {
                [SidebarMenuButtonVariant.Default] = "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                [SidebarMenuButtonVariant.Outline] = "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
            },
            [b => ((SidebarMenuButton)b).Size] = new Variant<Size, Slots>
            {
                [Size.Small] = "h-7 text-xs",
                [Size.Medium] = "h-8 text-sm",
                [Size.Large] = "h-12 text-sm group-data-[collapsible=icon]:!p-0"
            }
        }
    );

    /// <summary>
    /// The content of the button.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Marks the button as the currently active navigation item.
    /// </summary>
    [Parameter]
    public bool IsActive { get; set; }

    /// <summary>
    /// The visual variant of the button. Defaults to Default.
    /// </summary>
    [Parameter]
    public SidebarMenuButtonVariant Variant { get; set; } = SidebarMenuButtonVariant.Default;

    /// <summary>
    /// The size of the button. Defaults to Medium.
    /// </summary>
    [Parameter]
    public Size Size { get; set; } = Size.Medium;

    /// <summary>
    /// An optional tooltip string to display when collapsed. Note: Automatic Tooltip wrapping is currently partially implemented for non-AsChild usage.
    /// </summary>
    [Parameter]
    public string? Tooltip { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "button";
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
            ["data-sidebar"] = "menu-button",
            ["data-size"] = Size == Size.Small ? "sm" : Size == Size.Large ? "lg" : "default",
            ["data-active"] = IsActive ? "true" : "false",
            ["data-slot"] = "sidebar-menu-button"
        };
        return attributes;
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarMenuButton;

    /// <summary>
    /// Defines the slots available for styling the SidebarMenuButton component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets the base CSS classes applied to the component's root element.
        /// </summary>
        [Slot("sidebar-menu-button")]
        public string? Base { get; set; }
    }
}