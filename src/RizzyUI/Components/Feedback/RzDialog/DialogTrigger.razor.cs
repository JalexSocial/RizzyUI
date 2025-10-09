
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// The interactive element that triggers the opening of a <see cref="RzDialog"/>.
/// It can be rendered as a button or merge its behavior into a child element.
/// </summary>
public partial class DialogTrigger : RzAsChildComponent<DialogTrigger.Slots>
{
    /// <summary>
    /// Defines the default styling for the DialogTrigger component.
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
            throw new InvalidOperationException($"{nameof(DialogTrigger)} must be used within an {nameof(RzDialog)}.");
        }
        Element = "button";
    }

    /// <inheritdoc/>
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc/>
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(AdditionalAttributes ?? new(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = Id,
            ["class"] = _slots.GetBase(),
            ["onclick"] = $"window.dispatchEvent(new CustomEvent('{ParentDialog?.EventTriggerName}'))",
            ["data-slot"] = "dialog-trigger"
        };
        return attributes;
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.DialogTrigger;

    /// <summary>
    /// Defines the slots available for styling in the DialogTrigger component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}