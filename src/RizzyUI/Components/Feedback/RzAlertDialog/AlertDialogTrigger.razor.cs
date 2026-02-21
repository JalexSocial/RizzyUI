using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Interactive element that opens a parent <see cref="RzAlertDialog"/>.
/// </summary>
public partial class AlertDialogTrigger : RzAsChildComponent<AlertDialogTrigger.Slots>
{
    /// <summary>
    /// Defines the default styling for the AlertDialogTrigger component.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new(@base: "inline-flex");

    /// <summary>
    /// Gets the parent <see cref="RzAlertDialog"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzAlertDialog? ParentAlertDialog { get; set; }

    /// <summary>
    /// Gets or sets the trigger content.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentAlertDialog == null)
            throw new InvalidOperationException($"{nameof(AlertDialogTrigger)} must be used within an {nameof(RzAlertDialog)}.");
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
            ["onclick"] = $"window.dispatchEvent(new CustomEvent('{ParentAlertDialog?.EventTriggerName}'))",
            ["data-slot"] = "alert-dialog-trigger"
        };
        return attributes;
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.AlertDialogTrigger;

    /// <summary>
    /// Defines styling slots for <see cref="AlertDialogTrigger"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Base slot for trigger content.
        /// </summary>
        /// <summary>
        /// Base slot for the trigger element.
        /// </summary>
        [Slot("alert-dialog-trigger")]
        public string? Base { get; set; }
    }
}
