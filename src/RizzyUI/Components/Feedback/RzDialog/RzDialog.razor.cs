
using Microsoft.AspNetCore.Components;
using Rizzy.Utility;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// The root component for a dialog system. It provides context for its children,
/// including trigger, content, and other parts. Interactivity is managed by an Alpine.js component.
/// </summary>
public partial class RzDialog : RzComponent<RzDialog.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzDialog component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new();

    /// <summary>
    /// Gets the unique identifier for the `aria-labelledby` attribute, linking the dialog to its title.
    /// </summary>
    internal string AriaLabelId { get; } = IdGenerator.UniqueId("rzdlgttl");

    /// <summary>
    /// Gets the unique identifier for the <c>aria-describedby</c> attribute, linking the dialog to its description.
    /// </summary>
    internal string AriaDescriptionId { get; } = IdGenerator.UniqueId("rzdlgdesc");

    /// <summary>
    /// Gets the unique identifier for the dialog body container, usable as an HTMX target ID.
    /// </summary>
    public string BodyId { get; } = IdGenerator.UniqueId("rzdlgbody");

    /// <summary>
    /// Gets the unique identifier for the dialog footer container, usable as an HTMX target ID.
    /// </summary>
    public string FooterId { get; } = IdGenerator.UniqueId("rzdlgfoot");

    /// <summary>
    /// Gets or sets the content of the dialog, which should include a <see cref="DialogTrigger"/>
    /// and a <see cref="DialogContent"/>. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets the name of the window event that will trigger this dialog to open.
    /// If empty, a unique name will be generated.
    /// </summary>
    [Parameter]
    public string EventTriggerName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the name of the window event that will trigger this dialog to close.
    /// Defaults to the value defined in <see cref="Constants.Events.DialogClose"/>.
    /// </summary>
    [Parameter]
    public string CloseEventName { get; set; } = Constants.Events.DialogClose;

    /// <summary>
    /// Gets or sets whether the dialog should close when the Escape key is pressed.
    /// Defaults to true.
    /// </summary>
    [Parameter]
    public bool CloseOnEscape { get; set; } = true;

    /// <summary>
    /// Gets or sets whether the dialog should close when a click occurs on the backdrop.
    /// Defaults to true.
    /// </summary>
    [Parameter]
    public bool CloseOnClickOutside { get; set; } = true;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(EventTriggerName))
        {
            EventTriggerName = $"show-dialog-{Id}";
        }
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzDialog;

    /// <summary>
    /// Defines the slots available for styling in the RzDialog component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}
