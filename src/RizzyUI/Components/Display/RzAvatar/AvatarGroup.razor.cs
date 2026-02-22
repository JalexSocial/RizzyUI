using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Arranges multiple <see cref="RzAvatar"/> components into an overlapping group.
/// </summary>
public partial class AvatarGroup : RzComponent<AvatarGroup.Slots>
{
    /// <summary>
    /// Defines the default styling for the AvatarGroup component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "*:data-[slot=avatar]:ring-background group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2"
    );

    /// <summary>
    /// Gets or sets the content of the avatar group.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.AvatarGroup;

    /// <summary>
    /// Defines the slots available for styling in the AvatarGroup component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the avatar group container.
        /// </summary>
        [Slot("avatar-group")]
        public string? Base { get; set; }
    }
}
