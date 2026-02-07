using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Single-line text input component.
/// </summary>
public partial class RzInputText : InputBase<string, RzInputText.Slots>
{
    /// <summary>
    /// Gets the default descriptor used for text input styling.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor =
        new(extends: FormInputStyles.DefaultDescriptor);

    private RzInputTextBase? _elem;

    /// <summary>
    /// Gets or sets the semantic input role used when rendering.
    /// </summary>
    [Parameter] public TextRole Role { get; set; } = TextRole.Text;

    /// <summary>
    /// Gets or sets placeholder text for the input element.
    /// </summary>
    [Parameter] public string? Placeholder { get; set; }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzInputText;

    /// <summary>
    /// Slot definitions for <see cref="RzInputText"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets classes for the input element.
        /// </summary>
        [Slot("input")]
        public string? Base { get; set; }
    }
}