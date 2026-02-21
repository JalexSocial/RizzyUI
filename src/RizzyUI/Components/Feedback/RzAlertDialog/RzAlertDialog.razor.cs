using Microsoft.AspNetCore.Components;
using Rizzy.Utility;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// The root component for an alert dialog interaction that requires an explicit decision.
/// </summary>
public partial class RzAlertDialog : RzComponent<RzAlertDialog.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzAlertDialog component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new();

    /// <summary>
    /// Gets the unique identifier for the <c>aria-labelledby</c> attribute.
    /// </summary>
    internal string AriaLabelId { get; } = IdGenerator.UniqueId("rzalrtttl");

    /// <summary>
    /// Gets the unique identifier for the <c>aria-describedby</c> attribute.
    /// </summary>
    internal string AriaDescriptionId { get; } = IdGenerator.UniqueId("rzalrtdesc");

    /// <summary>
    /// Gets the unique identifier for the alert dialog body container.
    /// </summary>
    public string BodyId { get; } = IdGenerator.UniqueId("rzalrtbody");

    /// <summary>
    /// Gets the unique identifier for the alert dialog footer container.
    /// </summary>
    public string FooterId { get; } = IdGenerator.UniqueId("rzalrtfoot");

    /// <summary>
    /// Gets or sets the content of the alert dialog.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets the name of the event that opens this alert dialog.
    /// </summary>
    [Parameter]
    public string EventTriggerName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the name of the event that closes this alert dialog.
    /// </summary>
    [Parameter]
    public string CloseEventName { get; set; } = Constants.Events.DialogClose;

    /// <summary>
    /// Gets or sets whether the alert dialog can close when Escape is pressed.
    /// Defaults to false.
    /// </summary>
    [Parameter]
    public bool CloseOnEscape { get; set; }

    /// <summary>
    /// Gets or sets whether the alert dialog can close on outside click.
    /// Defaults to false.
    /// </summary>
    [Parameter]
    public bool CloseOnClickOutside { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(EventTriggerName))
        {
            EventTriggerName = $"show-alert-dialog-{Id}";
        }
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzAlertDialog;

    /// <summary>
    /// Defines the slots available for styling in the RzAlertDialog component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component root.
        /// </summary>
        [Slot("alert-dialog")]
        public string? Base { get; set; }
    }
}
