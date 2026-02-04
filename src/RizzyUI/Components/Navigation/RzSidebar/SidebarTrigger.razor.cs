
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// An interactive element, typically a button, that toggles the open/closed state of the sidebar.
/// It must be placed within an <see cref="RzSidebarProvider"/>.
/// </summary>
public partial class SidebarTrigger : RzComponent<SidebarTrigger.Slots>
{
    /// <summary>
    /// Defines the default styling for the SidebarTrigger component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline-flex items-center justify-center rounded-md p-2 text-sidebar-foreground hover:bg-sidebar-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sidebar-ring"
    );

    /// <summary>
    /// Gets the parent <see cref="RzSidebarProvider"/> which manages the state.
    /// </summary>
    [CascadingParameter]
    protected RzSidebarProvider? ParentProvider { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered inside the trigger button.
    /// If not provided, a default icon may be rendered by the theme.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the ARIA label for the trigger, providing an accessible name.
    /// If not set, it defaults to a localized "Toggle sidebar".
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentProvider == null)
        {
            throw new InvalidOperationException($"{nameof(SidebarTrigger)} must be used within an {nameof(RzSidebarProvider)}.");
        }
        Element = "button";
        AriaLabel ??= Localizer["RzSidebarTrigger.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzSidebarTrigger.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarTrigger;

    /// <summary>
    /// Defines the slots available for styling in the SidebarTrigger component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}