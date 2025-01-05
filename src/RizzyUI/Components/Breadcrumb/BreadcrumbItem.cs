using Blazicons;
using Microsoft.AspNetCore.Components;

namespace RizzyUI;

/// <summary>
/// Represents an individual item within a breadcrumb navigation component.
/// </summary>
public class BreadcrumbItem : RizzyComponent
{
    /// <summary>
    /// Gets or sets the parent <see cref="Breadcrumb"/> component.
    /// </summary>
    [CascadingParameter]
    private Breadcrumb? ParentBreadcrumb { get; set; }

    /// <summary>
    /// The URL that the breadcrumb item links to.
    /// </summary>
    [Parameter]
    public string Href { get; set; } = "#";

    /// <summary>
    /// The display text of the breadcrumb item.
    /// </summary>
    [Parameter]
    public string Label { get; set; } = string.Empty;

    /// <summary>
    /// Indicates whether this breadcrumb item represents the current page.
    /// </summary>
    [Parameter]
    public bool IsActive { get; set; } = false;

    /// <summary>
    /// Gets or sets the icon displayed in the breadcrumb, overrides Label if provided.
    /// </summary>
    [Parameter]
    public SvgIcon? Icon { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        ParentBreadcrumb?.RegisterItem(this);
    }

    /// <summary>
    /// Gets the content to be rendered for this breadcrumb item.
    /// </summary>
    public RenderFragment Content => builder =>
    {
        if (!IsActive)
        {
            builder.OpenElement(0, "a");
            builder.AddAttribute(1, "href", Href);
            builder.AddMultipleAttributes(2, AdditionalAttributes);
            builder.AddAttribute(3, "class", "text-onSurface dark:text-onSurfaceDark hover:text-onSurfaceStrong dark:hover:text-onSurfaceStrongDark");
            if (Icon != null)
            {
                builder.OpenElement(4, "span");
                builder.AddAttribute(5, "class", "text-xl");

                builder.OpenComponent<Blazicon>(6);
                builder.AddAttribute(7, "Svg", Icon);
                builder.CloseComponent();

                builder.CloseElement();
            }
            else
            {
                builder.AddContent(8, Label);
            }
            builder.CloseElement();
        }
        else
        {
            builder.OpenElement(0, "span");
            builder.AddAttribute(1, "class", "font-bold text-onSurface dark:text-onSurfaceDark");
            builder.AddAttribute(2, "aria-current", "page");
            builder.AddMultipleAttributes(3, AdditionalAttributes);
            if (Icon != null)
            {
                builder.OpenElement(4, "span");
                builder.AddAttribute(5, "class", "text-xl");

                builder.OpenComponent<Blazicon>(6);
                builder.AddAttribute(7, "Svg", Icon);
                builder.CloseComponent();

                builder.CloseElement();
            }
            else
            {
                builder.AddContent(8, Label);
            }
            builder.CloseElement();
        }
    };
}
