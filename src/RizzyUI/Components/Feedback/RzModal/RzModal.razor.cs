using Microsoft.AspNetCore.Components;
using Rizzy.Utility;
using RizzyUI.Extensions;
using Blazicons;

namespace RizzyUI;

/// <xmldoc>
/// Renders a modal dialog component that can be triggered by a specified event name or opened programmatically.
/// Supports dynamic content loading/swapping within its body or footer using HTMX by targeting the BodyId or FooterId.
/// Includes backdrop, transitions, focus trapping, and configurable closing behavior (Escape, backdrop click, close event).
/// Styling is controlled by the active <see cref="RzTheme"/>. Interactivity is managed by the 'rzModal' Alpine.js component.
/// Dispatches lifecycle events: rz:modal-initialized, rz:modal-before-open, rz:modal-after-open, rz:modal-before-close, rz:modal-after-close.
/// </xmldoc>
public partial class RzModal : RzComponent
{
    /// <summary>
    /// Gets the unique identifier for the root x-data element. Useful if multiple modals need distinct event handling.
    /// Also passed to Alpine for event details.
    /// </summary>
    protected string UniqueId { get; } = IdGenerator.UniqueId("rzmdlwrapper");

    /// <summary>
    /// Gets the unique identifier used for the `aria-labelledby` attribute, linking the dialog to its title.
    /// </summary>
    protected string AriaLabelId { get; } = IdGenerator.UniqueId("rzmdlttl");

    /// <summary>
    /// Gets the unique identifier for the modal body container, usable as an HTMX target ID.
    /// Passed to Alpine for the initialized event detail.
    /// </summary>
    public string BodyId { get; } = IdGenerator.UniqueId("rzmdlbody");

    /// <summary>
    /// Gets the unique identifier for the modal footer container, usable as an HTMX target ID.
    /// Passed to Alpine for the initialized event detail.
    /// </summary>
    public string FooterId { get; } = IdGenerator.UniqueId("rzmdlfoot");

    /// <summary>
    /// Gets or sets the name of the window event that will trigger this modal to open.
    /// If empty, the modal must be opened programmatically (e.g., via Alpine.js $dispatch or direct JS).
    /// </summary>
    [Parameter]
    public string EventTriggerName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the name of the window event that will trigger this modal to close (e.g., from an HTMX response header).
    /// Defaults to the value defined in <see cref="Constants.Events.ModalClose"/>.
    /// </summary>
    [Parameter]
    public string CloseEventName { get; set; } = Constants.Events.ModalClose;

    /// <summary>
    /// Gets or sets the title text displayed in the modal header. Used if <see cref="TitleContent"/> is null.
    /// </summary>
    [Parameter]
    public string? Title { get; set; }

    /// <summary>
    /// Gets or sets the size variant of the modal dialog, controlling its maximum width.
    /// Defaults to <see cref="ModalSize.Medium"/>.
    /// </summary>
    [Parameter]
    public ModalSize Size { get; set; } = ModalSize.Medium;

    /// <summary>
    /// Gets or sets custom content to be rendered in the modal's title area, overriding the <see cref="Title"/> parameter.
    /// Allows for more complex title structures.
    /// </summary>
    [Parameter]
    public RenderFragment? TitleContent { get; set; }

    /// <summary>
    /// Gets or sets the main content to be displayed within the modal body. Can be targeted by HTMX.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets optional content to be displayed in a distinct footer section. Can be targeted by HTMX.
    /// </summary>
    [Parameter]
    public RenderFragment? FooterContent { get; set; }

    /// <summary>
    /// Gets or sets whether the modal should close when the Escape key is pressed.
    /// Passed to the Alpine component. Defaults to true.
    /// </summary>
    [Parameter]
    public bool CloseOnEscape { get; set; } = true;

    /// <summary>
    /// Gets or sets whether the modal should close when a click occurs on the backdrop outside the dialog.
    /// Passed to the Alpine component. Defaults to true.
    /// </summary>
    [Parameter]
    public bool CloseOnClickOutside { get; set; } = true;

    /// <summary>
    /// Gets or sets whether to display the header section (including title and close button).
    /// Defaults to true.
    /// </summary>
    [Parameter]
    public bool ShowHeader { get; set; } = true;

    /// <summary>
    /// Gets or sets whether to display the default close ('X') button in the header.
    /// Only relevant if ShowHeader is true. Defaults to true.
    /// </summary>
    [Parameter]
    public bool ShowCloseButton { get; set; } = true;

    /// <inheritdoc />
    protected override string? RootClass()
    {
        var styles = Theme.RzModal;
        return TwMerge.Merge(AdditionalAttributes,
            styles.Dialog,
            styles.GetSizeCss(Size)
        );
    }
}