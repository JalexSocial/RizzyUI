using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Renders a small status badge anchored to the corner of an <see cref="RzAvatar"/>.
/// </summary>
public partial class AvatarBadge : RzComponent<AvatarBadge.Slots>
{
    /// <summary>
    /// Defines the default styling for the AvatarBadge component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full ring-2 select-none",
        variants: new()
        {
            [c => ((AvatarBadge)c).AvatarSize] = new Variant<Size, Slots>
            {
                [Size.ExtraSmall] = new() { [s => s.Base] = "size-2" },
                [Size.Small] = new() { [s => s.Base] = "size-2" },
                [Size.Medium] = new() { [s => s.Base] = "size-2.5 [&>svg]:size-2" },
                [Size.Large] = new() { [s => s.Base] = "size-3 [&>svg]:size-2" },
                [Size.ExtraLarge] = new() { [s => s.Base] = "size-3.5 [&>svg]:size-2.5" }
            }
        }
    );

    /// <summary>
    /// Gets or sets the content rendered inside the badge.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the size used for badge sizing variants.
    /// </summary>
    [Parameter]
    public Size? BadgeSize { get; set; }

    /// <summary>
    /// Gets or sets the parent <see cref="RzAvatar"/> component.
    /// </summary>
    [CascadingParameter]
    public RzAvatar? ParentAvatar { get; set; }

    private Size AvatarSize => BadgeSize ?? ParentAvatar?.Size ?? RizzyUI.Size.Medium;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "span";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.AvatarBadge;

    /// <summary>
    /// Defines the slots available for styling in the AvatarBadge component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the badge element.
        /// </summary>
        [Slot("avatar-badge")]
        public string? Base { get; set; }
    }
}
