
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A root container for a breadcrumb navigation trail. It renders as a <c><nav></c> element
/// and should contain a <see cref="BreadcrumbList"/> component.
/// </summary>
public partial class RzBreadcrumb : RzComponent
{
    /// <summary>
    /// Gets or sets the content to be rendered inside the breadcrumb container,
    /// which should be a <see cref="BreadcrumbList"/> component.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the ARIA label for the breadcrumb navigation container, providing context for screen readers.
    /// If not set, it defaults to a localized "Breadcrumb".
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "nav";

        AriaLabel ??= Localizer["RzBreadcrumb.AriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzBreadcrumb.AriaLabel"];
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzBreadcrumb.Container);
    }
}