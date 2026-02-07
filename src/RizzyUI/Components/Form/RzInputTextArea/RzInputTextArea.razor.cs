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
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        extends: FormInputStyles.DefaultDescriptor,
        @base: "flex field-sizing-content min-h-16 resize-none"
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