using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines the default state content shown before a successful clipboard copy.
/// </summary>
public partial class ClipboardTrigger : RzComponent<ClipboardTrigger.Slots>
{
    /// <summary>
    /// Defines the default styling for <see cref="ClipboardTrigger"/>.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline-flex items-center justify-center transition-all duration-200"
    );

    /// <summary>
    /// Gets or sets the trigger content.
    /// </summary>
    [Parameter, EditorRequired] public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.ClipboardTrigger;

    /// <summary>
    /// Defines the slots available for styling in the <see cref="ClipboardTrigger"/> component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets classes for the root element.
        /// </summary>
        [Slot("clipboard-trigger")]
        public string? Base { get; set; }
    }
}
