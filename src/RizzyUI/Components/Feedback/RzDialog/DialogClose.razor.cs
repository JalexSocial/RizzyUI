
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// An interactive element that closes its parent <see cref="RzDialog"/>.
/// It can be rendered as a button or merge its behavior into a child element.
/// </summary>
public partial class DialogClose : RzAsChildComponent<DialogClose.Slots>
{
    /// <summary>
    /// Defines the default styling for the DialogClose component.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline-flex"
    );

    /// <summary>
    /// Gets the parent <see cref="RzDialog"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzDialog? ParentDialog { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered as the trigger. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentDialog == null)
        {
            throw new InvalidOperationException($"{nameof(DialogClose)} must be used within an {nameof(RzDialog)}.");
        }
        Element = "button";
    }

    /// <inheritdoc/>
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc/>
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(AdditionalAttributes?.ToDictionary(kvp => kvp.Key, kvp => (object?)kvp.Value) ?? new Dictionary<string, object?>(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = Id,
            ["class"] = SlotClasses.GetBase(),
            ["x-on:click"] = "closeModal",
            ["data-slot"] = "dialog-close"
        };
        return attributes;
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.DialogClose;

    /// <summary>
    /// Defines the slots available for styling in the DialogClose component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}