
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A visual separator line used to divide sections within the sidebar.
/// </summary>
public partial class SidebarSeparator : RzComponent
{
    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "hr";
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.SidebarSeparator.Separator);
    }
}