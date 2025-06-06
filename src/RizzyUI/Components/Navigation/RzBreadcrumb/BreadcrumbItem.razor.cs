
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A list item (`<li>`) that wraps a breadcrumb link, page, or separator.
/// This component should be a child of <see cref="BreadcrumbList"/>.
/// </summary>
public partial class BreadcrumbItem : RzComponent
{
    /// <summary>
    /// Gets or sets the content of the breadcrumb item, such as a <see cref="BreadcrumbLink"/>
    /// or <see cref="BreadcrumbPage"/>.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "li";
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzBreadcrumb.Item);
    }
}