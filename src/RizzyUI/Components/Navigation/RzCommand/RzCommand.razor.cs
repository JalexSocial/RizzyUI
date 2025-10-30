
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A highly interactive and accessible command menu component, inspired by cmdk and shadcn/ui.
/// It serves as the root container and state manager for the entire command menu family.
/// </summary>
public partial class RzCommand : RzComponent<RzCommand.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzCommand component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground"
    );

    /// <summary>
    /// Gets or sets the child content, which should include the various Command components like CommandInput and CommandList.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the accessible name for the command menu.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the component should automatically filter and sort items based on the search query.
    /// Defaults to true.
    /// </summary>
    [Parameter]
    public bool ShouldFilter { get; set; } = true;

    /// <summary>
    /// Gets or sets a value indicating whether keyboard navigation should wrap around from the last item to the first, and vice-versa.
    /// Defaults to false.
    /// </summary>
    [Parameter]
    public bool Loop { get; set; }

    /// <summary>
    /// Gets or sets the currently selected value. This can be used to programmatically control the selection.
    /// </summary>
    [Parameter]
    public string? SelectedValue { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        AriaLabel ??= Localizer["RzCommand.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzCommand.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzCommand;

    /// <summary>
    /// Defines the slots available for styling in the RzCommand component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the main command container.
        /// </summary>
        [Slot("command")]
        public string? Base { get; set; }
    }
}