
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A `<span>` element representing the current page in a breadcrumb trail. It is not interactive.
/// </summary>
public partial class BreadcrumbPage : RzComponent
{
    /// <summary>
    /// Gets or sets the text content for the current page.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

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
        return TwMerge.Merge(AdditionalAttributes, Theme.RzBreadcrumb.Page);
    }
}