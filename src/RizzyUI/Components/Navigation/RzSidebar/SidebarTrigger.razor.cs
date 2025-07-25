
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// An interactive element, typically a button, that toggles the open/closed state of the sidebar.
/// It must be placed within an <see cref="RzSidebarProvider"/>.
/// </summary>
public partial class SidebarTrigger : RzComponent
{
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
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.SidebarTrigger.Trigger);
    }
}