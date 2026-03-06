using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines the copied-state content shown immediately after a successful clipboard operation.
/// </summary>
public partial class ClipboardFeedback : RzComponent<ClipboardFeedback.Slots>
{
    /// <summary>
    /// Defines the default styling for <see cref="ClipboardFeedback"/>.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "absolute inset-0 inline-flex items-center justify-center text-success transition-all duration-200"
    );

    /// <summary>
    /// Gets or sets the feedback content.
    /// </summary>
    [Parameter, EditorRequired] public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.ClipboardFeedback;

    /// <summary>
    /// Defines the slots available for styling in the <see cref="ClipboardFeedback"/> component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets classes for the root element.
        /// </summary>
        [Slot("clipboard-feedback")]
        public string? Base { get; set; }
    }
}
