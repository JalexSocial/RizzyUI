
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A container for an icon or image within an <see cref="EmptyHeader"/>.
/// </summary>
public partial class EmptyMedia : RzComponent<EmptyMedia.Slots>
{
    /// <summary>
    /// Defines the default styling for the EmptyMedia component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        variants: new()
        {
            [c => ((EmptyMedia)c).Variant] = new Variant<EmptyMediaVariant, Slots>
            {
                [EmptyMediaVariant.Icon] = "bg-muted text-foreground flex size-10 text-2xl shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6",
                [EmptyMediaVariant.Default] = "bg-transparent"
            }
        }
    );

    /// <summary>
    /// Gets or sets the content to be rendered, typically an icon or image.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the visual variant of the media container.
    /// Defaults to <see cref="EmptyMediaVariant.Default"/>.
    /// </summary>
    [Parameter]
    public EmptyMediaVariant Variant { get; set; } = EmptyMediaVariant.Default;

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.EmptyMedia;

    /// <summary>
    /// Defines the slots available for styling in the EmptyMedia component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}