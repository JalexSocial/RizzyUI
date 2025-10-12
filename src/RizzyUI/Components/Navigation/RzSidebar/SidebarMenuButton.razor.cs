
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using RizzyUI.TailwindVariants;

namespace RizzyUI;

/// <summary>
/// The primary interactive element within a <see cref="SidebarMenuItem"/>. It can be rendered as a button
/// or, using the `AsChild` pattern, as another element like an anchor tag.
/// </summary>
public partial class SidebarMenuButton : RzAsChildComponent<SidebarMenuButton.Slots>
{
    /// <summary>
    /// Defines the default styling for the SidebarMenuButton component.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&[aria-current=page]]:bg-sidebar-accent [&[aria-current=page]]:font-medium [&[aria-current=page]]:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 group-data-[state=collapsed]/sidebar:w-8 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:[&>span:last-child]:hidden",
        variants: new()
        {
            [b => ((SidebarMenuButton)b).Variant] = new Variant<SidebarMenuButtonVariant, Slots>
            {
                [SidebarMenuButtonVariant.Default] = "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                [SidebarMenuButtonVariant.Outline] = "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
            },
            [b => ((SidebarMenuButton)b).Size] = new Variant<Size, Slots>
            {
                [Size.Small] = "h-7 text-xs",
                [Size.Medium] = "h-8 text-sm",
                [Size.Large] = "h-12 text-sm group-data-[collapsible=icon]:p-0"
            }
        }
    );

    /// <summary>
    /// Gets or sets the content of the button, typically an icon and a text label. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets a value indicating whether this menu item is the currently active page.
    /// If true, it applies active styling and `aria-current="page"`. Defaults to false.
    /// </summary>
    [Parameter]
    public bool IsActive { get; set; }

    /// <summary>
    /// Gets or sets the visual variant of the button.
    /// Defaults to <see cref="SidebarMenuButtonVariant.Default"/>.
    /// </summary>
    [Parameter]
    public SidebarMenuButtonVariant Variant { get; set; } = SidebarMenuButtonVariant.Default;

    /// <summary>
    /// Gets or sets the size of the button.
    /// Defaults to <see cref="Size.Medium"/>.
    /// </summary>
    [Parameter]
    public Size Size { get; set; } = Size.Medium;

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
        var attributes = new Dictionary<string, object?>(AdditionalAttributes ?? new(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = Id,
            ["class"] = SlotClasses.GetBase(),
            ["aria-current"] = IsActive ? "page" : null,
            ["data-slot"] = "sidebar-menu-button"
        };
        return attributes;
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarMenuButton;

    /// <summary>
    /// Defines the slots available for styling in the SidebarMenuButton component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}