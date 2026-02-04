
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A composite component that renders an <see cref="RzCommand"/> menu inside a modal <see cref="RzDialog"/>.
/// </summary>
public partial class RzCommandDialog : RzComponent<RzCommandDialog.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzCommandDialog component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "overflow-hidden p-0",
        slots: new()
        {
            [s => s.Command] = "[&_[data-slot=command-group-heading]]:text-muted-foreground [&_[data-slot=command-group-heading]]:px-2 [&_[data-slot=command-group-heading]]:font-medium [&_[data-slot=command-group]]:px-2 [&_[data-slot=command-group]:not([hidden])_~[data-slot=command-group]]:pt-0 [&_[data-slot=command-input-wrapper]_svg]:h-5 [&_[data-slot=command-input-wrapper]_svg]:w-5 [&_[data-slot=command-input]]:h-12 [&_[data-slot=command-input]]:h-12 [&_[data-slot=command-input-wrapper]]:h-12 [&_[data-slot=command-item]]:px-2 [&_[data-slot=command-item]]:py-3 [&_[data-slot=command-item]_svg]:h-5 [&_[data-slot=command-item]_svg]:w-5"
        }
    );

    /// <summary>
    /// Gets or sets a value indicating whether the dialog is open.
    /// </summary>
    [Parameter]
    public bool Open { get; set; }

    /// <summary>
    /// Gets or sets the title for the dialog, used for accessibility.
    /// </summary>
    [Parameter]
    public string? Title { get; set; }

    /// <summary>
    /// Gets or sets the description for the dialog, used for accessibility.
    /// </summary>
    [Parameter]
    public string? Description { get; set; }

    /// <summary>
    /// Gets or sets the child content of the command menu.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether to show the default close button on the dialog.
    /// </summary>
    [Parameter]
    public bool ShowCloseButton { get; set; } = true;

    /// <summary>
    /// Gets or sets a value indicating whether the command menu should filter items.
    /// </summary>
    [Parameter]
    public bool ShouldFilter { get; set; } = true;

    /// <summary>
    /// Gets or sets a value indicating whether keyboard navigation should loop.
    /// </summary>
    [Parameter]
    public bool Loop { get; set; }

    /// <summary>
    /// Gets or sets the currently selected value in the command menu.
    /// </summary>
    [Parameter]
    public string? SelectedValue { get; set; }

    /// <summary>
    /// Gets or sets the name of the window event that will trigger this dialog to open.
    /// If empty, a unique name will be generated.
    /// </summary>
    [Parameter]
    public string EventTriggerName { get; set; } = string.Empty;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Title ??= Localizer["RzCommandDialog.DefaultTitle"];
        Description ??= Localizer["RzCommandDialog.DefaultDescription"];

        if (string.IsNullOrEmpty(EventTriggerName))
        {
            EventTriggerName = $"show-command-dialog-{Id}";
        }
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        Title ??= Localizer["RzCommandDialog.DefaultTitle"];
        Description ??= Localizer["RzCommandDialog.DefaultDescription"];
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzCommandDialog;

    /// <summary>
    /// Defines the slots available for styling in the RzCommandDialog component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the dialog content panel.
        /// </summary>
        [Slot("dialog-content")]
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the nested RzCommand component.
        /// </summary>
        [Slot("command")]
        public string? Command { get; set; }
    }
}