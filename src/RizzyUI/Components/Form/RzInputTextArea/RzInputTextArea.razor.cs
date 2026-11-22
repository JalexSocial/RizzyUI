using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Multi-line text input component with built-in form integration.
/// </summary>
public partial class RzInputTextArea : InputBase<string, RzInputTextArea.Slots>
{
    /// <summary>
    /// Gets the default descriptor used for textarea styling.
    /// </summary>
    // SF-052: the classes are spelled out. Extending FormInputStyles with a base of its own replaced the
    // shared classes, so the textarea had no border, background, padding or focus ring.
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex field-sizing-content min-h-16 w-full min-w-0 resize-none rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
    );

    private RzInputTextAreaBase? _elem;

    /// <summary>
    /// Gets or sets placeholder text for the textarea element.
    /// </summary>
    [Parameter] public string? Placeholder { get; set; }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzInputTextArea;

    /// <summary>
    /// Slot definitions for <see cref="RzInputTextArea"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets classes for the textarea element.
        /// </summary>
        [Slot("textarea")]
        public string? Base { get; set; }
    }
}