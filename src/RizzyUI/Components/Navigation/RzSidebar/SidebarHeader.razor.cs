
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A container for content that should remain sticky at the top of the sidebar.
/// </summary>
public partial class SidebarHeader : RzComponent<SidebarHeader.Slots>
{
    /// <summary>
    /// Defines the default styling for the SidebarHeader component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex shrink-0 flex-col gap-2 p-2"
    );

    /// <summary>
    /// Gets or sets the content to be rendered inside the header.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "header";
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarHeader;

    /// <summary>
    /// Defines the slots available for styling in the SidebarHeader component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}