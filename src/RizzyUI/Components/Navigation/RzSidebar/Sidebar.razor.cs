
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A collapsible sidebar component that renders an off-canvas sheet on mobile and a structured layout on desktop.
/// </summary>
public partial class Sidebar : RzComponent<Sidebar.Slots>
{
    /// <summary>
    /// Defines the default styling and variations for the Sidebar component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "group peer text-sidebar-foreground hidden md:block",
        slots: new()
        {
            [s => s.Gap] = "relative w-[var(--sidebar-width)] bg-transparent transition-[width] duration-200 ease-linear group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180",
            [s => s.DesktopContainer] = "fixed inset-y-0 z-10 hidden h-svh w-[var(--sidebar-width)] transition-[left,right,width] duration-200 ease-linear md:flex",
            [s => s.DesktopInner] = "bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
        },
        variants: new()
        {
            [s => ((Sidebar)s).Variant] = new Variant<SidebarVariant, Slots>
            {
                [SidebarVariant.Floating] = new()
                {
                    [s => s.Gap] = "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem)]",
                    [s => s.DesktopContainer] = "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem+2px)]"
                },
                [SidebarVariant.Inset] = new()
                {
                    [s => s.Gap] = "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem)]",
                    [s => s.DesktopContainer] = "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem+2px)]"
                },
                [SidebarVariant.Sidebar] = new()
                {
                    [s => s.Gap] = "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]",[s => s.DesktopContainer] = "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]"
                }
            },
            [s => ((Sidebar)s).Side] = new Variant<SidebarSide, Slots>
            {
                [SidebarSide.Left] = new()
                {
                    [s => s.DesktopContainer] = "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]",
                    [s => s.DesktopInner] = "group-data-[side=left]:border-r"
                },
                [SidebarSide.Right] = new()
                {
                    [s => s.Gap] = "order-last",[s => s.DesktopContainer] = "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
                    [s => s.DesktopInner] = "group-data-[side=right]:border-l"
                }
            }
        }
    );

    /// <summary>
    /// Gets the parent provider context.
    /// </summary>
    [CascadingParameter]
    protected RzSidebarProvider? ParentProvider { get; set; }

    /// <summary>
    /// The content of the sidebar.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// The side of the screen where the sidebar appears. Defaults to Left.
    /// </summary>
    [Parameter]
    public SidebarSide Side { get; set; } = SidebarSide.Left;

    /// <summary>
    /// The visual variant of the sidebar. Defaults to Sidebar.
    /// </summary>
    [Parameter]
    public SidebarVariant Variant { get; set; } = SidebarVariant.Sidebar;

    /// <summary>
    /// Accessible label for the sidebar.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentProvider == null)
        {
            throw new InvalidOperationException($"{nameof(Sidebar)} must be used within an {nameof(RzSidebarProvider)}.");
        }
        Element = "div";
        AriaLabel ??= Localizer["RzSidebar.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzSidebar.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.Sidebar;

    /// <summary>
    /// Defines the slots available for styling the Sidebar component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets the base CSS classes applied to the component's root element.
        /// </summary>
        [Slot("sidebar")]
        public string? Base { get; set; }

        /// <summary>
        /// Gets or sets the classes for the spacing gap proxy element on desktop.
        /// </summary>
        [Slot("sidebar-gap")]
        public string? Gap { get; set; }

        /// <summary>
        /// Gets or sets the classes for the desktop bounding container.
        /// </summary>
        [Slot("sidebar-container")]
        public string? DesktopContainer { get; set; }

        /// <summary>
        /// Gets or sets the classes for the inner panel of the desktop sidebar.
        /// </summary>
        [Slot("sidebar-inner")]
        public string? DesktopInner { get; set; }
    }
}