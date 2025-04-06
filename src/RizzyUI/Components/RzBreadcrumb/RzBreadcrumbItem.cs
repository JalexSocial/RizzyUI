using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Styling;

namespace RizzyUI;

/// <xmldoc>
/// Represents an individual item within a <see cref="RzBreadcrumb"/> navigation component.
/// It renders either a link or a span depending on its `IsActive` state.
/// Styling is determined by the active <see cref="RzTheme"/>.
/// </xmldoc>
public class RzBreadcrumbItem : RzComponent // Inherit RzComponent for potential future use, though no root element here
{
    /// <summary> Get the currently active theme via Cascading Parameter. </summary>
    [CascadingParameter] protected RzTheme? CascadedTheme { get; set; }
    /// <summary> Gets or sets the parent <see cref="RzBreadcrumb"/> component. </summary>
    [CascadingParameter] private RzBreadcrumb? ParentBreadcrumb { get; set; }
    /// <summary> Injected configuration to get the default theme as fallback. </summary>
    [Inject] private IOptions<RizzyUIConfig>? Config { get; set; }
    /// <summary> The effective theme being used (Cascaded or Default). </summary>
    protected RzTheme Theme { get; set; } = default!;

    /// <summary> The URL that the breadcrumb item links to (ignored if IsActive is true). Defaults to "#". </summary>
    [Parameter] public string Href { get; set; } = "#";
    /// <summary> The display text of the breadcrumb item. Required. </summary>
    [Parameter, EditorRequired] public string Label { get; set; } = string.Empty;
    /// <summary> Indicates whether this breadcrumb item represents the current page. If true, renders as a span; otherwise, renders as a link. </summary>
    [Parameter] public bool IsActive { get; set; } = false;
    /// <summary> An optional Blazicon SVG icon to display instead of the text label. </summary>
    [Parameter] public SvgIcon? Icon { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Theme = CascadedTheme ?? Config?.Value.DefaultTheme ?? RzTheme.Default;
         if (Theme == null)
            throw new InvalidOperationException($"{GetType()} requires a cascading RzTheme or a default theme configured.");
        if (ParentBreadcrumb == null)
            throw new InvalidOperationException($"{nameof(RzBreadcrumbItem)} must be used within an {nameof(RzBreadcrumb)} component.");

        ParentBreadcrumb.RegisterItem(this);
    }

    /// <summary>
    /// Gets the RenderFragment content to be rendered by the parent <see cref="RzBreadcrumb"/>.
    /// This dynamically creates either an anchor or a span based on the IsActive state.
    /// </summary>
    internal RenderFragment Content => builder =>
    {
        var styles = Theme.RzBreadcrumbItem; // Access styles via Theme

        if (!IsActive)
        {
            builder.OpenElement(0, "a");
            builder.AddAttribute(1, "href", Href);
            builder.AddMultipleAttributes(2, AdditionalAttributes); // Apply extra attributes to the link
            builder.AddAttribute(3, "class", styles.Link); // Apply link styles
            RenderInnerContent(builder, styles);
            builder.CloseElement(); // a
        }
        else
        {
            builder.OpenElement(0, "span");
            builder.AddAttribute(1, "class", styles.ActiveSpan); // Apply active span styles
            builder.AddAttribute(2, "aria-current", "page");
            builder.AddMultipleAttributes(3, AdditionalAttributes); // Apply extra attributes to the span
            RenderInnerContent(builder, styles);
            builder.CloseElement(); // span
        }
    };

    /// <summary>
    /// Helper method to render the icon or label content.
    /// </summary>
    private void RenderInnerContent(Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder builder, RzStylesBase.RzBreadcrumbItemStylesBase styles)
    {
        if (Icon != null)
        {
            builder.OpenElement(4, "span");
            builder.AddAttribute(5, "class", styles.IconSpan); // Apply icon span styles
            builder.OpenComponent<Blazicon>(6);
            builder.AddAttribute(7, "Svg", Icon);
            builder.CloseComponent(); // Blazicon
            builder.CloseElement(); // span
        }
        else
        {
            builder.AddContent(8, Label);
        }
    }
}

