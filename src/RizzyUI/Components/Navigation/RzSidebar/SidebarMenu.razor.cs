
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A list container for <see cref="SidebarMenuItem"/> components.
/// </summary>
public partial class SidebarMenu : RzComponent<SidebarMenu.Slots>
{
    /// <summary>
    /// Defines the default styling for the SidebarMenu component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex w-full min-w-0 flex-col gap-1"
    );

    /// <summary>
    /// Gets or sets the content of the menu, which should be a list of <see cref="SidebarMenuItem"/>.
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
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarMenu;

    /// <summary>
    /// Defines the slots available for styling in the SidebarMenu component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}