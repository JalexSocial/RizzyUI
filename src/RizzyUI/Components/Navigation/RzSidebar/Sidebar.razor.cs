
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using RizzyUI.TailwindVariants;

namespace RizzyUI;

/// <summary>
/// The main container for the sidebar, which renders as an <c><aside></c> element.
/// It consumes state from a parent <see cref="RzSidebarProvider"/> to manage its appearance and behavior.
/// </summary>
public partial class Sidebar : RzComponent<Sidebar.Slots>
{
    /// <summary>
    /// Defines the default styling for the Sidebar component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "group peer text-sidebar-foreground hidden md:block",
        slots: new()
        {
            [s => s.Gap] = "relative w-[var(--sidebar-width)] bg-transparent transition-[width] duration-200 ease-linear group-data-[collapsible=offcanvas]:w-0",
            [s => s.DesktopContainer] = "fixed inset-y-0 z-10 hidden h-svh w-[var(--sidebar-width)] transition-[left,right,width] duration-200 ease-linear md:flex",
            [s => s.DesktopInner] = "bg-sidebar flex h-full w-full flex-col"
        },
        variants: new()
        {
            [s => ((Sidebar)s).Variant] = new Variant<SidebarVariant, Slots>
            {
                [SidebarVariant.Floating] = new()
                {
                    [s => s.Gap] = "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem)]",
                    [s => s.DesktopContainer] = "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem+2px)]",
                    [s => s.DesktopInner] = "border-sidebar-border rounded-lg border shadow-sm"
                },
                [SidebarVariant.Inset] = new()
                {
                    [s => s.Gap] = "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem)]",
                    [s => s.DesktopContainer] = "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem+2px)]"
                },
                [SidebarVariant.Sidebar] = new()
                {
                    [s => s.Gap] = "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]",
                    [s => s.DesktopContainer] = "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]"
                }
            },
            [s => ((Sidebar)s).Side] = new Variant<SidebarSide, Slots>
            {
                [SidebarSide.Left] = new()
                {
                    [s => s.DesktopContainer] = "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]",
                    [s => s.DesktopInner] = "group-data-[variant=sidebar]:border-r"
                },
                [SidebarSide.Right] = new()
                {
                    [s => s.Gap] = "order-last",
                    [s => s.DesktopContainer] = "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
                    [s => s.DesktopInner] = "group-data-[variant=sidebar]:border-l"
                }
            }
        }
    );

    /// <summary>
    /// Gets the parent <see cref="RzSidebarProvider"/> which manages the state for this sidebar.
    /// </summary>
    [CascadingParameter]
    protected RzSidebarProvider? ParentProvider { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered inside the sidebar's navigation area. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets the side of the screen where the sidebar will appear.
    /// Defaults to <see cref="SidebarSide.Left"/>.
    /// </summary>
    [Parameter]
    public SidebarSide Side { get; set; } = SidebarSide.Left;

    /// <summary>
    /// Gets or sets the variant of the sidebar, which controls its overall layout behavior.
    /// Defaults to <see cref="SidebarVariant.Sidebar"/>.
    /// </summary>
    [Parameter]
    public SidebarVariant Variant { get; set; } = SidebarVariant.Sidebar;

    /// <summary>
    /// Gets or sets the ARIA label for the sidebar navigation, providing context for screen readers.
    /// If not set, it defaults to a localized "Sidebar navigation".
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
    /// Defines the slots available for styling in the Sidebar component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
        public string? Gap { get; set; }
        public string? DesktopContainer { get; set; }
        public string? DesktopInner { get; set; }
    }
}