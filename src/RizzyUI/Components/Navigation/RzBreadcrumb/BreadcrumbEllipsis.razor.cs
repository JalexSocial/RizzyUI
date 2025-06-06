
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Renders an ellipsis icon, typically used within a <see cref="BreadcrumbItem"/> to indicate
/// a collapsed menu of breadcrumb links.
/// </summary>
public partial class BreadcrumbEllipsis : RzComponent
{
    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "span";
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzBreadcrumb.EllipsisContainer);
    }
}