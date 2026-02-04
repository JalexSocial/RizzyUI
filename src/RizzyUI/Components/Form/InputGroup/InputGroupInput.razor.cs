
using Microsoft.AspNetCore.Components;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A styled text input for use within an `RzInputGroup`, inheriting from `RzInputText`.
/// </summary>
public partial class InputGroupInput : RzComponent<InputGroupInput.Slots>
{
    /// <summary>
    /// Defines the default styling for the InputGroupInput component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
    );

    /// <summary>
    /// Gets or sets the expression that identifies the bound value. This is a required parameter.
    /// </summary>
    [Parameter, EditorRequired]
    public Expression<Func<string>> For { get; set; } = default!;

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.InputGroupInput;

    /// <summary>
    /// Defines the slots available for styling in the InputGroupInput component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("input-group-input")]
        public string? Base { get; set; }
    }
}