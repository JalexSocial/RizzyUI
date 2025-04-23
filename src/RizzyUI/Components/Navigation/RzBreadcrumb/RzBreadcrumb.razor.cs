
using Blazicons;
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Represents a breadcrumb navigation component that displays a list of navigation links.
///     Styling is determined by the active <see cref="RzTheme" />. Child <see cref="RzBreadcrumbItem" />
///     components register themselves with this parent.
/// </xmldoc>
public partial class RzBreadcrumb : RzComponent
{
    /// <summary> Gets the list of breadcrumb items registered with this breadcrumb component. </summary>
    protected readonly List<RzBreadcrumbItem> Items = new();

    /// <summary> Specifies the Blazicon SVG icon to use as a separator between items. Defaults to ChevronRight. </summary>
    [Parameter]
    public SvgIcon Separator { get; set; } = MdiIcon.ChevronRight;

    /// <summary> Child content for the breadcrumb component, should contain <see cref="RzBreadcrumbItem" /> components. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzBreadcrumb.Container);
    }

    /// <summary>
    ///     Registers a breadcrumb item with this breadcrumb component. Called by child items.
    /// </summary>
    /// <param name="item">The breadcrumb item to register.</param>
    internal void RegisterItem(RzBreadcrumbItem item)
    {
        if (!Items.Contains(item)) // Prevent duplicate registration
        {
            Items.Add(item);
            InvokeAsync(StateHasChanged); // Update UI when items are added
        }
    }
}