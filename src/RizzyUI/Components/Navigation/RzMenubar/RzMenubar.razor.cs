using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents the root container for a menubar and provides Alpine.js state for menu coordination.
/// </summary>
public partial class RzMenubar : RzComponent<RzMenubar.Slots>
{
    /// <summary>
    /// Defines the default styling for <see cref="RzMenubar"/>.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex h-9 items-center space-x-1 rounded-md border bg-background p-1"
    );

    /// <summary>
    /// Gets or sets the menubar content.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzMenubar;

    /// <summary>
    /// Defines slots for <see cref="RzMenubar"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the menubar root.
        /// </summary>
        [Slot("menubar")]
        public string? Base { get; set; }
    }
}
