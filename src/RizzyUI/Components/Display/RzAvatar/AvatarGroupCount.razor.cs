using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Displays an overflow count item inside an <see cref="AvatarGroup"/>.
/// </summary>
public partial class AvatarGroupCount : RzComponent<AvatarGroupCount.Slots>
{
    /// <summary>
    /// Defines the default styling for the AvatarGroupCount component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "bg-muted text-muted-foreground ring-background relative flex size-10 shrink-0 items-center justify-center rounded-full text-sm ring-2 [&>svg]:size-4"
    );

    /// <summary>
    /// Gets or sets the content displayed in the count element.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "div";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.AvatarGroupCount;

    /// <summary>
    /// Defines the slots available for styling in the AvatarGroupCount component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the group count element.
        /// </summary>
        [Slot("avatar-group-count")]
        public string? Base { get; set; }
    }
}
