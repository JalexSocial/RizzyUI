
using Microsoft.AspNetCore.Components;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A styled textarea for use within an `RzInputGroup`, inheriting from `RzInputTextArea`.
/// </summary>
public partial class InputGroupTextarea : RzComponent<InputGroupTextarea.Slots>
{
    /// <inheritdoc />
    protected internal override bool AcceptsXModel => true;

    /// <summary>
    /// Defines the default styling for the InputGroupTextarea component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex-1 w-full resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent"
    );

    /// <summary>
    /// Gets or sets the expression that identifies the bound value. This is a required parameter.
    /// </summary>
    [Parameter, EditorRequired]
    public Expression<Func<string>> For { get; set; } = default!;

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.InputGroupTextarea;

    /// <summary>
    /// Defines the slots available for styling in the InputGroupTextarea component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("input-group-textarea")]
        public string? Base { get; set; }
    }

    /// <summary>
    /// The attributes for the inner control, with the caller's <c>id</c> (decision D-26, Summit SF-033):
    /// the control registers it as the field's id, so a hand-written <c>&lt;label for&gt;</c> and a
    /// <c>FieldLabel</c> both point at it.
    /// </summary>
    private Dictionary<string, object> ControlAttributes
    {
        get
        {
            var attributes = AdditionalAttributes is null ? new Dictionary<string, object>() : new Dictionary<string, object>(AdditionalAttributes);
            if (HasExplicitId)
                attributes["Id"] = Id;
            return attributes;
        }
    }
}
