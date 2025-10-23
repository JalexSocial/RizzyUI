
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A container for content that should remain sticky at the bottom of the sidebar.
/// </summary>
public partial class SidebarFooter : RzComponent<SidebarFooter.Slots>
{
    /// <summary>
    /// Defines the default styling for the SidebarFooter component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex shrink-0 flex-col gap-2 p-2"
    );

    /// <summary>
    /// Gets or sets the content to be rendered inside the footer.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "footer";
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarFooter;

    /// <summary>
    /// Defines the slots available for styling in the SidebarFooter component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}