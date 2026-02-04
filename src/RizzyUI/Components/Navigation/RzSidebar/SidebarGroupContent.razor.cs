
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A container for the content within a <see cref="SidebarGroup"/>, typically a <see cref="SidebarMenu"/>.
/// </summary>
public partial class SidebarGroupContent : RzComponent<SidebarGroupContent.Slots>
{
    /// <summary>
    /// Defines the default styling for the SidebarGroupContent component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "w-full text-sm"
    );

    /// <summary>
    /// Gets or sets the content to be rendered, usually a <see cref="SidebarMenu"/>.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarGroupContent;

    /// <summary>
    /// Defines the slots available for styling in the SidebarGroupContent component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}