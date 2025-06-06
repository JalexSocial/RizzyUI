
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// An anchor link (`<a>`) for a breadcrumb item that is not the current page.
/// It can contain simple text or more complex components like <see cref="RzLink"/>.
/// </summary>
public partial class BreadcrumbLink : RzComponent
{
    /// <summary>
    /// Gets or sets the URL the link navigates to.
    /// </summary>
    [Parameter]
    public string? Href { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered inside the link.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "a";
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzBreadcrumb.Link);
    }
}