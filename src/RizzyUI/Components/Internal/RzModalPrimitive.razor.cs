using Microsoft.AspNetCore.Components;

namespace RizzyUI;

/// <summary>
/// Internal primitive that renders a teleported modal overlay and content panel.
/// </summary>
public partial class RzModalPrimitive : RzComponent
{
    /// <summary>
    /// Gets or sets the ARIA role applied to the modal panel.
    /// </summary>
    [Parameter]
    public string Role { get; set; } = "dialog";

    /// <summary>
    /// Gets or sets the optional ARIA label for the modal panel.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <summary>
    /// Gets or sets the optional element ID that labels the modal panel.
    /// </summary>
    [Parameter]
    public string? AriaLabelledBy { get; set; }

    /// <summary>
    /// Gets or sets the optional element ID that describes the modal panel.
    /// </summary>
    [Parameter]
    public string? AriaDescribedBy { get; set; }

    /// <summary>
    /// Gets or sets the class list applied to the overlay element.
    /// </summary>
    [Parameter]
    public string? OverlayClass { get; set; }

    /// <summary>
    /// Gets or sets the class list applied to the modal panel.
    /// </summary>
    [Parameter]
    public string? ContentClass { get; set; }

    /// <summary>
    /// Gets or sets the data-slot value for the overlay element.
    /// </summary>
    [Parameter]
    public string OverlayDataSlot { get; set; } = "modal-overlay";

    /// <summary>
    /// Gets or sets the data-slot value for the content element.
    /// </summary>
    [Parameter]
    public string ContentDataSlot { get; set; } = "modal-content";

    /// <summary>
    /// Gets or sets the content rendered inside the modal panel.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }
}
