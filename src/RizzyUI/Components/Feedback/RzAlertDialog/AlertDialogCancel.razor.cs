using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Cancel action element for dismissing an alert dialog.
/// </summary>
public partial class AlertDialogCancel : RzAsChildComponent<AlertDialogCancel.Slots>
{
    /// <summary>
    /// Defines the default styling for the AlertDialogCancel component.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground mt-2 sm:mt-0"
    );

    /// <summary>
    /// Gets or sets the cancel content.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
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
            ["data-slot"] = "alert-dialog-cancel"
        };
        return attributes;
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.AlertDialogCancel;

    /// <summary>
    /// Defines slots available for styling in <see cref="AlertDialogCancel"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Base slot for the cancel element.
        /// </summary>
        [Slot("alert-dialog-cancel")]
        public string? Base { get; set; }
    }
}
