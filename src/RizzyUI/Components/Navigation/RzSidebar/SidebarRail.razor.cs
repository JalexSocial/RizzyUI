using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// An interactive rail component used within a <see cref="RzSidebarProvider"/> to toggle the sidebar's visibility.
/// It renders as a button and is typically positioned at the edge of the sidebar.
/// </summary>
/// <remarks>
/// This is a nested component and should be used inside a <see cref="Sidebar"/> component.
/// It does not render any child content and is self-contained.
/// </remarks>
public partial class SidebarRail : RzComponent
{
    /// <summary>
    /// Gets the parent <see cref="RzSidebarProvider"/> to access shared state and functions.
    /// </summary>
    [CascadingParameter]
    protected RzSidebarProvider? ParentProvider { get; set; }

    /// <summary>
    /// Gets or sets the ARIA label for the rail, providing an accessible name for the toggle action.
    /// If not set, it defaults to a localized "Toggle Sidebar".
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentProvider == null)
        {
            throw new InvalidOperationException($"{nameof(SidebarRail)} must be used within an {nameof(RzSidebarProvider)}.");
        }
        
        if (string.IsNullOrEmpty(Element))
            Element = "button";

        AriaLabel ??= Localizer["RzSidebarRail.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzSidebarRail.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.SidebarRail.Rail);
    }
}