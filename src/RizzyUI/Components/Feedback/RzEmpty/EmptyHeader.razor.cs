
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A container for the header section of an <see cref="RzEmpty"/> component, typically holding the media, title, and description.
/// </summary>
public partial class EmptyHeader : RzComponent<EmptyHeader.Slots>
{
    /// <summary>
    /// Defines the default styling for the EmptyHeader component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex max-w-sm flex-col items-center gap-2 text-center"
    );

    /// <summary>
    /// Gets or sets the content to be rendered inside the header.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.EmptyHeader;

    /// <summary>
    /// Defines the slots available for styling in the EmptyHeader component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}