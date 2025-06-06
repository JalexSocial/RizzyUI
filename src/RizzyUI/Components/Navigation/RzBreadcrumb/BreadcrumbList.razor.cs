
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// An ordered list (`<ol>`) that contains the breadcrumb items. This component should be
/// a direct child of <see cref="RzBreadcrumb"/>.
/// </summary>
public partial class BreadcrumbList : RzComponent
{
    /// <summary>
    /// Gets or sets the content of the list, which should be a sequence of
    /// <see cref="BreadcrumbItem"/> and <see cref="BreadcrumbSeparator"/> components.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "ol";
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzBreadcrumb.List);
    }
}