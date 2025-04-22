using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     A container component for a list of <see cref="RzSidebarLinkItem" />s within an <see cref="RzSidebar" />.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzSidebarLinks : RzComponent
{
    /// <summary> The child content, expected to be <see cref="RzSidebarLinkItem" /> components. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzSidebarLinks.List);
    }
}