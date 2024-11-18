using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using System.Collections.Generic;

namespace RizzyUI;

/// <summary>
/// A generic Blazor component that renders a specified HTML element with optional content and attributes.
/// </summary>
public class HtmlElement : ComponentBase
{
    /// <summary>
    /// Specifies the root HTML element to render (e.g., "div", "a", "button").
    /// If not set, defaults to "div".
    /// </summary>
    [Parameter]
    public string Element { get; set; } = "div";

    /// <summary>
    /// Represents the content to be rendered inside the HTML element.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// A collection of additional attributes to apply to the HTML element.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }

    /// <summary>
    /// Builds the component's render tree.
    /// </summary>
    /// <param name="builder">An instance of <see cref="RenderTreeBuilder"/> used to build the render tree.</param>
    protected override void BuildRenderTree(RenderTreeBuilder builder)
    {
        var elementName = Element ?? "div";

        builder.OpenElement(0, elementName);
        builder.AddMultipleAttributes(1, AdditionalAttributes);
        builder.AddContent(3, ChildContent);
        builder.CloseElement();
    }
}