
using Microsoft.AspNetCore.Components;

namespace RizzyUI;

/// <summary>
/// A list item (`<li>`) that renders a separator between breadcrumb items.
/// It defaults to a chevron icon but can be customized with child content.
/// </summary>
public partial class BreadcrumbSeparator : RzComponent
{
    /// <summary>
    /// Gets or sets the custom content to be used as a separator, overriding the default icon.
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
}